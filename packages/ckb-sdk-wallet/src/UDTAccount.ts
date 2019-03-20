import { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Account from './account'

export class TokenInfo {
  public rpc: RPC

  public name: string

  public publicKey: Uint8Array

  public accountWallet: boolean

  public tokenCell: {
    hash: CKBComponents.Hash
    outPoint: CKBComponents.OutPoint
  } = {
    hash: '',
    outPoint: {
      hash: '',
      index: 0,
    },
  }

  constructor(name: string, rpc: RPC, publicKey: Uint8Array, accountWallet: boolean) {
    this.name = name
    this.rpc = rpc
    this.publicKey = publicKey
    this.accountWallet = accountWallet
  }

  unlockScript = (publicKey: Uint8Array): CKBComponents.Script => ({
    version: 0,
    reference: this.tokenCell.hash,
    signedArgs: [publicKey],
    args: [],
  })

  get contractScript(): CKBComponents.Script {
    return {
      version: 0,
      reference: this.tokenCell.hash,
      signedArgs: [this.publicKey],
      args: [],
    }
  }
}

class UDTBaseAccount extends Account {
  public rpc: RPC

  public tokenInfo: TokenInfo

  public tokenCell: {
    hash: CKBComponents.Hash
    outPoint: CKBComponents.OutPoint
  } = {
    hash: '',
    outPoint: {
      hash: '',
      index: 0,
    },
  }

  constructor(sk: string | Uint8Array, rpc: RPC, tokenInfo: TokenInfo, options: Options) {
    super(sk, rpc, options)
    this.rpc = rpc
    this.tokenInfo = tokenInfo
    this.unlockScript = this.tokenInfo.unlockScript(this.publicKey)
    this.contractScript = this.tokenInfo.contractScript
  }

  getTransaction = (txHash: CKBComponents.Hash) => this.rpc.getTransaction(txHash)
}

export default UDTBaseAccount
