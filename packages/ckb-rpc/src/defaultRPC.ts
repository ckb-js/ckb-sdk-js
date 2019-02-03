import paramsFmts from './paramsFormatter'
import resultFmts from './resultFormatter'

const defaultRPC: CKBComponents.IMethod[] = [
  {
    name: 'getBlock',
    method: 'get_block',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toBlock,
  },
  {
    name: 'getTransaction',
    method: 'get_transaction',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toNumber, paramsFmts.toNumber],
  },
  {
    name: 'getBlockHash',
    method: 'get_block_hash',
    paramsFormatters: [paramsFmts.toNumber],
  },
  {
    name: 'getTipHeader',
    method: 'get_tip_header',
    paramsFormatters: [],
    resultFormatters: resultFmts.toHeader,
  },
  {
    name: 'getCellsByTypeHash',
    method: 'get_cells_by_type_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toNumber, paramsFmts.toNumber],
    resultFormatters: resultFmts.toCells,
  },
  {
    name: 'getLiveCell',
    method: 'get_live_cell',
    paramsFormatters: [paramsFmts.toOutPoint],
    resultFormatters: resultFmts.toCellWithStatus,
  },
  {
    name: 'getTipBlockNumber',
    method: 'get_tip_block_number',
    paramsFormatters: [],
    resultFormatters: resultFmts.toNumber,
  },
  {
    name: 'sendTransaction',
    method: 'send_transaction',
    paramsFormatters: [paramsFmts.toTx],
    resultFormatters: resultFmts.toTxRes,
  },
  {
    name: 'localNodeId',
    method: 'local_node_id',
    paramsFormatters: [],
  },
]

export class DefaultRPC {
  protected defaultMethods = defaultRPC

  public getBlock!: (hash: CKBComponents.Hash) => Promise<CKBComponents.IBlock>

  public getTransaction!: (hash: CKBComponents.Hash) => Promise<CKBComponents.ITransaction>

  public getBlockHash!: (number: CKBComponents.BlockNumber) => Promise<CKBComponents.Hash>

  public getTipHeader!: () => Promise<CKBComponents.IBlockHeader>

  public getCellsByTypeHash!: (
    hash: string,
    from: CKBComponents.BlockNumber,
    to: CKBComponents.BlockNumber
  ) => Promise<CKBComponents.ICellByTypeHash[]>

  public getLiveCell!: (
    outPoint: CKBComponents.IOutPoint
  ) => Promise<{
    cell: CKBComponents.ICell
    status: CKBComponents.CellStatus
  }>

  public getTipBlockNumber!: () => Promise<CKBComponents.BlockNumber>

  public sendTransaction!: (tx: CKBComponents.ITransaction) => Promise<CKBComponents.Hash>

  public localNodeId!: () => Promise<CKBComponents.LocalNodeId>
}

export default DefaultRPC
