import RPC from '@ckb-sdk/rpc'
import Wallet from '@ckb-sdk/wallet'
import * as utils from '@ckb-sdk/utils'

class Core {
  public rpc: RPC

  private _node: CKBComponents.Node

  private _wallet: Wallet

  public _utils = utils

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this.rpc = new RPC(nodeUrl)
    this._wallet = new Wallet(this.rpc)
  }

  public setNode(node: string | CKBComponents.Node): CKBComponents.Node {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this.rpc.setNode(this._node)
    this._wallet.rpc = this.rpc

    return this._node
  }

  public get node(): CKBComponents.Node {
    return this._node
  }

  public get utils() {
    return this._utils
  }

  public get wallet() {
    return this._wallet
  }
}

export default Core
