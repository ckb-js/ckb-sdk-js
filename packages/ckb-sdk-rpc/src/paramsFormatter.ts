/* eslint-disable camelcase */
declare module CKBRPC {
  export module Params {
    export interface Script {
      args: CKBComponents.Bytes[]
      code_hash: CKBComponents.Hash256
    }
    export interface OutPoint {
      tx_hash: CKBComponents.Hash256
      index: CKBComponents.Index
    }
    export interface Output {
      capacity: CKBComponents.Capacity
      data: CKBComponents.Bytes
      lock: Script
      type?: Script
    }
    export interface Input {
      previous_output: OutPoint
      since: CKBComponents.Since
      args: CKBComponents.Bytes[]
    }
    export interface Transaction {
      hash: CKBComponents.Hash256
      version: CKBComponents.Version
      deps: CKBComponents.OutPoint[]
      inputs: Input[]

      outputs: Output[]
    }
  }
}
/* eslint-enable camelcase */

const formatters = {
  toHash: (hash: any, length?: number): CKBComponents.Hash => {
    if (typeof hash !== 'string') {
      throw new Error('Hash String Required')
    }
    if (length !== undefined && hash.length !== length) {
      throw new Error('Hash of wrong length')
    }
    return hash
  },
  toOutPoint: (outPoint: any): CKBRPC.Params.OutPoint => {
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
      tx_hash: outPoint.txHash,
      index: outPoint.index,
    }
  },
  toNumber: (number: string | number): number => +number,
  toTx: ({ hash = '', version = 0, deps = [], inputs = [], outputs = [] }): CKBRPC.Params.Transaction => {
    const fmtInputs = inputs.map(({ previousOutput, args, since }: CKBComponents.CellInput) => ({
      previous_output: formatters.toOutPoint(previousOutput),
      args,
      since,
    }))
    const fmtOutputs = outputs.map(({ capacity, data, lock }: CKBComponents.CellOutput) => ({
      capacity,
      data,
      lock: {
        code_hash: lock.codeHash || '',
        args: lock.args || [],
      },
    }))
    const tx = {
      hash,
      version,
      deps,
      inputs: fmtInputs,
      outputs: fmtOutputs,
    }
    return tx
  },
}
export default formatters
