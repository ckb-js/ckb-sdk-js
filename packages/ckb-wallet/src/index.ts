import Rpc from '@ckb-sdk/rpc'
import Account from './account'

class Wallet {
  static accountFromPrivateKey = (pk: Buffer) => new Account(pk, null, null)

  private _rpc: Rpc

  private _accounts: Account[] = []

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

  public newAccount = (sk: Buffer, pk: Buffer | null, opt: any) => {
    // TODO:
    const acc = new Account(sk, pk, opt)
    this._accounts.push(acc)
    return acc
  }

  public generateTx = (
    toAddr: Buffer = Buffer.from([]),
    capacity: number = 0,
  ) => {
    // TODO:
    const deps = [
      {
        hash:
          '0x15c809f08c7bca63d2b661e1dbc26c74551a6f982f7631c718dc43bd2bb5c90e',
        index: 0,
      },
    ]
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
    this.generateTx()
    // this._rpc.
    // TODO:
  }

  public gatherInputs = async (capacity: number, minCapacity: number) => {
    if (capacity < minCapacity) {
      throw new Error(`Capacity cannot be less than ${minCapacity}`)
    }

    let inputCapacities = 0
    const inputs = []
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
