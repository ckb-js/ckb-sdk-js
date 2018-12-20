export interface INode {
  url: string
}
export type IHash = string
export type IBlockNumber = string

export interface IMethod {
  // scope: string[] | string;
  name: string
  method: string
  paramsFormatters: Function[]
  resultFormatters: Function[]
}

interface Block {}

interface BlockWithHash extends Block {}
interface Transaction {}
type Hash = string
type BlockNumber = string
type Outpoint = any
interface TransactionWithHash extends Transaction {}
interface Header {}
interface Cell {}
interface CellOutput {}
interface CellOutputWithOutPoint extends CellOutput {}
interface CellWithStatus extends Cell {}

export interface CKBDefaultRpc {
  getBlock: (hash: Hash) => Promise<BlockWithHash>
  getTransaction: (hash: Hash) => Promise<TransactionWithHash>
  getBlockHash: (blockNumber: BlockNumber) => Hash
  getTipHeader: () => Header
  getCallByTypeHash: (
    hash: Hash,
    from: BlockNumber,
    to: BlockNumber
  ) => Promise<CellOutputWithOutPoint[]>
  getCurrentCell: (outpoint: Outpoint) => CellWithStatus
  getTipBlockNumber: () => BlockNumber
}
