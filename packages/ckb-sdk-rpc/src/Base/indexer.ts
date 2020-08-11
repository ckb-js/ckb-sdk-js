import paramsFmts from '../paramsFormatter'
import resultFmts from '../resultFormatter'

export default {
  indexLockHash: {
    method: 'index_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toOptional(paramsFmts.toNumber)],
    resultFormatters: resultFmts.toLockHashIndexState,
  },

  getLockHashIndexStates: {
    method: 'get_lock_hash_index_states',
    paramsFormatters: [],
    resultFormatters: resultFmts.toLockHashIndexStates,
  },

  getLiveCellsByLockHash: {
    method: 'get_live_cells_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toPageNumber, paramsFmts.toPageSize, paramsFmts.toReverseOrder],
    resultFormatters: resultFmts.toLiveCellsByLockHash,
  },

  getTransactionsByLockHash: {
    method: 'get_transactions_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toPageNumber, paramsFmts.toPageSize, paramsFmts.toReverseOrder],
    resultFormatters: resultFmts.toTransactionsByLockHash,
  },

  getCapacityByLockHash: {
    method: 'get_capacity_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toCapacityByLockHash,
  },

  deindexLockHash: {
    method: 'deindex_lock_hash',
    paramsFormatters: [paramsFmts.toHash],
  },
}
