/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/protocol/src/protocol.fbs for more infGomation
 */

declare namespace CKBComponents {
  export type Hash = string
  export type Hash256 = string
  export type UInt32 = number
  export type Index = string
  export type Version = string
  export type Count = string
  export type Difficulty = string
  export type BlockNumber = string
  export type EpochInHeader = string
  export type Capacity = string
  export type ProposalShortId = string
  export type Timestamp = string
  export type Nonce = string
  export type Cycles = string
  export type Size = string
  export enum TransactionStatus {
    Pending = 'pending',
    Proposed = 'proposed',
    Committed = 'committed',
  }

  export enum ScriptHashType {
    Data = 'Data',
    Type = 'Type',
  }

  /**
   * @typedef Bytes, keep consistent with CKB
   * @description Bytes will be serialized to string
   * @see https://github.com/nervosnetwork/ckb/blob/develop/util/jsonrpc-types/src/blockchain.rs#L19
   */
  export type Bytes = string
  export type Since = string
  export interface Node {
    url: string
  }
  export interface Method {
    name: string
    method: string
    paramsFormatters: Function[]
    resultFormatters?: Function
  }
  /**
   * RPC Units
   */

  /* eslint-disable max-len */
  /**
   * @typedef Script, lock or type script
   * @description Script, the script model in CKB. CKB scripts use UNIX standard execution environment. Each script binary should contain a main function with the following signature `int main(int argc, char* argv[]);`. CKB will concat `signed_args` and `args`, then use the concatenated array to fill `argc/argv` part, then start the script execution. Upon termination, the executed `main` function here will provide a return code, `0` means the script execution succeeds, other values mean the execution fails.
   * @property args, arguments.
   * @property codeHash, point to its dependency, if the referred dependency is listed in the deps field in a transaction, the codeHash means the hash of the referred cell's data.
   * @see https://github.com/nervosnetwork/ckb/blob/develop/core/src/script.rs#L16
   * @tutorial Each script has a `lock_hash` which uniquely identifies the script, for example, the `lock_hash` of lock script, is exactly the corresponding `lock` script field value in the referenced cell, when calculating hash for a script, `bianryHash`, and `args` will all be used.
   */
  /* eslint-enable max-len */
  export interface Script {
    args: Bytes[]
    codeHash: Hash256
    hashType: ScriptHashType
  }

  /**
   * @typedef CellInput, cell input in a transaction
   * @property previousOutput, point to its P1 cell
   * @property since, a parameter to prevent a cell to be spent before a centain block timestamp or a block number,
   *           [RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0017-tx-valid-since/0017-tx-valid-since.md)
   */
  export interface CellInput {
    previousOutput: OutPoint
    since: Since
  }

  /**
   * @typedef CellOutput, cell output in a transaction
   * @property capacity, the capacity of the genereated P1 cell
   * @property data, cell data
   * @property lock, lock script
   * @property type, type script
   */
  export interface CellOutput {
    capacity: Capacity
    data: Bytes
    lock: Script
    type?: Script | null
  }

  /**
   * @typedef CellOutPoint, used to refer a generated cell by transaction hash and output index
   * @property hash, transaction hash
   * @property index, index of cell output
   */
  export interface CellOutPoint {
    txHash: Hash256
    index: Index
    hashType: ScriptHashType
  }

  export interface OutPoint {
    cell?: CellOutPoint | null
    blockHash?: Hash256 | null
  }

  export interface Witness {
    data: Hash[]
  }

  /**
   * @typedef RawTransaction, raw transaction object
   * @property version, transaction version
   * @property deps, transaction deps
   * @property inputs, cell inputs in the transaction
   * @property outputs, cell outputs in the transaction
   * @property witnesses, segrated witnesses
   */
  export interface RawTransaction {
    version: Version
    deps: OutPoint[]
    inputs: CellInput[]
    outputs: CellOutput[]
    witnesses: Witness[]
  }

  /**
   * @typedef Transaction, transaction object
   * @extends RawTransaction
   * @property hash, transaction hash
   */
  export interface Transaction extends RawTransaction {
    hash: Hash256
  }

  export interface TransactionWithStatus {
    transaction: Transaction
    txStatus: {
      blockHash: Hash256 | null
      status: TransactionStatus
    }
  }

  /**
   * @typeof TransactionPoint
   * @property blockNumber
   * @property index
   * @property txHash
   */
  export interface TransactionPoint {
    blockNumber: BlockNumber
    index: Index
    txHash: Hash256
  }

  /**
   * @TransactionByLockHash
   * @property consumedBy
   * @property createdBy
   */
  export interface TransactionByLockHash {
    consumedBy: null | TransactionPoint
    createdBy: TransactionPoint
  }

  export type TransactionsByLockHash = TransactionByLockHash[]

  /**
   * @typedef @Seal
   * @property nonce
   * @property proof
   */
  export interface Seal {
    nonce: Nonce
    proof: Uint8Array
  }

  /**
   * @typedef BlockHeader, header of a block
   * @property version
   * @property parentHash
   * @property timestamp
   * @property number
   * @property epoch
   * @property transactionsRoot
   * @property proposalsHash
   * @property difficulty
   * @property unclesHash
   * @property unclesCount
   * @property seal
   * @property hash
   */
  export interface BlockHeader {
    version: Version
    parentHash: Hash256
    timestamp: Timestamp
    number: BlockNumber
    epoch: EpochInHeader
    transactionsRoot: Hash256
    proposalsHash: Hash256
    witnessesRoot: Hash256
    difficulty: Difficulty
    unclesHash: Hash256
    unclesCount: Count
    seal: Seal
    hash: Hash256
  }

  /**
   * @typedef UncleBlock, uncle block object
   * @property header, block header
   * @property proposals
   */

  interface UncleBlock {
    header: BlockHeader
    proposals: ProposalShortId[]
  }

  /**
   * @typedef Block, block object
   * @property header, block header
   * @property uncles, uncle blocks
   * @property transactions
   * @property proposals
   */
  export interface Block {
    header: BlockHeader
    uncles: UncleBlock[]
    transactions: Transaction[]
    proposals: ProposalShortId[]
  }

  /**
   * @typedef Cell, cell object
   * @property capacty, cell capacity
   * @property lock, lock hash
   */
  export interface Cell extends CellOutput {}

  /**
   * @typedef Cell, cell object
   * @property capacty, cell capacity
   * @property lock, lock hash
   * @property outPoint
   */

  export interface CellIncludingOutPoint {
    capacity: Capacity
    lock: Script
    outPoint: OutPoint
  }

  export type TransactionTrace = { action: string; info: string; time: Timestamp }[]

  export enum CellStatus {
    Live = 'live',
    Unknown = 'unknown',
  }

  export interface LiveCellByLockHash {
    cellOutput: CellOutput
    createdBy: TransactionPoint
  }

  export type LiveCellsByLockHash = LiveCellByLockHash[]

  export interface AlertMessage {
    id: string
    priority: string
    noticeUntil: Timestamp
    message: string
  }

  export interface BlockchainInfo {
    isInitialBlockDownload: boolean
    epoch: string
    difficulty: string
    medianTime: string
    chain: string
    alerts: AlertMessage[]
  }

  export interface NodeInfo {
    version: string
    nodeId: string
    addresses: { address: string; score: string }[]
    isOutbound: boolean | null
  }

  export interface PeersState {
    lastUpdated: string
    blocksInFlight: string
    peer: string
  }

  export interface TxPoolInfo {
    orphan: Count
    pending: Count
    proposed: Count
    lastTxsUpdatedAt: Timestamp
    totalTxCycles: Cycles
    totalTxSize: Size
  }

  export enum CapacityUnit {
    Shannon = 1,
    Byte = 100000000,
  }

  export interface Epoch {
    epochReward: String
    difficulty: String
    length: String
    number: String
    startNumber: String
  }

  export interface RunDryResult {
    cycles: Cycles
  }

  export interface LockHashIndexState {
    blockHash: Hash256
    blockNumber: BlockNumber
    lockHash: Hash256
  }

  export type LockHashIndexStates = LockHashIndexState[]
}
