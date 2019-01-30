export default {
  toHash: (hash: string): string => hash,
  toOutPoint: (outPoint: string): any => outPoint,
  toNumber: (number: string | number): number => +number,
  toTx: (): // tx: CKBComponents.ITransaction
  any => ({
    version: 1,
    deps: [],
    inputs: [
      {
        prevOutput: {
          hash:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          index: 0,
        },
        unlock: {
          version: 0,
          args: [],
          binary: Uint8Array.from([109, 105, 110, 101, 114]), // "miner".into_bytes
        },
      },
    ],
    outputs: [
      {
        capacity: 0,
        data: Uint8Array.from([0]),
        lock:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
  }),

  /* eslint-disable camelcase */
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
}
/* eslint-enable camelcase */
