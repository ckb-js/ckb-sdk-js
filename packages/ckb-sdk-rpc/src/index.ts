import DefaultRPC from './defaultRPC'
import { DebugLevel } from './enum'
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

  public setDebugLevel = (level: DebugLevel) => {
    Method.debugLevel = level
  }

  constructor(url: string) {
    super()
    this.setNode({
      url,
    })
    this.defaultMethods.map(this.addMethod)
  }

  public setNode(node: CKBComponents.Node): CKBComponents.Node {
    this.node = {
      ...this.node,
      ...node,
    }
    Method.setNode(this.node)
    return this.node
  }

  public addMethod = (options: CKBComponents.Method) => {
    const method = new Method(options)
    this.methods.push(method)

    Object.defineProperty(this, options.name, {
      value: method.call,
      enumerable: true,
    })
  }
}

export default CKBRPC
