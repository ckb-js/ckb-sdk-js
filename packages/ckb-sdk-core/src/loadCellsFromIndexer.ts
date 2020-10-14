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

  /* eslint-disable no-restricted-syntax */
  for await (const cell of collector.collect()) {
    cells.push({
      data: cell.data,
      lock,
      type: cell.cell_output.type,
      capacity: cell.cell_output.capacity,
      outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
    })
  }
  /* eslint-enable no-restricted-syntax */

  return cells
}

export default loadCellsFromIndexer
