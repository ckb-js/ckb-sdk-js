import Rpc from '@ckb-sdk/rpc'
import Wallet from '@ckb-sdk/wallet'

class Core {
  private _rpc: Rpc

  private _node: CkbComponents.INode

  private _wallet: Wallet

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this._rpc = new Rpc(nodeUrl)
    this._wallet = new Wallet(this._rpc)
  }

  public setNode(node: string | CkbComponents.INode): CkbComponents.INode {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this._rpc.setNode(this._node)
    this._wallet.setRpc(this._rpc)

    return this._node
  }

  public get node(): CkbComponents.INode {
    return this._node
  }

  public get rpc(): Rpc {
    return this._rpc
  }
}

export default Core
