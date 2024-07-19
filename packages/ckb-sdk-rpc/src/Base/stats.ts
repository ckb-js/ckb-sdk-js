import resultFmts from '../resultFormatter.js'

export default {
  getBlockchainInfo: {
    method: 'get_blockchain_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toBlockchainInfo,
  },
  getFeeRateStats: {
    method: 'get_fee_rate_statistics',
    paramsFormatters: [],
  },
}
