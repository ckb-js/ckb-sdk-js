// https://github.com/nervosnetwork/ckb/blob/develop/rpc/src/types/blockchain.rs

/* eslint-disable camelcase */
declare namespace CkbComponents {
  export type LocalNodeId = string
  export type Hash = string
  export type BlockNumber = number
  export type Capacity = number
  export type ProposalShortId = string
  export interface INode {
    url: string
  }
  export interface IMethod {
    name: string
    method: string
    paramsFormatters: Function[]
    resultFormatters: Function[]
  }
  /**
   * RPC Units
   */

  /**
   * @typedef IScript, lock or unlock script
   * @property version, script version
   * @property args, arguments
   * @property reference, point to its dependency
   * @property binary, its dependency
   * @property signed_args, arguments
   */

  export interface IScript {
    version: number
    args: Uint8Array[]
    reference?: Hash
    binary?: Uint8Array
    signed_args: Uint8Array[]
  }

  /**
   * @typedef ICellInput, cell input in a transaction
   * @property previousOutput, point to its P1 cell
   * @property unlock, unlock script
   */
  export interface ICellInput {
    prevOutput: IOutPoint
    unlock: IScritp
  }

  /**
   * @typedef ICellOutput, cell output in a transaction
   * @property capacity, the capacity of the genereated P1 cell
   * @property data, cell data
   * @property lock, lock hash
   * @property contract, lock script
   */
  export interface ICellOutput {
    capacity: Capacity
    data: Uint8Array
    lock: Hash
    type?: IScript
  }

  /**
   * @typedef IOutPoint, used to refer a generated cell by transaction hash and output index
   * @property hash, transaction hash
   * @property index, index of cell output
   */
  export interface IOutPoint {
    hash: Hash
    index: number
  }

  /**
   * @typedef ITransaction, transaction object
   * @property version, transaction version
   * @property deps, transaction deps
   * @property inputs, cell inputs in the transaction
   * @property outputs, cell outputs in the transaction
   * @property hash, transaction hash
   */
  export interface ITransaction {
    version: number
    deps: IOutPoint[]
    inputs: ICellInput[]
    outputs: ICellOutput[]
    hash: Hash
  }

  /**
   * @typedef @ISeal
   * @property nonce
   * @property proof
   */
  export interface ISeal {
    nonce: number // u64
    proof: Uint8Array
  }

  /**
   * @typedef IBlockHeader, header of a block
   * @property version
   * @property parentHash
   * @property timestamp
   * @property number
   * @property txsCommit
   * @property txsProposal
   * @property difficulty
   * @property cellbaseId
   * @property unclesHash
   * @property unclesCount
   * @property seal
   * @property hash
   */
  export interface IBlockHeader {
    version: number
    parentHash: Hash
    timestamp: TimeStamp
    number: number
    txsCommit: Hash
    txsProposal: Hash
    difficulty: Hash
    cellbaseId: Hash
    unclesHash: Hash
    unclesCount: number
    seal: ISeal
    hash: Hash
  }

  /**
   * @typedef IUncleBlock, uncle block object
   * @property header, block header
   * @property cellbase, transaction
   * @property proposalTransactions
   */

  interface IUncleBlock {
    header: IBlockHeader
    cellbase: ITransaction
    proposalTransactions: ProposalShortId[]
  }

  /**
   * @typedef IBlock, block object
   * @property header, block header
   * @property uncles, uncle blocks
   * @property commitTransactions
   * @property proposalTransactions
   */
  export interface IBlock {
    header: IBlockHeader
    uncles: IUncleBlock[]
    commitTransactions: ITransaction[]
    proposalTransactions: ProposalShortId[]
  }

  /**
   * @typedef ICell, cell object
   * @property capacty, cell capacity
   * @property lock, lock hash
   * @property outPoint
   */
  export interface ICell {
    capacity: number
    lock: Hash
    contract?: any
    data?: Uint8Array[]
    type?: string
    outPoint?: IOutPoint
  }
}

/* eslint-enable camelcase */
