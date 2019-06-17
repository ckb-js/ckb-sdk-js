import axios from 'axios'
import { DebugLevel, LogColor } from './enum'

class Method {
  static debugLevel = DebugLevel.Off

  private options: CKBComponents.Method = {
    name: '',
    method: '',
    paramsFormatters: [],
    resultFormatters: undefined,
  }

  private node: CKBComponents.Node

  constructor(node: CKBComponents.Node, options: CKBComponents.Method) {
    this.node = node
    this.options = options
  }

  public call = (...params: (string | number)[]) => {
    const data = params.map((p, i) => (this.options.paramsFormatters[i] && this.options.paramsFormatters[i](p)) || p)
    const id = Math.round(Math.random() * 10000)
    const payload = {
      id,
      method: this.options.method,
      params: data,
      jsonrpc: '2.0',
    }
    return axios({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: payload,
      url: this.node.url,
    }).then(res => {
      if (res.data.id !== id) {
        throw new Error('JSONRPC id not match')
      }
      if (Method.debugLevel === DebugLevel.On) {
        /* eslint-disabled */
        console.group()
        console.group()
        console.info(LogColor.Cyan, `\n----- ${this.options.name} request -----`, LogColor.Reset)
        console.info(JSON.stringify(payload, null, 2))
        console.groupEnd()
        console.group()
        console.info(LogColor.Cyan, `----- ${this.options.name} response -----`, LogColor.Reset)
        console.info(JSON.stringify(res.data, null, 2))
        console.groupEnd()
        console.groupEnd()
        /* eslint-enabled */
      }
      if (res.data.error) {
        throw new Error(JSON.stringify(res.data.error))
      }
      return this.options.resultFormatters ? this.options.resultFormatters(res.data.result) : res.data.result
    })
  }
}

export default Method
