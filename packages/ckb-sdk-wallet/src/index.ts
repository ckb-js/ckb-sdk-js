import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Account from './account'

class Wallet {
  public accountFromPrivateKey = (sk: Buffer) => new Account(sk, this.rpc)

  public rpc: RPC

  private _accounts: Account[] = []

  public deps: CKBComponents.OutPoint[] = []

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
}
export default Wallet
