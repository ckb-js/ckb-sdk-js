export const isIndexerParams = (
  params: LoadCellsParams.Normal | LoadCellsParams.FromIndexer,
): params is LoadCellsParams.FromIndexer => {
  return 'indexer' in params && 'CellCollector' in params
}

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

  const cells = []
  const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

  /* eslint-disable no-restricted-syntax */
  for await (const cell of collector.collect()) {
    cells.push({
      dataHash: cell.data === '0x' ? EMPTY_DATA_HASH : 'cell.data',
      type: cell.cell_output.type || null,
      capacity: cell.cell_output.capacity,
      outPoint: { txHash: cell.out_point.tx_hash, index: cell.out_point.index },
    })
  }
  /* eslint-enable no-restricted-syntax */

  // TODO: add and prune fields
  return cells as CachedCell[]
}

export default loadCellsFromIndexer
