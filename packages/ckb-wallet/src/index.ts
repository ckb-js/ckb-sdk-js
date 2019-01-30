import RPC from '@ckb-sdk/rpc'
import { hexToBytes } from '@ckb-sdk/utils'
import Account from './account'
import ASW from './alwaysSuccessAccount'
import UDTAccount, { TokenInfo } from './UDTAccount'

const aswSkStr =
  'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3'
const aswSkBytes = Buffer.from(hexToBytes(aswSkStr))
class Wallet {
  public accountFromPrivateKey = (sk: Buffer) => new Account(sk, this.rpc, {})

  public rpc: RPC

  private _accounts: Account[] = []

  public deps: CKBComponents.IOutPoint[] = []

  public constructor(rpc: RPC) {
    this.rpc = rpc
  }

  public getAccounts(idx?: number): Account[] | Account | null {
    if (idx !== undefined) {
      return this._accounts[idx] || null
    }
    return this._accounts
  }

  public newAccount = (sk: Uint8Array, opt: any) => {
    // TODO:
    const acc = new Account(sk, this.rpc, opt)
    this._accounts.push(acc)
    return acc
  }

  public newASW = () => new ASW(aswSkBytes, this.rpc)

  public newUDTAccount = (
    sk: string | Uint8Array,
    tokenInfo: TokenInfo,
    opt: any
  ) => new UDTAccount(sk, this.rpc, tokenInfo, opt)

  public getCells = (idx?: number): CKBComponents.ICell[] => {
    console.info(idx)
    return []
  }

  public getCellsByTypeHash = (
    typeHash: string,
    from: number = 0,
    to: number = Number.MAX_SAFE_INTEGER
  ) => this.rpc.getCellsByTypeHash(typeHash, from, to)

  public getBalanceByTypeHash = (
    typeHash: string,
    from: number = 0,
    to: number = Number.MAX_SAFE_INTEGER
  ) =>
    this.getCellsByTypeHash(typeHash, from, to).then(cells => {
      cells.reduce((acc, cell) => acc + cell.capacity, 0)
    })

  public genTxByTypeHash = async (
    toAdd: Buffer = Buffer.from([]),
    capacity: number = 0,
    typeHash: string = ''
  ) => {
    const blockNumber = await this.rpc.getTipBlockNumber()
    const cells = await this.getCellsByTypeHash(
      typeHash,
      blockNumber,
      blockNumber
    )
    console.log(toAdd, capacity, cells)
    // TODO:
    const deps = [...this.deps]
    const inputs = [
      {
        previous_output: {
          hash:
            '0x6bf3d08fcda77b998b7617e3e1f397f204d199273f28da8d5d480d9870385f85',
          index: 0,
        },
        unlock: {
          version: 0,
          reference:
            '0xbe53efec824349f8b8bd9cfa93ccee25c6e1d544e6bd686f720a4c27d933cd71',
          signed_args: [],
          args: [],
        },
      },
    ]
    const outputs = [
      {
        capacity: 12345,
        data: [],
        lock:
          '0xc35e6ddf1140e7feaef6431bb182d11071f4bfb5e68d05b7ad0a95cbfccb4a66',
      },
      {
        capacity: 4987655,
        data: [],
        lock:
          '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674',
      },
    ]
    // start
    return {
      version: 0,
      deps,
      inputs,
      outputs,
    }
    // end
  }

  public sendCapacity = (
    toAddr: Buffer = Buffer.from([]),
    capacity: number = 0
  ) => {
    // this.generateTx()
    // this._rpc.
    // TODO:
    console.log(toAddr, capacity)
  }

  public gatherInputs = async (capacity: number, minCapacity: number) => {
    if (capacity < minCapacity) {
      throw new Error(`Capacity cannot be less than ${minCapacity}`)
    }

    let inputCapacities = 0
    const inputs: any[] = []
    const unspentCells = await this.getUnspentCells()
    unspentCells.every((cell: any) => {
      const input = {
        prevOutput: {
          hash: cell.out_point.hash,
          index: cell.out_point.index,
        },
        // unlock: this.verifyScriptJsonObject(),
      }
      inputs.push(input)
      inputCapacities += cell.capacity
      if (
        inputCapacities >= capacity &&
        inputCapacities >= minCapacity + capacity
      ) {
        return false
      }
      return true
    })
    if (capacity > inputCapacities) {
      throw new Error('Not enough capacity')
    }
    // TODO:
  }

  public getUnspentCells = () => []
}
export default Wallet
