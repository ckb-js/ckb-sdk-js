/// <reference types="../types/rpc" />

import DefaultRPC from './defaultRPC'
import Method from './method'

import paramsFormatter from './paramsFormatter'
import resultFormatter from './resultFormatter'

class CKBRPC extends DefaultRPC {
  public node: CKBComponents.Node = {
    url: '',
  }

  public methods: Method[] = []

  public paramsFormatter = paramsFormatter

  public resultFormatter = resultFormatter

  constructor(url: string) {
    super()
    this.setNode({
      url,
    })
    this.defaultMethods.map(this.addMethod)
  }

  public setNode(node: CKBComponents.Node): CKBComponents.Node {
    Object.assign(this.node, node)
    return this.node
  }

  public addMethod = (options: CKBComponents.Method) => {
    const method = new Method(this.node, options)
    this.methods.push(method)

    Object.defineProperty(this, options.name, {
      value: method.call,
      enumerable: true,
    })
  }
}

export default CKBRPC
