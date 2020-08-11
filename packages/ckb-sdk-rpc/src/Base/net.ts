import resultFmts from '../resultFormatter'

export default {
  localNodeInfo: {
    method: 'local_node_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toLocalNodeInfo,
  },

  getPeers: {
    method: 'get_peers',
    paramsFormatters: [],
    resultFormatters: resultFmts.toPeers,
  },

  getBannedAddresses: {
    method: 'get_banned_addresses',
    paramsFormatters: [],
    resultFormatters: resultFmts.toBannedAddresses,
  },

  setBan: {
    method: 'set_ban',
    paramsFormatters: [],
  },

  syncState: {
    method: 'sync_state',
    paramsFormatters: [],
    resultFormatters: resultFmts.toSyncState,
  },

  // TODO: set_network_active
  // TODO: add_node
  // TODO: remove_node
}
