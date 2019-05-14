/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs
 */

/* eslint-disable camelcase */
declare module CKB_RPC {
  export type ProposalShortId = CKBComponents.ProposalShortId
  export type UInt32 = CKBComponents.UInt32
  export type Hash256 = CKBComponents.Hash256
  export type Version = CKBComponents.Version
  export type Capacity = CKBComponents.Capacity
  export type Witness = CKBComponents.Witness
  export type Bytes = CKBComponents.Bytes
  export type Index = CKBComponents.Index
  export type Since = CKBComponents.Since
  export type Timestamp = CKBComponents.Timestamp
  export type BlockNumber = CKBComponents.BlockNumber
  export type Difficulty = CKBComponents.Difficulty

  export enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
  }

  export interface Script {
    args: Bytes[]
    code_hash: Hash256
  }

  export interface OutPoint {
    tx_hash: Hash256
    index: Index
  }

  export interface CellInput {
    previous_output: OutPoint
    since: Since
    args: Bytes[]
  }

  export interface CellOutput {
    capacity: Capacity
    data: Bytes
    lock: Script
    type?: Script | null
  }

  export type Cell = CellOutput

  export interface RawTransaction {
    version: Version
    deps: OutPoint[]
    inputs: CellInput[]
    outputs: CellOutput[]
  }

  export interface Transaction extends RawTransaction {
    witnesses: Witness[]
    hash: Hash256
  }

  export interface TransactionWithStatus {
    transaction: Transaction
    tx_status: {
      block_hash: Hash256 | null
      status: TransactionStatus
    }
  }

  export type Seal = CKBComponents.Seal

  export interface Header {
    version: Version
    parent_hash: Hash256
    timestamp: Timestamp
    number: BlockNumber
    transactions_root: Hash256
    proposals_root: Hash256
    witnesses_root: Hash256
    difficulty: Difficulty
    uncles_hash: Hash256
    uncles_count: UInt32
    seal: Seal
    hash: Hash256
  }

  export interface UncleBlock {
    header: Header
    proposals: ProposalShortId[]
  }

  export interface Block {
    header: Header
    uncles: UncleBlock[]
    transactions: Transaction[]
    proposals: ProposalShortId[]
  }

  export interface NodeInfo {
    addresses: { address: string; score: number }[]
    node_id: string
    version: string
  }
}
/* eslint-enable camelcase */
