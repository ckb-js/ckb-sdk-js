/* eslint-disable camelcase */
const formatter = {
  toNumber: (number: CKB_RPC.BlockNumber): CKBComponents.BlockNumber => number,
  toHash: (hash: CKB_RPC.Hash256): CKBComponents.Hash256 => hash,
  toHeader: ({
    version,
    parent_hash,
    timestamp,
    number,
    transactions_root,
    proposals_root,
    witnesses_root,
    difficulty,
    uncles_hash,
    uncles_count,
    seal,
    hash,
  }: CKB_RPC.Header): CKBComponents.BlockHeader => ({
    version,
    number,
    parentHash: parent_hash,
    timestamp,
    transactionsRoot: transactions_root,
    proposalsRoot: proposals_root,
    witnessesRoot: witnesses_root,
    difficulty,
    unclesHash: uncles_hash,
    unclesCount: uncles_count,
    seal,
    hash,
  }),
  toScript: ({ args, code_hash: codeHash }: CKB_RPC.Script): CKBComponents.Script => ({
    args,
    codeHash,
  }),
  toInput: ({ previous_output: previousOutput, since, args }: CKB_RPC.CellInput): CKBComponents.CellInput => ({
    previousOutput: formatter.toOutPoint(previousOutput),
    since,
    args,
  }),
  toOutput: ({ capacity, data, lock, type }: CKB_RPC.CellOutput): CKBComponents.CellOutput => ({
    capacity,
    data,
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
  }),
  toOutPoint: ({ tx_hash: txHash, index }: CKB_RPC.OutPoint): CKBComponents.OutPoint => ({
    txHash,
    index,
  }),
  toTransaction: ({
    deps,
    inputs,
    outputs,
    version,
    witnesses,
    hash,
  }: CKB_RPC.Transaction): CKBComponents.Transaction => ({
    deps: deps.map(formatter.toOutPoint),
    inputs: inputs.map(formatter.toInput),
    outputs: outputs.map(formatter.toOutput),
    version,
    witnesses,
    hash,
  }),
  toUncleBlock: ({ header, proposals }: CKB_RPC.UncleBlock): CKBComponents.UncleBlock => ({
    header: formatter.toHeader(header),
    proposals,
  }),

  toBlock: ({ header, uncles, transactions, proposals }: CKB_RPC.Block): CKBComponents.Block => ({
    header: formatter.toHeader(header),
    uncles: uncles.map(formatter.toUncleBlock),
    transactions: transactions.map(formatter.toTransaction),
    proposals,
  }),
  // TODO: implement toTrace
  toTrace: (trace: CKBComponents.TransactionTrace) => trace,
  toNodeInfo: ({ addresses, node_id: nodeId, version }: CKB_RPC.NodeInfo): CKBComponents.NodeInfo => ({
    addresses,
    nodeId,
    version,
  }),
  toCell: ({ capacity, data, lock, type }: CKB_RPC.Cell): CKBComponents.Cell => ({
    capacity,
    data,
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
  }),
  toCellWithStatus: ({ cell, status }: { cell: CKB_RPC.Cell; status: string }) => ({
    cell: formatter.toCell(cell),
    status,
  }),
  toCells: (cells: CKB_RPC.Cell[]): CKBComponents.Cell[] => cells.map(formatter.toCell),
  // TODO: implement
  toSendTransactionResponse: (res: any) => res,
  toTransactionWithStatus: ({
    transaction,
    tx_status: { block_hash: blockHash, status },
  }: CKB_RPC.TransactionWithStatus) => ({
    transaction: formatter.toTransaction(transaction),
    txStatus: {
      blockHash,
      status,
    },
  }),
}
export default formatter
/* eslint-enable camelcase */
