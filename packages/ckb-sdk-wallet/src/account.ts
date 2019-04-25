import ECPair, { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { hexToBytes, lockScriptToHash } from '@nervosnetwork/ckb-sdk-utils'

class Account extends ECPair {
  public static MIN_CELL_CAPACITY = 10

  public rpc: RPC

  public unlockArgs: Uint8Array[] = []

  public lockScript: CKBComponents.Script = {
    binaryHash: '',
    args: [],
  }

  public contractScript: CKBComponents.Script = {
    binaryHash: '',
    args: [],
  }

  get lockHash(): string {
    return lockScriptToHash(this.lockScript)
  }

  get contractHash(): string {
    return lockScriptToHash(this.contractScript)
  }

  get address() {
    return this.lockHash
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
    const cells = await this.rpc.getCellsByLockHash(`0x${this.lockHash}`, '0', to)
    return cells
  }

  getBalance = async (): Promise<string> =>
    this.getUnspentCells().then(cells => cells.reduce((a, c) => a + +c.capacity, 0).toString())

  // ========================================

  gatherInputs = async (
    capacity: CKBComponents.Capacity,
    minCapacity: CKBComponents.Capacity,
    validSince: string = '0'
  ) => {
    if (capacity < minCapacity) {
      throw new Error(`Capacity cannot less than ${minCapacity}`)
    }
    let inputCapacities = 0
    const inputs: CKBComponents.CellInput[] = []
    await this.getUnspentCells().then(cells =>
      cells.every(cell => {
        const input: CKBComponents.CellInput = {
          previousOutput: cell.outPoint,
          args: this.unlockArgs,
          validSince,
        }
        inputs.push(input)
        inputCapacities += +cell.capacity
        if (inputCapacities >= +capacity && inputCapacities - +capacity >= +minCapacity) {
          return false
        }
        return true
      }))

    if (inputCapacities < +capacity) {
      throw new Error(`Not enough capacity, required: ${capacity}, available: ${inputCapacities}`)
    }
    return {
      inputs,
      capacity: inputCapacities,
    }
  }

  generateTx = async (
    targetLock: CKBComponents.Script,
    targetCapacity: CKBComponents.Capacity
  ): Promise<CKBComponents.RawTransaction> => {
    const { inputs, capacity } = await this.gatherInputs(targetCapacity, `${Account.MIN_CELL_CAPACITY}`)
    const outputs: CKBComponents.CellOutput[] = [
      {
        capacity: targetCapacity,
        data: new Uint8Array(0),
        lock: targetLock,
      },
    ]
    if (capacity > +targetCapacity) {
      outputs.push({
        capacity: `${capacity - +targetCapacity}`,
        data: new Uint8Array(0),
        lock: this.lockScript,
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

  sendCapacity = async (targetLock: CKBComponents.Script, capacity: CKBComponents.Capacity) => {
    const tx = await this.generateTx(targetLock, capacity)
    return this.rpc.sendTransaction(tx)
  }
}

export default Account
