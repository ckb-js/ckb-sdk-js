import paramsFmts from './paramsFormatter'
import resultFmts from './resultFormatter'

export interface RpcPropertes {
  [name: string]: Omit<CKBComponents.Method, 'name'>
}

export const rpcProperties: RpcPropertes = {
  getBlockByNumber: {
    method: 'get_block_by_number',
    paramsFormatters: [paramsFmts.toNumber],
    resultFormatters: resultFmts.toBlock,
  },
  getBlock: {
    method: 'get_block',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toBlock,
  },
  getTransaction: {
    method: 'get_transaction',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toTransactionWithStatus,
  },
  getBlockHash: {
    method: 'get_block_hash',
    paramsFormatters: [paramsFmts.toNumber],
  },
  getTipHeader: {
    method: 'get_tip_header',
    paramsFormatters: [],
    resultFormatters: resultFmts.toHeader,
  },
  getCellsByLockHash: {
    method: 'get_cells_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toNumber, paramsFmts.toNumber],
    resultFormatters: resultFmts.toCellsIncludingOutPoint,
  },
  getLiveCell: {
    method: 'get_live_cell',
    paramsFormatters: [paramsFmts.toOutPoint],
    resultFormatters: resultFmts.toLiveCellWithStatus,
  },
  getTipBlockNumber: {
    method: 'get_tip_block_number',
    paramsFormatters: [],
    resultFormatters: resultFmts.toNumber,
  },
  getBlockchainInfo: {
    method: 'get_blockchain_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toBlockchainInfo,
  },
  sendTransaction: {
    method: 'send_transaction',
    paramsFormatters: [paramsFmts.toRawTransaction, paramsFmts.toOutputsValidator],
    resultFormatters: resultFmts.toHash,
  },
  localNodeInfo: {
    method: 'local_node_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toNodeInfo,
  },
  txPoolInfo: {
    method: 'tx_pool_info',
    paramsFormatters: [],
    resultFormatters: resultFmts.toTxPoolInfo,
  },
  getPeers: {
    method: 'get_peers',
    paramsFormatters: [],
    resultFormatters: resultFmts.toPeers,
  },
  getPeersState: {
    method: 'get_peers_state',
    paramsFormatters: [],
    resultFormatters: resultFmts.toPeersState,
  },
  getCurrentEpoch: {
    method: 'get_current_epoch',
    paramsFormatters: [],
    resultFormatters: resultFmts.toEpoch,
  },
  getEpochByNumber: {
    method: 'get_epoch_by_number',
    paramsFormatters: [paramsFmts.toNumber],
    resultFormatters: resultFmts.toEpoch,
  },
  dryRunTransaction: {
    method: 'dry_run_transaction',
    paramsFormatters: [paramsFmts.toRawTransaction],
  },
  deindexLockHash: {
    method: 'deindex_lock_hash',
    paramsFormatters: [paramsFmts.toHash],
  },
  getLiveCellsByLockHash: {
    method: 'get_live_cells_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toPageNumber, paramsFmts.toPageSize, paramsFmts.toReverseOrder],
    resultFormatters: resultFmts.toLiveCellsByLockHash,
  },
  getLockHashIndexStates: {
    method: 'get_lock_hash_index_states',
    paramsFormatters: [],
    resultFormatters: resultFmts.toLockHashIndexStates,
  },
  getTransactionsByLockHash: {
    method: 'get_transactions_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toPageNumber, paramsFmts.toPageSize, paramsFmts.toReverseOrder],
    resultFormatters: resultFmts.toTransactionsByLockHash,
  },
  indexLockHash: {
    method: 'index_lock_hash',
    paramsFormatters: [paramsFmts.toHash, paramsFmts.toOptional(paramsFmts.toNumber)],
    resultFormatters: resultFmts.toLockHashIndexState,
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
  getHeader: {
    method: 'get_header',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toHeader,
  },
  getHeaderByNumber: {
    method: 'get_header_by_number',
    paramsFormatters: [paramsFmts.toNumber],
    resultFormatters: resultFmts.toHeader,
  },
  getCellbaseOutputCapacityDetails: {
    method: 'get_cellbase_output_capacity_details',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toCellbaseOutputCapacityDetails,
  },
  calculateDaoMaximumWithdraw: {
    method: 'calculate_dao_maximum_withdraw',
    paramsFormatters: [paramsFmts.toOutPoint, paramsFmts.toHash],
  },
  getCapacityByLockHash: {
    method: 'get_capacity_by_lock_hash',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toCapacityByLockHash,
  },
  getBlockEconomicState: {
    method: 'get_block_economic_state',
    paramsFormatters: [paramsFmts.toHash],
    resultFormatters: resultFmts.toBlockEconomicState,
  },
}

export interface Base {
  /**
   * @method getBlockByNumber
   * @memberof DefaultRPC
   * @description rpc to get block by its number
   * @param {string} number - the block number of the target block
   * @returns {Promise<object>} block object
   */
  getBlockByNumber: (number: CKBComponents.BlockNumber | bigint) => Promise<CKBComponents.Block>

  /**
   * @method getBlockByNumber
   * @memberof DefaultRPC
   * @description rpc to get block by its hash
   * @param {string} hash - the block hash of the target block
   * @returns {Promise<object>} block object
   */
  getBlock: (hash: CKBComponents.Hash) => Promise<CKBComponents.Block>

  /**
   * @method getTransaction
   * @memberof DefaultRPC
   * @description rpc to get trasnaction wtih its status by its hash
   * @param {string} hash - the transaction hash of the target transaction
   * @return {Promise<object>} transaction object with transaction status
   */
  getTransaction: (hash: CKBComponents.Hash) => Promise<CKBComponents.TransactionWithStatus>

  /**
   * @method getBlockHash
   * @memberof DefaultRPC
   * @description rpc to get the block hash by block number
   * @param {string} hash - block hash
   * @return {Promise<string>} block hash
   */
  getBlockHash: (number: CKBComponents.BlockNumber | bigint) => Promise<CKBComponents.Hash>

  /**
   * @method getTipHeader
   * @memberof DefaultRPC
   * @description rpc to get the tip header of the longeest blockchain
   * @return {Promise<object>} block header
   */
  getTipHeader: () => Promise<CKBComponents.BlockHeader>

  /**
   * @method getCellsByLockHash
   * @memberof DefaultRPC
   * @description rpc to get the collection of cells who have the corresponding lockhash,
   *              the meaning of lockhash could be found in ckb-types
   * @param {string} hash - hash of cell's lock script
   * @param {string} from - the start block number
   * @param {string} to - the end block number
   * @return {object[]} array of objects including lock script, capacity, outPoint
   */
  getCellsByLockHash: (
    hash: CKBComponents.Hash256,
    from: CKBComponents.BlockNumber | bigint,
    to: CKBComponents.BlockNumber | bigint,
  ) => Promise<CKBComponents.CellIncludingOutPoint[]>

  /**
   * @method getLiveCell
   * @memberof DefaultRPC
   * @description rpc to get a cell by outPoint, the meaning of outPoint could be found in ckb-types,
   *              please distinguish outPoint and cellOutPoint
   * @param {object} outPoint - cell's outPoint
   * @param {boolean} withData - set withData to true to return cell data and data hash if the cell is live
   * @return {Promise<object>} liveCellWithStatus
   */
  getLiveCell: (
    outPoint: CKBComponents.OutPoint,
    withData: boolean,
  ) => Promise<{
    cell: CKBComponents.LiveCell
    status: CKBComponents.CellStatus
  }>

  /**
   * @method getTipBlockNumber
   * @memberof DefaultRPC
   * @description rpc to get the number of blocks in the longest blockchain
   * @return {Promise<string>} block number
   */
  getTipBlockNumber: () => Promise<CKBComponents.BlockNumber>

  /**
   * @method sendTransaction
   * @memberof DefaultRPC
   * @description rpc to send a new transaction into transaction pool
   * @param {object} rawTransaction - a raw transaction includes cell deps, inputs, outputs, version, and witnesses,
   *                                  detailed info could be found in ckb-types
   * @param {string} [outputsValidator] - Validates the transaction outputs before entering the tx-pool,
   *                                  an optional string parameter (enum: default | passthrough ),
   *                                  null and passthrough mean skipping outputs validation
   * @return {Promise<string>} transaction hash
   */
  sendTransaction: (
    tx: CKBComponents.RawTransaction,
    outputsValidator?: CKBComponents.OutputsValidator,
  ) => Promise<CKBComponents.Hash>

  /**
   * @method getBlockchainInfo
   * @memberof DefaultRPC
   * @description rpc to get state info of the blockchain
   * @return {Promise<object>} blockchain info, including chain name, difficulty, epoch number,
   *                           is_intial_block_download, median time, warnings
   */
  getBlockchainInfo: () => Promise<CKBComponents.BlockchainInfo>

  /**
   * @method localNodeInfo
   * @memberof DefaultRPC
   * @description rpc to get the local node information
   * @return {Promise<object>} node info, including addresses, is_outbound, node id, and version
   */
  localNodeInfo: () => Promise<CKBComponents.NodeInfo>

  /**
   * @method txPoolInfo
   * @memberof DefaultRPC
   * @description rpc to get pool information
   * @return {Promise<object>} info of transaction pool, including last_txs_updated_at, number of orphan,
   *                           number of pending, number of proposed
   */
  txPoolInfo: () => Promise<CKBComponents.TxPoolInfo>

  /**
   * @method getPeers
   * @memberof DefaultRPC
   * @description rpc to get connected peers info
   * @return {Promise<object[]>} peers' node info
   */
  getPeers: () => Promise<CKBComponents.NodeInfo[]>

  /**
   * @method getPeersState
   * @memberof DefaultRPC
   * @description rpc to get state info of peers
   * @return {Promise<object[]>} peers' state info, including blocks_in_flight, last_updated, peer number
   */
  getPeersState: () => Promise<CKBComponents.PeersState>

  /**
   * @method getCurrentEpoch
   * @memberof DefaultRPC
   * @description rpc to get the epoch info about the current epoch
   * @return {Promise<object>} epoch info, including block reward, difficulty, last_block_hash_in_previous_epoch,
   *                           length, number, remainder reward, start number
   */
  getCurrentEpoch: () => Promise<CKBComponents.Epoch>

  /**
   * @method getEpochByNumber
   * @memberof DefaultRPC
   * @description rpc to get the epoch info by its number
   * @return {Promise<object>} epoch info
   */
  getEpochByNumber: (epoch: string | bigint) => Promise<CKBComponents.Epoch>

  /**
   * @method dryRunTransaction
   * @memberof DefaultRPC
   * @description dry run the transaction and return the execution cycles, this method will not check the transaction
   *              validaty, but only run the lock script and type script and then return the execution cycles.
   * @param {object} rawTrasnaction - the raw transaction whose cycles is going to be calculated
   * @return {Promise<object>} dry run result, including cycles the transaction used.
   */
  dryRunTransaction: (tx: CKBComponents.RawTransaction) => Promise<CKBComponents.RunDryResult>

  /**
   * @method deindexLockHash
   * @memberof DefaultRPC
   * @description remove index for live cells and transaction by the hash of lock script,
   *              returns empty array when the `lock_hash` not indexed yet.
   * @param {string} lockHash
   * @retrun {Promise<null}
   */
  deindexLockHash: (lockHash: CKBComponents.Hash256) => Promise<null>

  /**
   * @method getLiveCellsByLockHash
   * @memberof DefaultRPC
   * @description return the live cells collection by the hash of lock script
   * @param {string} lockHash, the hash of lock script
   * @param {string} pageNumber
   * @param {string} pageSize, max value is 50
   * @param {boolean} [reverseOrder], return the live cells collection in reverse order,
   *                                  an optional parameter, default to be false
   * @return {Promise<object[]>}
   */
  getLiveCellsByLockHash: (
    lockHash: CKBComponents.Hash256,
    pageNumber: string | bigint,
    pageSize: string | bigint,
    reverseOrder?: boolean,
  ) => Promise<CKBComponents.LiveCellsByLockHash>

  /**
   * @method getLockHashIndexStates
   * @memberof DefaultRPC
   * @description get lock hash index states
   * @retrun {Promise<object[]>}
   */
  getLockHashIndexStates: () => Promise<CKBComponents.LockHashIndexStates>

  /**
   * @method getTransactionsByLockHash
   * @memberof DefaultRPC
   * @description retrun the transactions collection by the hash of lock script.
   *              return empty array when the `lock_hash` not indexed yet.
   * @param {string} lockHash, the hash of lock script
   * @param {string} pageNumber
   * @param {string} pageSize, max value is 50
   * @param {boolean} [reverseOrder], return the transactions collection in reverse order,
   *                                  an optional parameter, default to be false
   */
  getTransactionsByLockHash: (
    lockHash: CKBComponents.Hash256,
    pageNumber: string | bigint,
    pageSize: string | bigint,
    reverseOrder?: boolean,
  ) => Promise<CKBComponents.TransactionsByLockHash>

  /**
   * @method indexLockHash
   * @memberof DefaultRPC
   * @description create index for live cells and transactions by the hash of lock script
   * @param {string} lockHash, the hash of lock script
   * @param {string} [indexFrom], the starting block number(exclusive), an optional parameter,
   *                              null means starting from the tip and 0 means starting from genesis
   */
  indexLockHash: (
    lockHash: CKBComponents.Hash,
    indexFrom?: CKBComponents.BlockNumber,
  ) => Promise<CKBComponents.LockHashIndexState>

  /**
   * @method getBannedAddresses
   * @memberof DefaultRPC
   * @description Returns all banned IPs/Subnets
   */
  getBannedAddresses: () => Promise<CKBComponents.BannedAddresses>
  /**
   * @method setBan
   * @memberof DefaultRPC
   * @description insert or delete an IP/Subnet from the banned list
   * @param {string} address, The IP/Subnet with an optional netmask (default is /32 = single IP)
   * @param {insert|delete} command, `insert` to insert an IP/Subnet to the list, `delete` to delete an IP/Subnet
   *                                 from the list
   * @param {string|null} ban_time, Time in milliseconds how long (or until when if [absolute] is set) the IP is banned,
   *                                optional parameter, null means using the default time of 24h
   * @param {[boolean]} absolute, If set, the `ban_time` must be an absolute timestamp in milliseconds since epoch,
   *                              optional parameter
   * @param {[string]} reason, Ban reason, optional parameter
   */

  setBan: (
    address: string,
    command: 'insert' | 'delete',
    banTime: string | null,
    absolute?: boolean,
    reason?: string,
  ) => Promise<null>

  /**
   * @method getHeader
   * @memberof DefaultRPC
   * @description Returns the information about a block header by hash.
   * @params {string} block hash
   */
  getHeader: (blockHash: CKBComponents.Hash) => Promise<CKBComponents.BlockHeader>

  /**
   * @method getHeaderByNumber
   * @memberof DefaultRPC
   * @description Returns the information about a block header by block number
   * @params {string} block number
   */
  getHeaderByNumber: (blockNumber: CKBComponents.BlockNumber | bigint) => Promise<CKBComponents.BlockHeader>

  /**
   * @method getCellbaseOutputCapacityDetails
   * @memberof DefaultRPC
   * @description Returns each component of the created CKB in this block's cellbase, which is issued to
   *              a block N - 1 - ProposalWindow.farthest, where this block's height is N.
   * @param {string} blockHash
   */
  getCellbaseOutputCapacityDetails: (
    blockHash: CKBComponents.Hash,
  ) => Promise<CKBComponents.CellbaseOutputCapacityDetails>

  calculateDaoMaximumWithdraw: (
    outPoint: CKBComponents.OutPoint,
    withdrawBlockHash: CKBComponents.Hash256,
  ) => Promise<string>

  getCapacityByLockHash: (lockHash: CKBComponents.Hash) => Promise<CKBComponents.CapacityByLockHash>

  /**
   * @method getBlockEconomicState
   * @memberof DefaultRPC
   * @description
   * @param {string} blockHash
   * @returns {Promise<BlockEconomicState>}
   */
  getBlockEconomicState: (blockHash: CKBComponents.Hash) => Promise<CKBComponents.BlockEconomicState>
}

export class Base {
  #rpcProperties = rpcProperties

  get rpcProperties() {
    return this.#rpcProperties
  }
}

export default Base
