declare module CkbRpc {
  export module Params {
    export interface ITransaction extends CkbComponents.ITransaction {
      version: number
    }
  }
}

const formatters = {
  toHash: (hash: any, length?: number): CkbComponents.Hash => {
    if (typeof hash !== 'string') {
      throw new Error('Hash String Required')
    }
    if (length !== undefined && hash.length !== length) {
      throw new Error('Hash of wrong length')
    }
    return hash
  },
  toOutPoint: (outPoint: any): CkbComponents.IOutPoint => {
    if (typeof outPoint !== 'object') {
      throw new Error('Invalid OutPoint')
    }
    if (!outPoint.hash) {
      throw new Error('Invalid Hash in OutPoint')
    }
    if (outPoint.index === undefined) {
      throw new Error('Invalid Index in OutPoint')
    }
    return {
      hash: outPoint.hash,
      index: outPoint.index,
    }
  },
  toNumber: (number: string | number): number => +number,
  toTx: ({
    hash = '',
    version = 0,
    deps = [],
    inputs = [],
    outputs = [],
  }): CkbRpc.Params.ITransaction => {
    const tx = {
      hash,
      version,
      deps,
      inputs,
      outputs,
    }
    // TODO:
    return tx
  },
}
export default formatters
