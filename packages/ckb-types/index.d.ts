/**
 * @see https://github.com/nervosnetwork/ckb/blob/develop/protocol/src/protocol.fbs for more infGomation
 */

declare namespace CKBComponents {
  export type Version = number
  export type LocalNodeInfo = {
    addresses: { address: string; score: number }[]
    nodeId: string
    version: string
  }
  export type Hash = string
  export type BlockNumber = number
  export type Capacity = number
  export type ProposalShortId = string
  export type TimeStamp = number
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
   * @property version, script version, used to resolve incompatible upgrade.
   * @property args, arguments.
   * @property binaryHash, point to its dependency, if your script already exists on CKB, you can use this field to reference the script instead of including it again. You can just put the script hash in this binaryHash field, then list the cell containing the script as an outpoint in deps field in the current transaction. CKB will automatically locate cell and load the binary from there and use it as script `binary` part. Notice this only works when you don't provide a `binary` field value, otherwise the value in the `binary` field always take precedence.
   * @tutorial Each script has a `lock_hash` which uniquely identifies the script, for example, the `lock_hash` of lock script, is exactly the corresponding `lock` script field value in the referenced cell, when calculating hash for a script, `bianryHash`, and `args` will all be used.
   */
  /* eslint-enable max-len */
  export interface Script {
    version: number
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
    args: Hash[]
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
    hash: Hash
    index: number
  }

  export interface Witness {
    data: string[]
  }

  /**
   * @typedef RawTransaction, raw transaction object
   * @property version, transaction version
   * @property deps, transaction deps
   * @property inputs, cell inputs in the transaction
   * @property outputs, cell outputs in the transaction
   */
  export interface RawTransaction {
    version: number
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
    hash: Hash
  }

  /**
   * @typedef @Seal
   * @property nonce
   * @property proof
   */
  export interface Seal {
    nonce: number // u64
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
    version: number
    parentHash: Hash
    timestamp: TimeStamp
    number: number
    txsCommit: Hash
    txsProposal: Hash
    witnessesRoot: Hash
    difficulty: Hash
    unclesHash: Hash
    unclesCount: number
    seal: Seal
    hash: Hash
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
    lock: Hash
    outPoint: OutPoint
  }

  export type TransactionTrace = { action: string; info: string; time: TimeStamp }[]

  export enum CellStatus {
    LIVE = 'live',
  }
  export interface NodeInfo {
    version: string
    nodeId: string
    addresses: { address: string; score: number }[]
  }
}
