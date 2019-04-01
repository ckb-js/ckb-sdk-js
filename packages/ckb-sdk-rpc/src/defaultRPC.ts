import paramsFmts from './paramsFormatter'
import resultFmts from './resultFormatter'

const defaultRPC: CKBComponents.Method[] = [
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
    name: 'localNodeInfo',
    method: 'local_node_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toLocalNodeInfo,
  },
  {
    name: 'traceTransaction',
    method: 'trace_transaction',
    paramsFormatters: [paramsFmts.toTx],
    resultFormatters: resultFmts.toHash,
  },
  {
    name: 'getTransactionTrace',
    method: 'get_transaction_trace',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toTrace,
  },
]

export class DefaultRPC {
  protected defaultMethods = defaultRPC

  public getBlock!: (hash: CKBComponents.Hash) => Promise<CKBComponents.Block>

  public getTransaction!: (hash: CKBComponents.Hash) => Promise<CKBComponents.Transaction>

  public getBlockHash!: (number: CKBComponents.BlockNumber) => Promise<CKBComponents.Hash>

  public getTipHeader!: () => Promise<CKBComponents.BlockHeader>

  public getCellsByTypeHash!: (
    hash: string,
    from: CKBComponents.BlockNumber,
    to: CKBComponents.BlockNumber
  ) => Promise<CKBComponents.CellByTypeHash[]>

  public getLiveCell!: (
    outPoint: CKBComponents.OutPoint
  ) => Promise<{
    cell: CKBComponents.Cell
    status: CKBComponents.CellStatus
  }>

  public getTipBlockNumber!: () => Promise<CKBComponents.BlockNumber>

  public sendTransaction!: (tx: CKBComponents.RawTransaction) => Promise<CKBComponents.Hash>

  public localNodeInfo!: () => Promise<CKBComponents.LocalNodeInfo>

  public traceTransaction!: (transaction: {
    version: CKBComponents.Version
    deps: CKBComponents.OutPoint[]
    inputs: CKBComponents.CellInput[]
    outputs: CKBComponents.CellOutput[]
  }) => Promise<CKBComponents.Hash>

  public getTransactionTrace!: (transactionHash: CKBComponents.Hash) => Promise<CKBComponents.TransactionTrace>
}

export default DefaultRPC
