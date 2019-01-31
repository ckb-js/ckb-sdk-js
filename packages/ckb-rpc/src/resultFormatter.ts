/* eslint-disable camelcase */
const formatters = {
  toNumber: (number: string | number) => +number,
  toHash: (hash: string) => hash,
  toHeader: ({
    version,
    parent_hash,
    timestamp,
    number,
    txs_commit,
    txs_proposal,
    difficulty,
    cellbase_id,
    uncles_hash,
    uncles_count,
    seal,
    hash,
  }: any) => ({
    version,
    number,
    parentHash: parent_hash,
    timestamp,
    txsCommit: txs_commit,
    txsProposal: txs_proposal,
    difficulty,
    cellbaseId: cellbase_id,
    unclesHash: uncles_hash,
    unclesCount: uncles_count,
    seal,
    hash,
  }),
  // toTransaction: ({ version, deps, inputs, hash }: any) => ({
  //   version,
  //   deps,
  //   inputs,
  //   hash,
  // }),
  toTransactionWithHash: (txn: any) => txn,
  toCells: (
    cells: {
      capacity: number
      lock: string
      out_point: {
        hash: string
        index: number
      }
    }[],
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
  toBlock: ({
    header,
    uncles,
    commit_transactions,
    proposal_transactions,
  }: any) => {
    const h: CKBComponents.IBlockHeader = {
      version: header.version,
      parentHash: header.parent_hash,
      timestamp: header.timestamp,
      number: header.number,
      txsCommit: header.txs_commit,
      txsProposal: header.txs_proposal,
      difficulty: header.difficulty,
      cellbaseId: header.cellbase_id,
      unclesHash: header.uncle_hash,
      unclesCount: header.uncle_count,
      seal: header.seal,
      hash: header.hash,
    }
    const u = uncles
    const c = commit_transactions
    const p = proposal_transactions
    const b: CKBComponents.IBlock = {
      header: h,
      uncles: u,
      commitTransactions: c,
      proposalTransactions: p,
    }
    return b
  },

  /* eslint-enable camelcase */
}
export default formatters
