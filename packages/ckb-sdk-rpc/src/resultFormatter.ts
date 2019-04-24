/* eslint-disable camelcase */
const formatters = {
  toNumber: (number: string | number) => +number,
  toHash: (hash: string) => hash,
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
  }: any) => ({
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
  toTransactionWithHash: (txn: any) => txn,
  toCells: (
    cells: {
      capacity: number
      lock: string
      out_point: {
        hash: string
        index: number
      }
    }[]
  ) =>
    cells.map(({ capacity, lock, out_point }) => ({
      capacity,
      lock,
      outPoint: out_point,
    })),
  toCellOutputWithOutput: (cell: any) => cell,
  toCellWithStatus: (cell: any) => cell,
  toBlockWithHash: (block: any) => block,
  toTxRes: (txRes: any) => txRes,
  toBlock: ({ header, uncles, transactions, proposals }: any) => {
    const formattedHeader: CKBComponents.BlockHeader = formatters.toHeader(header)
    const b: CKBComponents.Block = {
      header: formattedHeader,
      uncles,
      transactions,
      proposals,
    }
    return b
  },
  toTrace: (trace: CKBComponents.TransactionTrace) => trace,
  toLocalNodeInfo: (info: {
    version: string
    node_id: string
    addresses: { address: string; score: number }[]
  }): CKBComponents.NodeInfo => ({
    version: info.version,
    nodeId: info.node_id,
    addresses: info.addresses,
  }),

  /* eslint-enable camelcase */
}
export default formatters
