import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Address from '@nervosnetwork/ckb-sdk-address'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

interface DepCellInfo {
  hashType: CKBComponents.ScriptHashType
  codeHash: CKBComponents.Hash256
  outPoint: CKBComponents.OutPoint
}
class Core {
  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

  public config: {
    secp256k1Dep?: DepCellInfo
  } = {}

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this.rpc = new RPC(nodeUrl)

    const computeTransactionHashMethod = {
      name: 'computeTransactionHash',
      method: '_compute_transaction_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toRawTransaction],
    }

    /**
     * @method computeTransactionHash
     * @description this RPC is used to calculate the hash of a raw transaction
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeTransactionHashMethod)

    const computeScriptHashMethod = {
      name: 'computeScriptHash',
      method: '_compute_script_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toScript],
    }

    /**
     * @method computeScriptHash
     * @description this RPC is used to calculate the hash of lock/type script
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeScriptHashMethod)
  }

  public setNode(node: string | CKBComponents.Node): CKBComponents.Node {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this.rpc.setNode(this._node)

    return this._node
  }

  public get node(): CKBComponents.Node {
    return this._node
  }

  public generateAddress = (
    privateKey: string,
    { prefix = utils.AddressPrefix.Testnet, type = utils.AddressType.HashIdx, codeHashIndex = '0x00' } = {
      prefix: utils.AddressPrefix.Testnet,
      type: utils.AddressType.HashIdx,
      codeHashIndex: '0x00',
    }
  ) =>
    new Address(
      privateKey,
      {
        prefix,
        type,
        codeHashIndex,
      },
      this.rpc
    )

  public loadSecp256k1Dep = async () => {
    /**
     * cell list
     * @link https://github.com/nervosnetwork/ckb/blob/dbadf484cea6bdba0329d58102726068be997a50/docs/hashes.toml
     */
    const block = await this.rpc.getBlockByNumber('0x0')
    if (!block) throw new Error('Cannot load the genesis block')
    const secp256k1CodeTx = block.transactions[0]
    if (!secp256k1CodeTx) throw new Error('Cannot load the transaction which has the secp256k1 code cell')
    if (!secp256k1CodeTx.outputs[1]) {
      throw new Error('Cannot load the secp256k1 cell because the specific output is not found')
    }
    if (!secp256k1CodeTx.outputs[1].type) {
      throw new Error('Secp256k1 type script not found in the cell')
    }

    const secp256k1TypeHash = this.utils.scriptToHash(secp256k1CodeTx.outputs[1].type)

    const secp256k1DepTx = block.transactions[1]
    if (!secp256k1DepTx) throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
    if (!secp256k1DepTx.outputs[0]) {
      throw new Error('Cannot load the secp256k1 dep because the specific output is not found')
    }

    this.config.secp256k1Dep = {
      hashType: 'type',
      codeHash: secp256k1TypeHash,
      outPoint: {
        txHash: secp256k1DepTx.hash,
        index: '0x0',
      },
    }
    return this.config.secp256k1Dep
  }
}

export default Core
