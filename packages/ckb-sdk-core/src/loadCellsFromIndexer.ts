export const loadCellsFromIndexer = async ({
  CellCollector,
  indexer,
  lock,
  start,
  end,
}: LoadCellsParams.FromIndexer) => {
  const collector = new CellCollector(indexer, {
    lock: {
      code_hash: lock.codeHash,
      hash_type: lock.hashType,
      args: lock.args,
    },
    fromBlock: start,
    toBlock: end,
  })

  const cells: RawTransactionParams.Cell[] = []

  /* eslint-disable no-restricted-syntax, camelcase */
  for await (const {
    data,
    cell_output: { capacity, type },
    out_point,
  } of collector.collect()) {
    cells.push({
      data,
      lock,
      type: type && { codeHash: type.code_hash, hashType: type.hash_type, args: type.args },
      capacity,
      outPoint: { txHash: out_point.tx_hash, index: out_point.index },
    })
  }
  /* eslint-enable no-restricted-syntax */

  return cells
}

export default loadCellsFromIndexer
