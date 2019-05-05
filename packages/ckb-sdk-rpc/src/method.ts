import axios from 'axios'
import { DebugLevel, LogColor } from './enum'

class Method {
  private _options: CKBComponents.Method = {
    name: '',
    method: '',
    paramsFormatters: [],
    resultFormatters: undefined,
  }

  static debugLevel = DebugLevel.Off

  private _node: CKBComponents.Node = {
    url: '',
  }

  constructor(options: CKBComponents.Method, node: CKBComponents.Node) {
    this._options = options
    this._node = node
  }

  public call = (...params: (string | number)[]) => {
    const data = params.map((p, i) => (this._options.paramsFormatters[i] && this._options.paramsFormatters[i](p)) || p)
    const id = Math.round(Math.random() * 10000)
    const payload = {
      id,
      method: this._options.method,
      params: data,
      jsonrpc: '2.0',
    }
    return axios({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      data: payload,
      url: this._node.url,
    }).then(res => {
      if (res.data.id !== id) {
        throw new Error('JSONRPC id not match')
      }
      if (Method.debugLevel === DebugLevel.On) {
        /* eslint-disabled */
        console.group()
        console.group()
        console.info(LogColor.Cyan, `\n----- ${this._options.name} request -----`, LogColor.Reset)
        console.info(JSON.stringify(payload, null, 2))
        console.groupEnd()
        console.group()
        console.info(LogColor.Cyan, `----- ${this._options.name} response -----`, LogColor.Reset)
        console.info(JSON.stringify(res.data, null, 2))
        console.groupEnd()
        console.groupEnd()
        /* eslint-enabled */
      }
      if (res.data.error) {
        throw new Error(JSON.stringify(res.data.error))
      }
      if (res.data.result === undefined) {
        throw new Error('No Result')
      }
      return this._options.resultFormatters ? this._options.resultFormatters(res.data.result) : res.data.result
    })
  }
}

export default Method
