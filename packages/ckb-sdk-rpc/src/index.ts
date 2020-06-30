/// <reference types="../types/rpc" />

import Base from './Base'
import Method from './method'

import paramsFormatter from './paramsFormatter'
import resultFormatter from './resultFormatter'

class CKBRPC extends Base {
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
    Object.keys(this.rpcProperties).forEach(name => {
      this.addMethod({ name, ...this.rpcProperties[name] })
    })
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
