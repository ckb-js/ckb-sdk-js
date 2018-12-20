import axios from 'axios'
import { INode, IMethod } from '../typings'
import { DEBUG_LEVEL, LOG_COLOR } from './enum'

class Method {
  private _options: IMethod = {
    name: '',
    method: '',
    paramsFormatters: [],
    resultFormatters: [],
  }

  static debugLevel = DEBUG_LEVEL.OFF

  private _node: INode = {
    url: '',
  }

  constructor(options: IMethod, node: INode) {
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
      }
      return res.data
    })
  }
}

export default Method
