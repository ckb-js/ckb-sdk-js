/* eslint-disable camelcase */
declare namespace CkbComponents {
  export type Hash = string
  export type BlockNumber = number
  export interface INode {
    url: string
  }
  export interface IMethod {
    name: string
    method: string
    paramsFormatters: Function[]
    resultFormatters: Function[]
  }

  export interface IBlock {}

  export interface IBlockWithHash extends IBlock {}
  export interface IInput {
    previous_output: {
      hash: Hash
      index: number
    }
    unlock: {
      args: any[]
      binary: Uint8Array[]
      reference: any
      signed_args: Uint8Array[]
      version: number
    }
  }
  export interface IOutput {
    capacity: number
    contract: any
    data: Uint8Array[]
    lock: Hash
  }
  export interface ITransaction {
    deps: any[]
    inputs: IInput[]
    outputs: IOutput[]
    version: number
  }
  export interface ITransactionWithHash {
    hash: Hash
    transaction: ITransaction
  }

  export interface IOutPoint {
    hash: Hash
    index: number
  }
  export interface IRawHeader {
    cellbase_id: Hash
    difficulty: Hash
    number: number
    parent_hash: Hash
    timestamp: number
    txs_commit: Hash
    txs_proposal: Hash
    uncles_count: number
    uncles_hash: Hash
    version: number
  }
  export interface ISealHeader {
    nonce: number
    proof: Uint8Array[]
  }
  export interface IHeader {
    raw: IRawHeader
    seal: ISealHeader
  }
  export interface ICell {
    capacity: number
    contract?: any
    data?: Uint8Array[]
    lock: Hash
    out_point?: {
      hash: Hash
      index: number
    }
  }
}

/* eslint-enable camelcase */
