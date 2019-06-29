/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs
 */

/* eslint-disable camelcase */
declare module CKB_RPC {
  export type ProposalShortId = CKBComponents.ProposalShortId
  export type UInt32 = CKBComponents.UInt32
  export type Count = CKBComponents.Count
  export type Hash256 = CKBComponents.Hash256
  export type Version = CKBComponents.Version
  export type Capacity = CKBComponents.Capacity
  export type Witness = CKBComponents.Witness
  export type Bytes = CKBComponents.Bytes
  export type Index = CKBComponents.Index
  export type Since = CKBComponents.Since
  export type Timestamp = CKBComponents.Timestamp
  export type BlockNumber = CKBComponents.BlockNumber
  export type EpochInHeader = string
  export type Difficulty = CKBComponents.Difficulty
  export type Cycles = CKBComponents.Cycles
  export type Size = CKBComponents.Size

  export enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
  }

  export interface Script {
    args: Bytes[]
    code_hash: Hash256
  }

  export interface CellOutPoint {
    tx_hash: Hash256
    index: Index
  }

  export interface OutPoint {
    cell?: CellOutPoint | null
    block_hash?: Hash256 | null
  }

  export interface CellInput {
    previous_output: OutPoint
    since: Since
  }

  export interface CellOutput {
    capacity: Capacity
    data: Bytes
    lock: Script
    type?: Script | null
  }

  export type Cell = CellOutput

  export interface CellIncludingOutPoint {
    capacity: Capacity
    lock: Script
    out_point: OutPoint
  }

  export interface RawTransaction {
    version: Version
    deps: OutPoint[]
    inputs: CellInput[]
    outputs: CellOutput[]
    witnesses: Witness[]
  }

  export interface Transaction extends RawTransaction {
    hash: Hash256
  }

  export interface TransactionWithStatus {
    transaction: Transaction
    tx_status: {
      block_hash: Hash256 | null
      status: TransactionStatus
    }
  }

  export interface TransactionPoint {
    block_number: BlockNumber
    index: Index
    tx_hash: Hash256
  }

  export interface TransactionByLockHash {
    consumed_by: null | TransactionPoint
    created_by: TransactionPoint
  }
  export type TransactionsByLockHash = TransactionByLockHash[]

  export interface LiveCellByLockHash {
    cell_output: CellOutput
    created_by: TransactionPoint
  }
  export type LiveCellsByLockHash = LiveCellByLockHash[]

  export type Seal = CKBComponents.Seal

  export interface Header {
    version: Version
    parent_hash: Hash256
    timestamp: Timestamp
    number: BlockNumber
    epoch: EpochInHeader
    transactions_root: Hash256
    proposals_hash: Hash256
    witnesses_root: Hash256
    difficulty: Difficulty
    uncles_hash: Hash256
    uncles_count: Count
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

  export interface AlertMessage {
    id: string
    priority: string
    notice_until: Timestamp
    message: string
  }

  export interface BlockchainInfo {
    is_initial_block_download: boolean
    epoch: string
    difficulty: string
    median_time: string
    chain: string
    alerts: AlertMessage[]
  }

  export interface NodeInfo {
    addresses: { address: string; score: string }[]
    node_id: string
    is_outbound: boolean | null
    version: string
  }

  export interface PeersState {
    last_updated: string
    blocks_in_flight: string
    peer: string
  }

  export interface TxPoolInfo {
    orphan: Count
    pending: Count
    proposed: Count
    last_txs_updated_at: Timestamp
    total_tx_cycles: Cycles
    total_tx_size: Size
  }

  export interface Epoch {
    epoch_reward: string
    difficulty: string
    length: string
    number: string
    start_number: string
  }

  export interface LockHashIndexState {
    block_hash: Hash256
    block_number: BlockNumber
    lock_hash: Hash256
  }

  export type LockHashIndexStates = LockHashIndexState[]
}
/* eslint-enable camelcase */
