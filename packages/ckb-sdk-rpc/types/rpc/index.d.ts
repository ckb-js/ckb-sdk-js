/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs
 */

/* eslint-disable camelcase */
declare module RPC {
  export type ProposalShortId = CKBComponents.ProposalShortId
  export type Number = CKBComponents.Number
  export type UInt32 = CKBComponents.UInt32
  export type Count = CKBComponents.Count
  export type DAO = CKBComponents.DAO
  export type Hash = CKBComponents.Hash
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

  enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
  }

  export type ScriptHashType = 'data' | 'type'

  export type DepType = 'code' | 'dep_group'

  export interface Script {
    args: Bytes
    code_hash: Hash256
    hash_type: ScriptHashType
  }

  export interface OutPoint {
    tx_hash: Hash256
    index: Index
  }

  export interface CellInput {
    previous_output: OutPoint | null
    since: Since
  }

  export interface CellOutput {
    capacity: Capacity
    lock: Script
    type?: Script | null
  }

  export type Cell = CellOutput

  export interface LiveCell {
    data?: {
      content: Hash
      hash: Hash256
    }
    output: CellOutput
  }

  export interface CellDep {
    out_point: OutPoint | null
    dep_type: DepType
  }

  export interface CellIncludingOutPoint {
    block_hash: Hash256
    capacity: Capacity
    lock: Script
    out_point: OutPoint | null
    cellbase: boolean
    output_data_len: string
  }

  export interface RawTransaction {
    version: Version
    cell_deps: CellDep[]
    header_deps: Hash256[]
    inputs: CellInput[]
    outputs: CellOutput[]
    witnesses: Witness[]
    outputs_data: Bytes[]
  }

  export interface Transaction extends RawTransaction {
    hash: Hash256
  }

  export interface TransactionWithStatus {
    transaction: Transaction
    tx_status:
      | {
          block_hash: Hash256
          status: TransactionStatus.Committed
        }
      | {
          block_hash: null
          status: TransactionStatus.Pending | TransactionStatus.Proposed
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
    cellbase: boolean
    output_data_len: string
  }
  export type LiveCellsByLockHash = LiveCellByLockHash[]

  export interface Header {
    compact_target: Hash
    dao: DAO
    epoch: EpochInHeader
    hash: Hash256
    number: BlockNumber
    parent_hash: Hash256
    proposals_hash: Hash256
    nonce: CKBComponents.Nonce
    timestamp: Timestamp
    transactions_root: Hash256
    uncles_hash: Hash256
    version: Version
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

  export interface LocalNodeInfo {
    active: boolean
    addresses: Record<'address' | 'score', string>[]
    connections: string
    node_id: string
    protocols: { id: string; name: string; support_versions: string[] }[]
    version: string
  }

  export interface RemoteNodeInfo {
    addresses: Record<'address' | 'score', string>[]
    connected_duration: string
    is_outbound: boolean
    last_ping_duration: string
    node_id: string
    protocols: Record<'id' | 'version', string>[]
    sync_state: Record<
      | 'best_known_header_hash'
      | 'best_known_header_number'
      | 'can_fetch_count'
      | 'inflight_count'
      | 'last_common_header_hash'
      | 'last_common_header_number'
      | 'unknown_header_list_size',
      string | null
    >
    version: string
  }

  export interface PeersState {
    last_updated: string
    blocks_in_flight: string
    peer: string
  }

  export interface TxPoolInfo {
    last_txs_updated_at: Timestamp
    min_fee_rate: string
    orphan: Count
    pending: Count
    proposed: Count
    tip_hash: Hash256
    tip_number: BlockNumber
    total_tx_cycles: Cycles
    total_tx_size: Size
  }

  export interface Epoch {
    compact_target: Hash
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

  export interface BannedAddress {
    address: string
    ban_reason: string
    ban_until: Timestamp
    created_at: Timestamp
  }
  export type BannedAddresses = BannedAddress[]

  export interface CellbaseOutputCapacityDetails {
    primary: string
    proposal_reward: string
    secondary: string
    total: string
    tx_fee: string
  }

  export interface FeeRate {
    fee_rate: string
  }

  export interface CapacityByLockHash {
    block_number: BlockNumber
    capacity: Capacity
    cells_count: string
  }

  export interface BlockEconomicState {
    finalized_at: string
    issuance: {
      primary: string
      secondary: string
    }
    miner_reward: {
      committed: string
      primary: string
      proposal: string
      secondary: string
    }
    txs_fee: string
  }

  export interface SyncState {
    best_known_block_number: string
    best_known_block_timestamp: string
    fast_time: string
    ibd: boolean
    inflight_blocks_count: string
    low_time: string
    normal_time: string
    orphan_blocks_count: string
  }
}
/* eslint-enable camelcase */
