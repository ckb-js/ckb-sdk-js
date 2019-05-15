import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Address from '@nervosnetwork/ckb-sdk-address'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

class Core {
  public rpc: RPC

  private _node: CKBComponents.Node

  public _utils = utils

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this.rpc = new RPC(nodeUrl)
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

  public get utils() {
    return this._utils
  }

  public generateAddress = (privateKey: string) =>
    new Address(privateKey, {
      prefix: utils.AddressPrefix.Mainnet,
      type: utils.AddressType.BinIdx,
      binIdx: utils.AddressBinIdx.P2PH,
    })
}

export default Core
