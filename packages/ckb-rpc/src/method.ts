import axios from 'axios'
import { DEBUG_LEVEL, LOG_COLOR } from './enum'

class Method {
  private _options: CkbComponents.IMethod = {
    name: '',
    method: '',
    paramsFormatters: [],
    resultFormatters: [],
  }

  static debugLevel = DEBUG_LEVEL.OFF

  private _node: CkbComponents.INode = {
    url: '',
  }

  constructor(options: CkbComponents.IMethod, node: CkbComponents.INode) {
    this._options = options
    this._node = node
  }

  public call = (...params: (string | number)[]) => {
    const data = params.map((p, i) => this._options.paramsFormatters[i](p))
    const id = Math.round(Math.random() * 10000)
    const payload = {
      id,
      method: this._options.method,
      params: data,
      jsonrpc: '2.0',
    }
    return axios({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: payload,
      url: this._node.url,
    }).then(res => {
      if (res.data.id !== id) {
        throw new Error('JSONRPC id not match')
      }
      if (Method.debugLevel === DEBUG_LEVEL.ON) {
        /* eslint-disabled */
        console.group()
        console.group()
        console.info(
          LOG_COLOR.CYAN,
          `\n----- ${this._options.name} request -----`,
          LOG_COLOR.RESET,
        )
        console.info(payload)
        console.groupEnd()
        console.group()
        console.info(
          LOG_COLOR.CYAN,
          `----- ${this._options.name} response -----`,
          LOG_COLOR.RESET,
        )
        console.info(res.data)
        console.groupEnd()
        console.groupEnd()
        /* eslint-enabled */
      }
      if (res.data.result === undefined) {
        throw new Error('No Result')
      }
      return res.data.result
    })
  }
}

export default Method
