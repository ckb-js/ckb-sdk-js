import CKBRpc from '@ckb-sdk/rpc'

class CKBCore {
  private _rpc: CKBRpc

  private _node: CkbComponents.INode

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this._rpc = new CKBRpc(nodeUrl)
  }

  public setNode(node: string | CkbComponents.INode): CkbComponents.INode {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this._rpc.setNode(this._node)

    return this._node
  }

  public get node(): CkbComponents.INode {
    return this._node
  }

  public get rpc(): CKBRpc {
    return this._rpc
  }
}

export default CKBCore
