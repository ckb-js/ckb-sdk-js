/* eslint-disable camelcase */
const formatter = {
  toNumber: (number: CKB_RPC.BlockNumber): CKBComponents.BlockNumber => number.toString(),
  toHash: (hash: CKB_RPC.Hash256): CKBComponents.Hash256 => hash,
  toHeader: (header: CKB_RPC.Header): CKBComponents.BlockHeader => {
    if (!header) return header
    const {
      transactions_root,
      proposals_hash,
      witnesses_root,
      uncles_hash,
      uncles_count,
      parent_hash,
      ...rest
    } = header
    return {
      parentHash: parent_hash,
      transactionsRoot: transactions_root,
      proposalsHash: proposals_hash,
      witnessesRoot: witnesses_root,
      unclesHash: uncles_hash,
      unclesCount: uncles_count,
      ...rest,
    }
  },
  toScript: (script: CKB_RPC.Script): CKBComponents.Script => {
    if (!script) return script
    const { code_hash: codeHash, hash_type: hashType, ...rest } = script
    return {
      codeHash,
      hashType,
      ...rest,
    }
  },
  toInput: (input: CKB_RPC.CellInput): CKBComponents.CellInput => {
    if (!input) return input
    const { previous_output: previousOutput, ...rest } = input
    return {
      previousOutput: previousOutput ? formatter.toOutPoint(previousOutput) : previousOutput,
      ...rest,
    }
  },
  toOutput: (output: CKB_RPC.CellOutput): CKBComponents.CellOutput => {
    if (!output) return output
    const { lock, type, ...rest } = output
    return {
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    }
  },
  toOutPoint: (outPoint: CKB_RPC.OutPoint | null): CKBComponents.OutPoint | null => {
    if (!outPoint) return outPoint
    const { tx_hash: txHash, ...rest } = outPoint
    return {
      txHash,
      ...rest,
    }
  },
  toDepType: (type: CKB_RPC.DepType) => {
    if (type === 'dep_group') {
      return 'depGroup'
    }
    return type
  },

  toCellDep: (cellDep: CKB_RPC.CellDep): CKBComponents.CellDep => {
    if (!cellDep) return cellDep
    const { out_point: outPoint = null, dep_type = 'code', ...rest } = cellDep
    return {
      outPoint: formatter.toOutPoint(outPoint),
      depType: formatter.toDepType(dep_type),
      ...rest,
    }
  },
  toTransaction: (tx: CKB_RPC.Transaction): CKBComponents.Transaction => {
    if (!tx) return tx
    const {
      cell_deps: cellDeps = [],
      inputs = [],
      outputs = [],
      outputs_data: outputsData = [],
      header_deps: headerDeps = [],
      ...rest
    } = tx
    return {
      cellDeps: cellDeps.map(formatter.toCellDep),
      inputs: inputs.map(formatter.toInput),
      outputs: outputs.map(formatter.toOutput),
      outputsData,
      headerDeps,
      ...rest,
    }
  },
  toUncleBlock: (uncleBlock: CKB_RPC.UncleBlock): CKBComponents.UncleBlock => {
    if (!uncleBlock) return uncleBlock
    const { header, ...rest } = uncleBlock
    return {
      header: formatter.toHeader(header),
      ...rest,
    }
  },

  toBlock: (block: CKB_RPC.Block): CKBComponents.Block => {
    if (!block) return block
    const { header, uncles = [], transactions = [], ...rest } = block
    return {
      header: formatter.toHeader(header),
      uncles: uncles.map(formatter.toUncleBlock),
      transactions: transactions.map(formatter.toTransaction),
      ...rest,
    }
  },
  toAlertMessage: (alertMessage: CKB_RPC.AlertMessage): CKBComponents.AlertMessage => {
    if (!alertMessage) return alertMessage
    const { notice_until: noticeUntil, ...rest } = alertMessage
    return {
      noticeUntil,
      ...rest,
    }
  },
  toBlockchainInfo: (info: CKB_RPC.BlockchainInfo): CKBComponents.BlockchainInfo => {
    if (!info) return info
    const { is_initial_block_download: isInitialBlockDownload, median_time: medianTime, alerts, ...rest } = info
    return {
      isInitialBlockDownload,
      medianTime,
      alerts: alerts.map(formatter.toAlertMessage),
      ...rest,
    }
  },
  toNodeInfo: (info: CKB_RPC.NodeInfo): CKBComponents.NodeInfo => {
    if (!info) return info
    const { node_id: nodeId, is_outbound: isOutbound, ...rest } = info
    return {
      nodeId,
      isOutbound,
      ...rest,
    }
  },
  toTxPoolInfo: (info: CKB_RPC.TxPoolInfo): CKBComponents.TxPoolInfo => {
    if (!info) return info
    const {
      last_txs_updated_at: lastTxsUpdatedAt,
      total_tx_cycles: totalTxCycles,
      total_tx_size: totalTxSize,
      ...rest
    } = info
    return {
      lastTxsUpdatedAt,
      totalTxCycles,
      totalTxSize,
      ...rest,
    }
  },
  toPeers: (nodes: CKB_RPC.NodeInfo[] = []): CKBComponents.NodeInfo[] => {
    if (!Array.isArray(nodes)) return []
    return nodes.map(formatter.toNodeInfo)
  },
  toPeersState: (state: CKB_RPC.PeersState): CKBComponents.PeersState => {
    if (!state) return state
    const { last_updated: lastUpdated, blocks_in_flight: blocksInFlight, ...rest } = state
    return {
      lastUpdated,
      blocksInFlight,
      ...rest,
    }
  },
  toCell: (cell: CKB_RPC.Cell): CKBComponents.Cell => {
    if (!cell) return cell
    const { lock, type, ...rest } = cell
    return {
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : null,
      ...rest,
    }
  },
  toCellWithStatus: (cellWithStatus: { cell: CKB_RPC.Cell; status: string }) => {
    if (!cellWithStatus) return cellWithStatus
    const { cell, ...rest } = cellWithStatus
    return {
      cell: formatter.toCell(cell),
      ...rest,
    }
  },
  toCells: (cells: CKB_RPC.Cell[] = []): CKBComponents.Cell[] => {
    if (!Array.isArray(cells)) return []
    return cells.map(formatter.toCell)
  },
  toCellIncludingOutPoint: (cell: CKB_RPC.CellIncludingOutPoint) => {
    if (!cell) return cell
    const { lock, out_point, ...rest } = cell
    return {
      lock: formatter.toScript(lock),
      outPoint: formatter.toOutPoint(out_point),
      ...rest,
    }
  },
  toCellsIncludingOutPoint: (cells: CKB_RPC.CellIncludingOutPoint[] = []): CKBComponents.CellIncludingOutPoint[] => {
    if (!Array.isArray(cells)) return []
    return cells.map(formatter.toCellIncludingOutPoint)
  },
  toTransactionWithStatus: (txWithStatus: CKB_RPC.TransactionWithStatus) => {
    if (!txWithStatus) return txWithStatus
    const {
      transaction,
      tx_status: { block_hash: blockHash, status },
      ...rest
    } = txWithStatus
    return {
      transaction: formatter.toTransaction(transaction),
      txStatus: {
        blockHash,
        status,
      },
      ...rest,
    }
  },
  toEpoch: (epoch: CKB_RPC.Epoch): CKBComponents.Epoch => {
    if (!epoch) return epoch
    const { start_number: startNumber, ...rest } = epoch
    return {
      startNumber,
      ...rest,
    }
  },
  toTransactionPoint: (transactionPoint: CKB_RPC.TransactionPoint): CKBComponents.TransactionPoint => {
    if (!transactionPoint) return transactionPoint
    const { block_number: blockNumber, tx_hash: txHash, ...rest } = transactionPoint
    return {
      blockNumber,
      txHash,
      ...rest,
    }
  },
  toTransactionsByLockHash: (transactions: CKB_RPC.TransactionsByLockHash): CKBComponents.TransactionsByLockHash => {
    if (!transactions) return transactions
    return transactions.map(tx => ({
      consumedBy: tx.consumed_by ? formatter.toTransactionPoint(tx.consumed_by) : tx.consumed_by,
      createdBy: formatter.toTransactionPoint(tx.created_by),
    }))
  },
  toLiveCellsByLockHash: (cells: CKB_RPC.LiveCellsByLockHash): CKBComponents.LiveCellsByLockHash => {
    if (!cells) return cells
    return cells.map(cell => ({
      cellOutput: formatter.toCell(cell.cell_output),
      createdBy: formatter.toTransactionPoint(cell.created_by),
    }))
  },
  toLockHashIndexState: (index: CKB_RPC.LockHashIndexState): CKBComponents.LockHashIndexState => {
    if (!index) return index
    const { block_hash: blockHash, block_number: blockNumber, lock_hash: lockHash, ...rest } = index
    return {
      blockHash,
      blockNumber,
      lockHash,
      ...rest,
    }
  },
  toLockHashIndexStates: (states: CKB_RPC.LockHashIndexStates): CKBComponents.LockHashIndexStates => {
    if (!states) return states
    return states.map(formatter.toLockHashIndexState)
  },
  toBannedAddress: (bannedAddress: CKB_RPC.BannedAddress): CKBComponents.BannedAddress => {
    if (!bannedAddress) return bannedAddress
    const { ban_reason: banReason, ban_until: banUntil, created_at: createdAt, ...rest } = bannedAddress
    return {
      banReason,
      banUntil,
      createdAt,
      ...rest,
    }
  },
  toBannedAddresses: (bannedAddresses: CKB_RPC.BannedAddresses): CKBComponents.BannedAddresses => {
    if (!bannedAddresses) return bannedAddresses
    return bannedAddresses.map(banAddr => formatter.toBannedAddress(banAddr))
  },
  toCellbaseOutputCapacityDetails: (
    details: CKB_RPC.CellbaseOutputCapacityDetails
  ): CKBComponents.CellbaseOutputCapacityDetails => {
    if (!details) return details
    const { proposal_reward: proposalReward, tx_fee: txFee, ...rest } = details
    return {
      proposalReward,
      txFee,
      ...rest,
    }
  },
}

export default formatter
/* eslint-enable camelcase */
