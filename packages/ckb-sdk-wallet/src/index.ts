import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import Account from './account'
import ASW from './alwaysSuccessAccount'

const aswSkStr = 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3'
const aswSkBytes = Buffer.from(hexToBytes(aswSkStr))
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

  public newASW = () => new ASW(aswSkBytes, this.rpc)
}
export default Wallet
