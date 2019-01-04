import Rpc from '@ckb-sdk/rpc'
import Account from './account'

class Wallet {
  static accountFromPrivateKey = (sk: Buffer) => new Account(sk, {})

  private _rpc: Rpc

  private _accounts: Account[] = []

  public deps: CkbComponents.IOutPoint[] = []

  public constructor(rpc: Rpc) {
    this._rpc = rpc
  }

  public getAccounts(idx?: number): Account[] | Account | null {
    if (idx !== undefined) {
      return this._accounts[idx] || null
    }
    return this._accounts
  }

  public setRpc(rpc: Rpc) {
    this._rpc = rpc
  }

  public get rpc() {
    return this._rpc
  }

  public newAccount = (sk: Buffer, opt: any) => {
    // TODO:
    const acc = new Account(sk, opt)
    this._accounts.push(acc)
    return acc
  }

  public getCells = (idx?: number): CkbComponents.ICell[] => []

  public getCellsByTypeHash = (
    typeHash: string,
    from: number = 0,
    to: number = Number.MAX_SAFE_INTEGER,
  ) => this._rpc.getCellsByTypeHash(typeHash, from, to)

  public getBalanceByTypeHash = (
    typeHash: string,
    from: number = 0,
    to: number = Number.MAX_SAFE_INTEGER,
  ) =>
    this.getCellsByTypeHash(typeHash, from, to).then(cells => {
      cells.reduce((acc, cell) => acc + cell.capacity, 0)
    })

  public genTxByTypeHash = async (
    toAdd: Buffer = Buffer.from([]),
    capacity: number = 0,
    typeHash: string = '',
  ) => {
    const blockNumber = await this.rpc.getTipBlockNumber()
    const cells = await this.getCellsByTypeHash(
      typeHash,
      blockNumber,
      blockNumber,
    )
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
    capacity: number = 0,
  ) => {
    // this.generateTx()
    // this._rpc.
    // TODO:
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
        inputCapacities >= capacity
        && inputCapacities >= minCapacity + capacity
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
