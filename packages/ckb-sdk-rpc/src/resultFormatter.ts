/* eslint-disable camelcase */
const formatter = {
  toNumber: (number: RPC.BlockNumber): CKBComponents.BlockNumber => number.toString(),
  toHash: (hash: RPC.Hash256): CKBComponents.Hash256 => hash,
  toHeader: (header: RPC.Header): CKBComponents.BlockHeader => {
    if (!header) return header
    const { compact_target, transactions_root, proposals_hash, uncles_hash, parent_hash, ...rest } = header
    return {
      compactTarget: compact_target,
      parentHash: parent_hash,
      transactionsRoot: transactions_root,
      proposalsHash: proposals_hash,
      unclesHash: uncles_hash,
      ...rest,
    }
  },
  toScript: (script: RPC.Script): CKBComponents.Script => {
    if (!script) return script
    const { code_hash: codeHash, hash_type: hashType, ...rest } = script
    return {
      codeHash,
      hashType,
      ...rest,
    }
  },
  toInput: (input: RPC.CellInput): CKBComponents.CellInput => {
    if (!input) return input
    const { previous_output: previousOutput, ...rest } = input
    return {
      previousOutput: previousOutput ? formatter.toOutPoint(previousOutput) : previousOutput,
      ...rest,
    }
  },
  toOutput: (output: RPC.CellOutput): CKBComponents.CellOutput => {
    if (!output) return output
    const { lock, type, ...rest } = output
    return {
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    }
  },
  toOutPoint: (outPoint: RPC.OutPoint | null): CKBComponents.OutPoint | null => {
    if (!outPoint) return outPoint
    const { tx_hash: txHash, ...rest } = outPoint
    return {
      txHash,
      ...rest,
    }
  },
  toDepType: (type: RPC.DepType) => {
    if (type === 'dep_group') {
      return 'depGroup'
    }
    return type
  },

  toCellDep: (cellDep: RPC.CellDep): CKBComponents.CellDep => {
    if (!cellDep) return cellDep
    const { out_point: outPoint = null, dep_type = 'code', ...rest } = cellDep
    return {
      outPoint: formatter.toOutPoint(outPoint),
      depType: formatter.toDepType(dep_type),
      ...rest,
    }
  },
  toTransaction: (tx: RPC.Transaction): CKBComponents.Transaction => {
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
  toUncleBlock: (uncleBlock: RPC.UncleBlock): CKBComponents.UncleBlock => {
    if (!uncleBlock) return uncleBlock
    const { header, ...rest } = uncleBlock
    return {
      header: formatter.toHeader(header),
      ...rest,
    }
  },

  toBlock: (block: RPC.Block): CKBComponents.Block => {
    if (!block) return block
    const { header, uncles = [], transactions = [], ...rest } = block
    return {
      header: formatter.toHeader(header),
      uncles: uncles.map(formatter.toUncleBlock),
      transactions: transactions.map(formatter.toTransaction),
      ...rest,
    }
  },
  toAlertMessage: (alertMessage: RPC.AlertMessage): CKBComponents.AlertMessage => {
    if (!alertMessage) return alertMessage
    const { notice_until: noticeUntil, ...rest } = alertMessage
    return {
      noticeUntil,
      ...rest,
    }
  },
  toBlockchainInfo: (info: RPC.BlockchainInfo): CKBComponents.BlockchainInfo => {
    if (!info) return info
    const { is_initial_block_download: isInitialBlockDownload, median_time: medianTime, alerts, ...rest } = info
    return {
      isInitialBlockDownload,
      medianTime,
      alerts: alerts.map(formatter.toAlertMessage),
      ...rest,
    }
  },
  toNodeInfo: (info: RPC.NodeInfo): CKBComponents.NodeInfo => {
    if (!info) return info
    const { node_id: nodeId, is_outbound: isOutbound, ...rest } = info
    return {
      nodeId,
      isOutbound,
      ...rest,
    }
  },
  toTxPoolInfo: (info: RPC.TxPoolInfo): CKBComponents.TxPoolInfo => {
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
  toPeers: (nodes: RPC.NodeInfo[]): CKBComponents.NodeInfo[] => {
    if (!Array.isArray(nodes)) return []
    return nodes.map(formatter.toNodeInfo)
  },
  toPeersState: (state: RPC.PeersState): CKBComponents.PeersState => {
    if (!state) return state
    const { last_updated: lastUpdated, blocks_in_flight: blocksInFlight, ...rest } = state
    return {
      lastUpdated,
      blocksInFlight,
      ...rest,
    }
  },
  toCell: (cell: RPC.Cell): CKBComponents.Cell => {
    if (!cell) return cell
    const { lock, type, ...rest } = cell
    return {
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : null,
      ...rest,
    }
  },
  toLiveCell: (liveCell: RPC.LiveCell): CKBComponents.LiveCell => {
    if (!liveCell) return liveCell
    const { data, output, ...rest } = liveCell
    return {
      data,
      output: formatter.toOutput(output),
      ...rest,
    }
  },
  toLiveCellWithStatus: (cellWithStatus: {
    cell: RPC.LiveCell
    status: string
  }): { cell: CKBComponents.LiveCell; status: string } => {
    if (!cellWithStatus) return cellWithStatus
    const { cell, ...rest } = cellWithStatus
    return {
      cell: formatter.toLiveCell(cell),
      ...rest,
    }
  },
  toCells: (cells: RPC.Cell[]): CKBComponents.Cell[] => {
    if (!Array.isArray(cells)) return []
    return cells.map(formatter.toCell)
  },
  toCellIncludingOutPoint: (cell: RPC.CellIncludingOutPoint) => {
    if (!cell) return cell
    const { lock, block_hash: blockHash, out_point, output_data_len: outputDataLen, ...rest } = cell
    return {
      blockHash,
      lock: formatter.toScript(lock),
      outPoint: formatter.toOutPoint(out_point),
      outputDataLen,
      ...rest,
    }
  },
  toCellsIncludingOutPoint: (cells: RPC.CellIncludingOutPoint[]): CKBComponents.CellIncludingOutPoint[] => {
    if (!Array.isArray(cells)) return []
    return cells.map(formatter.toCellIncludingOutPoint)
  },
  toTransactionWithStatus: (txWithStatus: RPC.TransactionWithStatus) => {
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
  toEpoch: (epoch: RPC.Epoch): CKBComponents.Epoch => {
    if (!epoch) return epoch
    const { start_number: startNumber, compact_target: compactTarget, ...rest } = epoch
    return {
      compactTarget,
      startNumber,
      ...rest,
    }
  },
  toTransactionPoint: (transactionPoint: RPC.TransactionPoint): CKBComponents.TransactionPoint => {
    if (!transactionPoint) return transactionPoint
    const { block_number: blockNumber, tx_hash: txHash, ...rest } = transactionPoint
    return {
      blockNumber,
      txHash,
      ...rest,
    }
  },
  toTransactionsByLockHash: (transactions: RPC.TransactionsByLockHash): CKBComponents.TransactionsByLockHash => {
    if (!transactions) return transactions
    return transactions.map(tx => ({
      consumedBy: tx.consumed_by ? formatter.toTransactionPoint(tx.consumed_by) : tx.consumed_by,
      createdBy: formatter.toTransactionPoint(tx.created_by),
    }))
  },
  toLiveCellsByLockHash: (cells: RPC.LiveCellsByLockHash): CKBComponents.LiveCellsByLockHash => {
    if (!cells) return cells
    return cells.map(cell => ({
      cellOutput: formatter.toCell(cell.cell_output),
      createdBy: formatter.toTransactionPoint(cell.created_by),
    }))
  },
  toLockHashIndexState: (index: RPC.LockHashIndexState): CKBComponents.LockHashIndexState => {
    if (!index) return index
    const { block_hash: blockHash, block_number: blockNumber, lock_hash: lockHash, ...rest } = index
    return {
      blockHash,
      blockNumber,
      lockHash,
      ...rest,
    }
  },
  toLockHashIndexStates: (states: RPC.LockHashIndexStates): CKBComponents.LockHashIndexStates => {
    if (!states) return states
    return states.map(formatter.toLockHashIndexState)
  },
  toBannedAddress: (bannedAddress: RPC.BannedAddress): CKBComponents.BannedAddress => {
    if (!bannedAddress) return bannedAddress
    const { ban_reason: banReason, ban_until: banUntil, created_at: createdAt, ...rest } = bannedAddress
    return {
      banReason,
      banUntil,
      createdAt,
      ...rest,
    }
  },
  toBannedAddresses: (bannedAddresses: RPC.BannedAddresses): CKBComponents.BannedAddresses => {
    if (!bannedAddresses) return bannedAddresses
    return bannedAddresses.map(banAddr => formatter.toBannedAddress(banAddr))
  },
  toCellbaseOutputCapacityDetails: (
    details: RPC.CellbaseOutputCapacityDetails,
  ): CKBComponents.CellbaseOutputCapacityDetails => {
    if (!details) return details
    const { proposal_reward: proposalReward, tx_fee: txFee, ...rest } = details
    return {
      proposalReward,
      txFee,
      ...rest,
    }
  },

  toFeeRate: (feeRateObj: RPC.FeeRate): CKBComponents.FeeRate => {
    if (!feeRateObj) {
      return feeRateObj
    }
    const { fee_rate: feeRate, ...rest } = feeRateObj
    return {
      feeRate,
      ...rest,
    }
  },
}

export default formatter
/* eslint-enable camelcase */
