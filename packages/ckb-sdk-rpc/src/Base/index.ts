import chainRpc from './chain'
import experimentalRpc from './experimental'
import indexerRpc from './indexer'
import netRpc from './net'
import poolRpc from './pool'
import statsRpc from './stats'

export interface RpcPropertes {
  [name: string]: Omit<CKBComponents.Method, 'name'>
}

export const rpcProperties: RpcPropertes = {
  ...chainRpc,
  ...experimentalRpc,
  ...indexerRpc,
  // skip minerRpc
  ...netRpc,
  ...poolRpc,
  ...statsRpc,
  // skip subscription
}

export interface Base {
  /* Chain */

  /**
   * @method getTipBlockNumber
   * @memberof DefaultRPC
   * @description rpc to get the number of blocks in the longest blockchain
   * @return {Promise<string>} block number
   */
  getTipBlockNumber: () => Promise<CKBComponents.BlockNumber>

  /**
   * @method getTipHeader
   * @memberof DefaultRPC
   * @description rpc to get the tip header of the longeest blockchain
   * @return {Promise<object>} block header
   */
  getTipHeader: () => Promise<CKBComponents.BlockHeader>

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
   * @method getBlockHash
   * @memberof DefaultRPC
   * @description rpc to get the block hash by block number
   * @param {string} hash - block hash
   * @return {Promise<string>} block hash
   */
  getBlockHash: (number: CKBComponents.BlockNumber | bigint) => Promise<CKBComponents.Hash>

  /**
   * @method getBlock
   * @memberof DefaultRPC
   * @description rpc to get block by its hash
   * @param {string} hash - the block hash of the target block
   * @returns {Promise<object>} block object
   */
  getBlock: (hash: CKBComponents.Hash) => Promise<CKBComponents.Block>

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
   * @method getTransaction
   * @memberof DefaultRPC
   * @description rpc to get trasnaction wtih its status by its hash
   * @param {string} hash - the transaction hash of the target transaction
   * @return {Promise<object>} transaction object with transaction status
   */
  getTransaction: (hash: CKBComponents.Hash) => Promise<CKBComponents.TransactionWithStatus>

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

  /**
   * @method getBlockEconomicState
   * @memberof DefaultRPC
   * @description
   * @param {string} blockHash
   * @returns {Promise<BlockEconomicState>}
   */
  getBlockEconomicState: (blockHash: CKBComponents.Hash) => Promise<CKBComponents.BlockEconomicState>

  /**
   * @method getBlockByNumber
   * @memberof DefaultRPC
   * @description rpc to get block by its number
   * @param {string} number - the block number of the target block
   * @returns {Promise<object>} block object
   */
  getBlockByNumber: (number: CKBComponents.BlockNumber | bigint) => Promise<CKBComponents.Block>

  /* Experimental */

  /**
   * @method dryRunTransaction
   * @memberof DefaultRPC
   * @description dry run the transaction and return the execution cycles, this method will not check the transaction
   *              validaty, but only run the lock script and type script and then return the execution cycles.
   * @param {object} rawTrasnaction - the raw transaction whose cycles is going to be calculated
   * @return {Promise<object>} dry run result, including cycles the transaction used.
   */
  dryRunTransaction: (tx: CKBComponents.RawTransaction) => Promise<CKBComponents.RunDryResult>

  // skip _compute_transaction_hash

  calculateDaoMaximumWithdraw: (
    outPoint: CKBComponents.OutPoint,
    withdrawBlockHash: CKBComponents.Hash256,
  ) => Promise<string>

  // skip estimate_fee_rate

  // skip _compute_script_hash

  /* Indexer */

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
   * @method getLockHashIndexStates
   * @memberof DefaultRPC
   * @description get lock hash index states
   * @retrun {Promise<object[]>}
   */
  getLockHashIndexStates: () => Promise<CKBComponents.LockHashIndexStates>

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

  getCapacityByLockHash: (lockHash: CKBComponents.Hash) => Promise<CKBComponents.CapacityByLockHash>

  /**
   * @method deindexLockHash
   * @memberof DefaultRPC
   * @description remove index for live cells and transaction by the hash of lock script,
   *              returns empty array when the `lock_hash` not indexed yet.
   * @param {string} lockHash
   * @retrun {Promise<null}
   */
  deindexLockHash: (lockHash: CKBComponents.Hash256) => Promise<null>

  /* skip Miner */

  /* Net */

  /**
   * @method localNodeInfo
   * @memberof DefaultRPC
   * @description rpc to get the local node information
   * @return {Promise<object>} node info, including addresses, is_outbound, node id, and version
   */
  localNodeInfo: () => Promise<CKBComponents.NodeInfo>

  /**
   * @method getPeers
   * @memberof DefaultRPC
   * @description rpc to get connected peers info
   * @return {Promise<object[]>} peers' node info
   */
  getPeers: () => Promise<CKBComponents.NodeInfo[]>

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

  // TODO: sync_state

  // TODO: set_network_active

  // TODO: add_node

  // TODO: remove_node

  /* Pool */

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
   * @method txPoolInfo
   * @memberof DefaultRPC
   * @description rpc to get pool information
   * @return {Promise<object>} info of transaction pool, including last_txs_updated_at, number of orphan,
   *                           number of pending, number of proposed
   */
  txPoolInfo: () => Promise<CKBComponents.TxPoolInfo>

  // TODO: clear_tx_pool

  /* Stats */

  /**
   * @method getBlockchainInfo
   * @memberof DefaultRPC
   * @description rpc to get state info of the blockchain
   * @return {Promise<object>} blockchain info, including chain name, difficulty, epoch number,
   *                           is_intial_block_download, median time, warnings
   */
  getBlockchainInfo: () => Promise<CKBComponents.BlockchainInfo>

  /**
   * @method getPeersState
   * @memberof DefaultRPC
   * @description rpc to get state info of peers
   * @return {Promise<object[]>} peers' state info, including blocks_in_flight, last_updated, peer number
   */
  getPeersState: () => Promise<CKBComponents.PeersState>

  /* skip Subscription */
}

export class Base {
  #rpcProperties = rpcProperties

  get rpcProperties() {
    return this.#rpcProperties
  }
}

export default Base
