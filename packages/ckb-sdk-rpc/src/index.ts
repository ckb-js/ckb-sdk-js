/// <reference types="../types/rpc" />

import axios from 'axios'
import Base from './Base'
import Method from './method'

import paramsFormatter from './paramsFormatter'
import resultFormatter from './resultFormatter'

class CKBRPC extends Base {
  #node: CKBComponents.Node = {
    url: '',
  }

  get node() {
    return this.#node
  }

  #paramsFormatter = paramsFormatter

  get paramsFormatter() {
    return this.#paramsFormatter
  }

  #resultFormatter = resultFormatter

  get resultFormatter() {
    return this.#resultFormatter
  }

  constructor(url: string) {
    super()
    this.setNode({ url })

    Object.defineProperties(this, {
      addMethod: { value: this.addMethod, enumerable: false, writable: false, configurable: false },
      setNode: { value: this.setNode, enumerable: false, writable: false, configurable: false },
      createBatchRequest: { value: this.createBatchRequest, enumerable: false, writable: false, configurable: false },
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

    Object.defineProperty(this, options.name, {
      value: method.call,
      enumerable: true,
    })
  }

  public createBatchRequest = <N extends keyof Base, P extends (string | number | object)[], R = any[]>(
    params: [N, P][] = [],
  ) => {
    const ctx = this
    const ERROR_LABEL = 'Batch Request'

    const proxied: [N, P][] = new Proxy([], {
      set(...p) {
        const methods = Object.keys(ctx)
        if (p[1] !== 'length') {
          const name = p?.[2]?.[0]
          if (methods.indexOf(name) === -1) {
            throw new Error(`[${ERROR_LABEL}]: Method ${name} is not found`)
          }
        }
        return Reflect.set(...p)
      },
    })

    Object.defineProperties(proxied, {
      add: {
        value(...args: any) {
          this.push(args)
          return this
        },
      },
      remove: {
        value(i: number) {
          this.splice(i, 1)
          return this
        },
      },
      exec: {
        async value() {
          const payload = proxied.map(([f, ...p], i) => {
            try {
              const method = new Method(ctx.node, { ...ctx.rpcProperties[f], name: f })
              return method.getPayload(...p)
            } catch (err) {
              throw new Error(`[${ERROR_LABEL} ${i}]: ${err.message}`)
            }
          })

          const batchRes = await axios({
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: payload,
            url: ctx.#node.url,
            httpAgent: ctx.#node.httpAgent,
            httpsAgent: ctx.#node.httpsAgent,
          })

          return batchRes.data.map((res: any, i: number) => {
            if (res.id !== payload[i].id) {
              return new Error(`[${ERROR_LABEL} ${i}]: JSONRPC id not matched`)
            }
            return ctx.rpcProperties[proxied[i][0]].resultFormatters?.(res.result) ?? res.result
          })
        },
      },
    })
    params.forEach(p => proxied.push(p))

    return proxied as typeof proxied & {
      add: (n: N, ...p: P) => typeof proxied
      remove: (index: number) => typeof proxied
      exec: () => Promise<R>
    }
  }
}

export default CKBRPC
