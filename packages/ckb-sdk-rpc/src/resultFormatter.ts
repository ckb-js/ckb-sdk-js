/* eslint-disable camelcase */
const formatter = {
  toNumber: (number: CKB_RPC.BlockNumber): CKBComponents.BlockNumber => number,
  toHash: (hash: CKB_RPC.Hash256): CKBComponents.Hash256 => hash,
  toHeader: ({
    transactions_root,
    proposals_root,
    witnesses_root,
    uncles_hash,
    uncles_count,
    parent_hash,
    ...rest
  }: CKB_RPC.Header): CKBComponents.BlockHeader => ({
    parentHash: parent_hash,
    transactionsRoot: transactions_root,
    proposalsRoot: proposals_root,
    witnessesRoot: witnesses_root,
    unclesHash: uncles_hash,
    unclesCount: uncles_count,
    ...rest,
  }),
  toScript: ({ code_hash: codeHash, ...rest }: CKB_RPC.Script): CKBComponents.Script => ({
    codeHash,
    ...rest,
  }),
  toInput: ({ previous_output: previousOutput, ...rest }: CKB_RPC.CellInput): CKBComponents.CellInput => ({
    previousOutput: formatter.toOutPoint(previousOutput),
    ...rest,
  }),
  toOutput: ({ lock, type, ...rest }: CKB_RPC.CellOutput): CKBComponents.CellOutput => ({
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
    ...rest,
  }),
  toOutPoint: ({ tx_hash: txHash, ...rest }: CKB_RPC.OutPoint): CKBComponents.OutPoint => ({
    txHash,
    ...rest,
  }),
  toTransaction: ({ deps, inputs, outputs, ...rest }: CKB_RPC.Transaction): CKBComponents.Transaction => ({
    deps: deps.map(formatter.toOutPoint),
    inputs: inputs.map(formatter.toInput),
    outputs: outputs.map(formatter.toOutput),
    ...rest,
  }),
  toUncleBlock: ({ header, ...rest }: CKB_RPC.UncleBlock): CKBComponents.UncleBlock => ({
    header: formatter.toHeader(header),
    ...rest,
  }),

  toBlock: ({ header, uncles, transactions, ...rest }: CKB_RPC.Block): CKBComponents.Block => ({
    header: formatter.toHeader(header),
    uncles: uncles.map(formatter.toUncleBlock),
    transactions: transactions.map(formatter.toTransaction),
    ...rest,
  }),
  toTrace: (trace: CKBComponents.TransactionTrace) => trace,
  toNodeInfo: ({ node_id: nodeId, ...rest }: CKB_RPC.NodeInfo): CKBComponents.NodeInfo => ({
    nodeId,
    ...rest,
  }),
  toCell: ({ lock, type, ...rest }: CKB_RPC.Cell): CKBComponents.Cell => ({
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
    ...rest,
  }),
  toCellWithStatus: ({ cell, ...rest }: { cell: CKB_RPC.Cell; status: string }) => ({
    cell: formatter.toCell(cell),
    ...rest,
  }),
  toCells: (cells: CKB_RPC.Cell[]): CKBComponents.Cell[] => cells.map(formatter.toCell),
  toTransactionWithStatus: ({
    transaction,
    tx_status: { block_hash: blockHash, status },
    ...rest
  }: CKB_RPC.TransactionWithStatus) => ({
    transaction: formatter.toTransaction(transaction),
    txStatus: {
      blockHash,
      status,
    },
    ...rest,
  }),
}
export default formatter
/* eslint-enable camelcase */
