import { hexToBytes, SHA3, jsonScriptToTypeHash } from '@ckb-sdk/utils'
import RPC from '@ckb-sdk/rpc'
import { Options } from '@ckb-sdk/utils/lib/ecpair'
import Account from './account'

class AlwaysSuccessAccount extends Account {
  public _verifyTypeHash: string | undefined

  public _rpc: RPC

  public alwaysSuccess = {
    cellHash: '',
    scriptOutPoint: {
      hash: '',
      index: 0,
    },
  }

  public genesisBlock: any

  constructor(sk: Uint8Array | string, rpc: RPC, options?: Options) {
    super(sk, rpc, options)
    this._rpc = rpc
    // load genesis block and set always_success_script_out_point, always_success_cell_hash
    this.loadGenesisBlock()
  }

  loadGenesisBlock = () => {
    this._rpc
      .getBlockHash(0)
      .then(hash => this._rpc.getBlock(hash))
      .then(block => {
        this.genesisBlock = block
        const alwaysSuccessScriptOutPoint = {
          hash: block.commitTransactions[0].hash,
          index: 0,
        }
        const s = new SHA3(256)
        s.update(
          Buffer.from(hexToBytes(block.commitTransactions[0].outputs[0].data)),
          'binary'
        )
        const alwaysSuccessCellHash = s.digest('hex')
        this.alwaysSuccess = {
          cellHash: alwaysSuccessCellHash,
          scriptOutPoint: {
            hash: alwaysSuccessScriptOutPoint.hash || '',
            index: alwaysSuccessScriptOutPoint.index,
          },
        }
        this._unlockScriptJsonObject = {
          version: 0,
          reference: `0x${this.alwaysSuccess.cellHash}`,
          args: [],
          signedArgs: [],
        }
        this.unlockTypeHash = jsonScriptToTypeHash(this._unlockScriptJsonObject)
        this.deps = [this.alwaysSuccess.scriptOutPoint]
        console.log('ready')
      })
  }

  // TODO: install
  get address() {
    return this.unlockTypeHash
  }

  public _verifyScriptJSON = {
    version: 0,
    reference: 'mruby_cell_hash',
    signedArgs: [],
  }

  verifyTypeHash = () => {
    if (!this._verifyTypeHash) {
      this._verifyTypeHash = jsonScriptToTypeHash(this._verifyScriptJSON)
    }
    return this._verifyTypeHash
  }
}

export default AlwaysSuccessAccount
