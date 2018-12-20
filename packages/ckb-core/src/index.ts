import CKBRpc from '@ckb-sdk/rpc'

interface Node {
  url: string
}
class CKBCore {
  private _rpc: CKBRpc

  private _node: Node

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this._rpc = new CKBRpc(nodeUrl)
  }

  public get node(): Node {
    return this._node
  }
}

export default CKBCore
