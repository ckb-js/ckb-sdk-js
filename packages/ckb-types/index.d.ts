/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/protocol/src/protocol.fbs for more infGomation
 */

declare namespace CKBComponents {
  export type Hash = string
  export type Hash256 = string
  export type UInt32 = number
  export type Index = number
  export type Version = UInt32
  export type Difficulty = bigint
  export type BlockNumber = string
  export type Capacity = string
  export type ProposalShortId = string
  export type Timestamp = string
  export type Nonce = string
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
   * @typedef Script, lock or unlock script
   * @description Script, the script model in CKB. CKB scripts use UNIX standard execution environment. Each script binary should contain a main function with the following signature `int main(int argc, char* argv[]);`. CKB will concat `signed_args` and `args`, then use the concatenated array to fill `argc/argv` part, then start the script execution. Upon termination, the executed `main` function here will provide a return code, `0` means the script execution succeeds, other values mean the execution fails.
   * @property args, arguments.
   * @property binaryHash, point to its dependency, if your script already exists on CKB, you can use this field to reference the script instead of including it again. You can just put the script hash in this binaryHash field, then list the cell containing the script as an outpoint in deps field in the current transaction. CKB will automatically locate cell and load the binary from there and use it as script `binary` part. Notice this only works when you don't provide a `binary` field value, otherwise the value in the `binary` field always take precedence.
   * @tutorial Each script has a `lock_hash` which uniquely identifies the script, for example, the `lock_hash` of lock script, is exactly the corresponding `lock` script field value in the referenced cell, when calculating hash for a script, `bianryHash`, and `args` will all be used.
   */
  /* eslint-enable max-len */
  export interface Script {
    args: Uint8Array[]
    binaryHash?: Hash
  }

  /**
   * @typedef CellInput, cell input in a transaction
   * @property previousOutput, point to its P1 cell
   * @property unlock, unlock script
   */
  export interface CellInput {
    prevOutput: OutPoint
    args: Uint8Array[]
  }

  /**
   * @typedef CellOutput, cell output in a transaction
   * @property capacity, the capacity of the genereated P1 cell
   * @property data, cell data
   * @property lock, lock hash
   * @property contract, lock script
   */
  export interface CellOutput {
    capacity: Capacity
    data: Uint8Array
    lock: Script
    type?: Script
  }

  /**
   * @typedef OutPoint, used to refer a generated cell by transaction hash and output index
   * @property hash, transaction hash
   * @property index, index of cell output
   */
  export interface OutPoint {
    hash: Hash256
    index: Index
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
   */
  export interface RawTransaction {
    version: Version
    deps: OutPoint[]
    inputs: CellInput[]
    outputs: CellOutput[]
  }

  /**
   * @typedef Transaction, transaction object
   * @extends RawTransaction
   * @property witnesses, segrated witnesses
   * @property hash, transaction hash
   */
  export interface Transaction extends RawTransaction {
    witnesses: Witness[]
    hash: Hash256
  }

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
   * @property txsCommit
   * @property txsProposal
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
    txsCommit: Hash256
    txsProposal: Hash256
    witnessesRoot: Hash256
    difficulty: Difficulty
    unclesHash: Hash256
    unclesCount: UInt32
    seal: Seal
    hash: Hash256
  }

  /**
   * @typedef UncleBlock, uncle block object
   * @property header, block header
   * @property proposalTransactions
   */

  interface UncleBlock {
    header: BlockHeader
    proposalTransactions: ProposalShortId[]
  }

  /**
   * @typedef Block, block object
   * @property header, block header
   * @property uncles, uncle blocks
   * @property commitTransactions
   * @property proposalTransactions
   */
  export interface Block {
    header: BlockHeader
    uncles: UncleBlock[]
    commitTransactions: Transaction[]
    proposalTransactions: ProposalShortId[]
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

  export interface CellWithOutPoint extends Cell {
    outPoint: OutPoint
  }

  export interface CellByLockHash {
    capacity: Capacity
    lock: Hash256
    outPoint: OutPoint
  }

  export type TransactionTrace = { action: string; info: string; time: Timestamp }[]

  export enum CellStatus {
    LIVE = 'live',
  }
  export interface NodeInfo {
    version: string
    nodeId: string
    addresses: { address: string; score: number }[]
  }
}
