import axios from 'axios'

import { INode, IMethod } from '../typings'

class Method {
  private _options: IMethod = {
    name: '',
    method: '',
    paramsFormatters: [],
    resultFormatters: [],
  }

  private _node: INode = {
    url: '',
  }

  constructor(options: IMethod, node: INode) {
    this._options = options
    this._node = node
  }

  public call(params: (string | number)[] = []) {
    const data = params.map((p, i) => this._options.paramsFormatters[i](p))
    return axios.post(this._node.url, {
      data,
    })
  }
}

export default Method
