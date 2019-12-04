import axios from 'axios'

class Method {
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
      httpAgent: this.node.httpAgent,
      httpsAgent: this.node.httpsAgent,
    }).then(res => {
      if (res.data.id !== id) {
        throw new Error('JSONRPC id not match')
      }
      if (res.data.error) {
        throw new Error(JSON.stringify(res.data.error))
      }
      return this.options.resultFormatters ? this.options.resultFormatters(res.data.result) : res.data.result
    })
  }
}

export default Method
