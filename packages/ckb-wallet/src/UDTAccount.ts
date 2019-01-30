import * as fs from 'fs'
import * as path from 'path'
import { Options } from '@ckb-sdk/utils/lib/ecpair'
import RPC from '@ckb-sdk/rpc'
import Account from './account'

const UDT_SCRIPTS_PATH = '../udtScripts/'
const UNLOCK_SCRIPT = fs.readFileSync(
  path.join(UDT_SCRIPTS_PATH, 'udt/unlock.rb')
)
const UNLOCK_SINGLE_CELL_SCRIPT = fs.readFileSync(
  path.join(UDT_SCRIPTS_PATH, 'udt/unlock_single_cell.rb')
)
const CONTRACT_SCRIPT = fs.readFileSync(
  path.join(UDT_SCRIPTS_PATH, 'udt/contract.rb')
)
const FIXED_AMOUNT_GENESIS_UNLOCK_SCRIPT = fs.readFileSync(
  path.join(UDT_SCRIPTS_PATH, 'fixed_amount_udt/genesis_unlock.rb')
)
const FIXED_AMOUNT_CONTRACT_SCRIPT = fs.readFileSync(
  path.join(UDT_SCRIPTS_PATH, 'fixed_amount_udt/contract.rb')
)

class UDTAccount extends Account {
  public rpc: RPC

  public mrubyCell: {
    hash: CKBComponents.Hash
    outPoint: CKBComponents.IOutPoint
  } = {
    hash: '',
    outPoint: {
      hash: '',
      index: 0,
    },
  }

  // public unlockScript = (pubkey: Uint8Array): CKBComponents.IScript => ({
  //   version: 0,
  //   reference:
  // })

  constructor(sk: string | Uint8Array, rpc: RPC, options: Options) {
    super(sk, rpc, options)
    this.rpc = rpc
  }

  get contractScript(): CKBComponents.IScript {
    return {
      version: 0,
      reference: this.mrubyCell.hash,
      signedArgs: [],
    }
  }

  get unlockScript(): CKBComponents.IScript {
    return {
      version: 0,
      reference: this.mrubyCell.hash,
      signedArgs: [],
    }
  }
}

export default UDTAccount
