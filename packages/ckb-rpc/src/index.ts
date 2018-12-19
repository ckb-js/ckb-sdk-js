import defaultRpc from './defaultRpc'
import { INode, IMethod } from '../typings'
import Method from './method'

class CKBRpc {
  private _node: INode

  private _methods: Method[] = []

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    defaultRpc.map(this.addMethod)
  }

  public get node() {
    return this._node
  }

  public get methods() {
    return this._methods
  }

  public addMethod = (options: IMethod) => {
    const method = new Method(options, this._node)
    this._methods.push(method)

    Object.defineProperty(this, options.name, {
      value: method.call,
      enumerable: true,
    })
  }
}

export default CKBRpc
