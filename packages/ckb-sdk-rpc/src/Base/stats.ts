import resultFmts from '../resultFormatter'

export default {
  getBlockchainInfo: {
    method: 'get_blockchain_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toBlockchainInfo,
  },
  getPeersState: {
    method: 'get_peers_state',
    paramsFormatters: [],
    resultFormatters: resultFmts.toPeersState,
  },
}
