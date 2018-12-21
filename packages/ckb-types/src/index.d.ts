/* eslint-disable camelcase */
declare module CkbBasic {
  export type Hash = string
  export type BlockNumber = number
  export interface RawBlockHeader {
    cellbase_id: Hash
    difficulty: string
    number: number
    parent_hash: Hash
    timestamp: number
    txs_commit: Hash
    txs_proposal: Hash
    uncles_count: number
    uncles_hash: Hash
    version: number
  }
  export interface SealBlockHeader {
    nonce: number
    proof: Uint8Array
  }
  export interface BlockHeader {
    raw: RawBlockHeader
    seal: SealBlockHeader
  }
  export interface Input {
    previous_output: {
      hash: Hash
      index: number
    }
    unlock: {
      args: Uint8Array[]
      binary: (1 | 0)[]
      reference: Hash[]
      signed_args: Uint8Array[]
      version: number
    }
  }
  export interface Output {
    capacity: number
    contract: any
    data: Uint8Array[]
    lock: Hash
  }

  export interface Transaction {
    hash: Hash
    transaction: {
      deps: Hash[]
      inputs: Input[]
      outputs: Output[]
    }
  }

  export interface Block {
    hash: string
    header: BlockHeader
    transactions: Transaction[]
  }
  export interface Cell {
    capacity: number
    contract?: any
    data?: Uint8Array[]
    lock: Hash
    out_point?: {
      hash: Hash
      index: number
    }
  }
  export interface NewTransaction {
    version: number
    deps: Hash[]
    inputs: Input[]
    outputs: Output[]
  }
}
/* eslint-enable camelcase */
