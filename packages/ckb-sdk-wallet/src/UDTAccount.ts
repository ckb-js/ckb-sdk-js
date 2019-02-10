import * as fs from 'fs'
import * as path from 'path'
import { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Account from './account'

const UDT_SCRIPTS_PATH = path.join(__dirname, '../udtScripts/')
const UNLOCK_SCRIPT = fs.readFileSync(path.join(UDT_SCRIPTS_PATH, 'udt/unlock.rb'))
const UNLOCK_SINGLE_CELL_SCRIPT = fs.readFileSync(path.join(UDT_SCRIPTS_PATH, 'udt/unlock_single_cell.rb'))
const CONTRACT_SCRIPT = fs.readFileSync(path.join(UDT_SCRIPTS_PATH, 'udt/contract.rb'))
// const FIXED_AMOUNT_GENESIS_UNLOCK_SCRIPT = fs.readFileSync(
//   path.join(UDT_SCRIPTS_PATH, 'fixed_amount_udt/genesis_unlock.rb'),
// )
// const FIXED_AMOUNT_CONTRACT_SCRIPT = fs.readFileSync(
//   path.join(UDT_SCRIPTS_PATH, 'fixed_amount_udt/contract.rb'),
// )

export class TokenInfo {
  public rpc: RPC

  public name: string

  public publicKey: Uint8Array

  public accountWallet: boolean

  public mrubyCell: {
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
    reference: this.mrubyCell.hash,
    signedArgs: [
      this.accountWallet ? UNLOCK_SINGLE_CELL_SCRIPT : UNLOCK_SCRIPT,
      Buffer.from(this.name, 'utf8'),
      publicKey,
    ],
    args: [],
  })

  get contractScript(): CKBComponents.Script {
    return {
      version: 0,
      reference: this.mrubyCell.hash,
      signedArgs: [CONTRACT_SCRIPT, Buffer.from(this.name, 'utf8'), this.publicKey],
      args: [],
    }
  }
}

class UDTBaseAccount extends Account {
  public rpc: RPC

  public tokenInfo: TokenInfo

  public mrubyCell: {
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
