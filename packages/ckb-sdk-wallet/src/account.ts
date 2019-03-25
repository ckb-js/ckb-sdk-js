import ECPair, { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { hexToBytes, jsonScriptToTypeHash } from '@nervosnetwork/ckb-sdk-utils'

class Account extends ECPair {
  public VERIFY_SCRIPT: string = ''

  public static MIN_CELL_CAPACITY = 10

  public rpc: RPC

  public unlockScript: CKBComponents.Script = {
    version: 0,
    reference: '',
    signedArgs: [],
    args: [],
  }

  public contractScript: CKBComponents.Script = {
    version: 0,
    reference: '',
    signedArgs: [],
    args: [],
  }

  get unlockTypeHash(): string {
    return jsonScriptToTypeHash(this.unlockScript) as string
  }

  get contractTypeHash(): string {
    return jsonScriptToTypeHash(this.contractScript) as string
  }

  get address() {
    return this.unlockTypeHash
  }

  public deps: CKBComponents.OutPoint[] = []

  public constructor(sk: Uint8Array | string, rpc: RPC, options?: Options) {
    super(typeof sk === 'string' ? hexToBytes(sk) : sk, options)
    this.rpc = rpc
  }

  public get hexPubKey(): string {
    return Buffer.from(this.publicKey).toString('hex')
  }

  // =========================

  getUnspentCells = async () => {
    // TODO: in the ruby sdk demo,
    // it iterates all block to gather cells,
    // however only P1CS needs to be covered, TBD
    const to = await this.rpc.getTipBlockNumber()
    const cells = await this.rpc.getCellsByTypeHash(`0x${this.unlockTypeHash}`, 0, to)
    return cells
  }

  getBalance = async (): Promise<string> =>
    this.getUnspentCells().then(cells => cells.reduce((a, c) => a + c.capacity, 0).toString())

  // ========================================

  gatherInputs = async (capacity: CKBComponents.Capacity, minCapacity: CKBComponents.Capacity) => {
    if (capacity < minCapacity) {
      throw new Error(`Capacity cannot less than ${minCapacity}`)
    }
    let inputCapacities = 0
    const inputs: CKBComponents.CellInput[] = []
    await this.getUnspentCells().then(cells =>
      cells.every(cell => {
        const input: CKBComponents.CellInput = {
          prevOutput: cell.outPoint,
          unlock: this.unlockScript,
        }
        inputs.push(input)
        inputCapacities += cell.capacity
        if (inputCapacities >= capacity && inputCapacities - capacity >= minCapacity) {
          return false
        }
        return true
      }))

    if (inputCapacities < capacity) {
      throw new Error(`Not enough capacity, required: ${capacity}, available: ${inputCapacities}`)
    }
    return {
      inputs,
      capacity: inputCapacities,
    }
  }

  generateTx = async (
    targetAddr: CKBComponents.Hash,
    targetCapacity: CKBComponents.Capacity
  ): Promise<CKBComponents.Transaction> => {
    const { inputs, capacity } = await this.gatherInputs(targetCapacity, Account.MIN_CELL_CAPACITY)
    const outputs: CKBComponents.CellOutput[] = [
      {
        capacity: targetCapacity,
        data: new Uint8Array(0),
        lock: targetAddr,
      },
    ]
    if (capacity > targetCapacity) {
      outputs.push({
        capacity: capacity - targetCapacity,
        data: new Uint8Array(0),
        lock: `0x${this.unlockTypeHash}`,
      })
    }
    const tx = {
      version: 0,
      deps: this.deps,
      inputs,
      outputs,
    }
    return tx
  }

  sendCapacity = async (targetAddr: CKBComponents.Hash, capacity: CKBComponents.Capacity) => {
    const tx = await this.generateTx(targetAddr, capacity)
    return this.rpc.sendTransaction(tx)
  }

  // ================================

  public verifyScript = ({
    version = 0,
    binary,
    reference,
    signedArgs,
  }: {
    version: number
    binary?: Uint8Array
    reference?: string
    signedArgs?: Uint8Array[]
  }) => ({
    version,
    reference,
    binary,
    signedArgs: signedArgs || [this.VERIFY_SCRIPT, this.hexPubKey],
  })
}

export default Account
