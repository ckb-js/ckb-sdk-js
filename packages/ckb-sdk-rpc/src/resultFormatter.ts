/* eslint-disable camelcase */
const formatter = {
  toNumber: (number: CKB_RPC.BlockNumber): CKBComponents.BlockNumber => number,
  toHash: (hash: CKB_RPC.Hash256): CKBComponents.Hash256 => hash,
  toHeader: ({
    parent_hash,
    transactions_root,
    proposals_root,
    witnesses_root,
    uncles_hash,
    uncles_count,
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
  toScript: ({ args, code_hash: codeHash }: CKB_RPC.Script): CKBComponents.Script => ({
    args,
    codeHash,
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
  toOutPoint: ({ tx_hash: txHash, index }: CKB_RPC.OutPoint): CKBComponents.OutPoint => ({
    txHash,
    index,
  }),
  toTransaction: ({ deps, inputs, outputs, ...rest }: CKB_RPC.Transaction): CKBComponents.Transaction => ({
    deps: deps.map(formatter.toOutPoint),
    inputs: inputs.map(formatter.toInput),
    outputs: outputs.map(formatter.toOutput),
    ...rest,
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
  toTrace: (trace: CKBComponents.TransactionTrace) => trace,
  toBlockchainInfo: ({
    is_initial_block_download: isInitialBlockDownload,
    median_time: medianTime,
    ...rest
  }: CKB_RPC.BlockchainInfo): CKBComponents.BlockchainInfo => ({
    isInitialBlockDownload,
    medianTime,
    ...rest,
  }),
  toNodeInfo: ({ node_id: nodeId, ...rest }: CKB_RPC.NodeInfo): CKBComponents.NodeInfo => ({
    nodeId,
    ...rest,
  }),
  toTxPoolInfo: ({ last_txs_updated_at: lastTxsUpdatedAt, ...rest }: CKB_RPC.TxPoolInfo): CKBComponents.TxPoolInfo => ({
    lastTxsUpdatedAt,
    ...rest,
  }),
  toPeers: (nodes: CKB_RPC.NodeInfo[]): CKBComponents.NodeInfo[] => nodes.map(formatter.toNodeInfo),
  toPeersState: ({
    last_updated: lastUpdated,
    blocks_in_flight: blocksInFlight,
    ...rest
  }: CKB_RPC.PeersState): CKBComponents.PeersState => ({
    lastUpdated,
    blocksInFlight,
    ...rest,
  }),
  toCell: ({ lock, type, ...rest }: CKB_RPC.Cell): CKBComponents.Cell => ({
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
    ...rest,
  }),
  toCellWithStatus: ({ cell, status }: { cell: CKB_RPC.Cell; status: string }) => ({
    cell: formatter.toCell(cell),
    status,
  }),
  toCells: (cells: CKB_RPC.Cell[]): CKBComponents.Cell[] => cells.map(formatter.toCell),
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
  toEpoch: ({
    block_reward: blockReward,
    last_block_hash_in_previous_epoch: lastBlockHashInPreviousEpoch,
    remainder_reward: remainderReward,
    start_number: startNumber,
    ...rest
  }: CKB_RPC.Epoch): CKBComponents.Epoch => ({
    blockReward,
    lastBlockHashInPreviousEpoch,
    remainderReward,
    startNumber,
    ...rest,
  }),
}
export default formatter
/* eslint-enable camelcase */
