import { hexToBytes, blake2b, PERSONAL } from '@nervosnetwork/ckb-sdk-utils'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import Account from './account'

class AlwaysSuccessAccount extends Account {
  public rpc: RPC

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
    this.rpc = rpc
    // load genesis block and set always_success_script_out_point, always_success_cell_hash
    this.loadGenesisBlock()
  }

  loadGenesisBlock = () => {
    this.rpc
      .getBlockHash(0)
      .then(hash => this.rpc.getBlock(hash))
      .then(block => {
        this.genesisBlock = block
        const alwaysSuccessScriptOutPoint = {
          hash: block.commitTransactions[0].hash,
          index: 0,
        }
        const s = blake2b(32, null, null, PERSONAL)
        s.update(Buffer.from(hexToBytes(block.commitTransactions[0].outputs[0].data)))
        const alwaysSuccessCellHash = s.digest('hex')
        this.alwaysSuccess = {
          cellHash: alwaysSuccessCellHash,
          scriptOutPoint: {
            hash: alwaysSuccessScriptOutPoint.hash || '',
            index: alwaysSuccessScriptOutPoint.index,
          },
        }
        this.deps = [this.alwaysSuccess.scriptOutPoint]
        this.lockScript.binaryHash = `0x${this.alwaysSuccess.cellHash}`
        console.log('ready')
      })
  }
}

export default AlwaysSuccessAccount
