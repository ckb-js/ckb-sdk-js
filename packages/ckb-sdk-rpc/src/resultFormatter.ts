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
    const { code_hash: codeHash, ...rest } = script
    return {
      codeHash,
      ...rest,
    }
  },
  toInput: (input: CKB_RPC.CellInput): CKBComponents.CellInput => {
    if (!input) return input
    const { previous_output: previousOutput, ...rest } = input
    return {
      previousOutput: formatter.toOutPoint(previousOutput),
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
  toCellOutPoint: (cellOutPoint: CKB_RPC.CellOutPoint): CKBComponents.CellOutPoint => {
    if (!cellOutPoint) return cellOutPoint
    const { tx_hash: txHash, ...rest } = cellOutPoint
    return {
      txHash,
      ...rest,
    }
  },
  toOutPoint: (outPoint: CKB_RPC.OutPoint): CKBComponents.OutPoint => {
    if (!outPoint) return outPoint
    const { block_hash: blockHash = null, cell = null } = outPoint
    return {
      blockHash,
      cell: cell ? formatter.toCellOutPoint(cell) : cell,
    }
  },
  toTransaction: (tx: CKB_RPC.Transaction): CKBComponents.Transaction => {
    if (!tx) return tx
    const { deps = [], inputs = [], outputs = [], ...rest } = tx
    return {
      deps: deps.map(formatter.toOutPoint),
      inputs: inputs.map(formatter.toInput),
      outputs: outputs.map(formatter.toOutput),
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
  toBlockchainInfo: (info: CKB_RPC.BlockchainInfo): CKBComponents.BlockchainInfo => {
    if (!info) return info
    const { is_initial_block_download: isInitialBlockDownload, median_time: medianTime, ...rest } = info
    return {
      isInitialBlockDownload,
      medianTime,
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
  toPeers: (nodes: CKB_RPC.NodeInfo[] = []): CKBComponents.NodeInfo[] => nodes.map(formatter.toNodeInfo),
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
  toCells: (cells: CKB_RPC.Cell[] = []): CKBComponents.Cell[] => cells.map(formatter.toCell),
  toCellIncludingOutPoint: (cell: CKB_RPC.CellIncludingOutPoint) => {
    if (!cell) return cell
    const { lock, out_point, ...rest } = cell
    return {
      lock: formatter.toScript(lock),
      outPoint: formatter.toOutPoint(out_point),
      ...rest,
    }
  },
  toCellsIncludingOutPoint: (cells: CKB_RPC.CellIncludingOutPoint[] = []): CKBComponents.CellIncludingOutPoint[] =>
    cells.map(formatter.toCellIncludingOutPoint),
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
    const {
      block_reward: blockReward,
      last_block_hash_in_previous_epoch: lastBlockHashInPreviousEpoch,
      remainder_reward: remainderReward,
      start_number: startNumber,
      ...rest
    } = epoch
    return {
      blockReward,
      lastBlockHashInPreviousEpoch,
      remainderReward,
      startNumber,
      ...rest,
    }
  },
}
export default formatter
/* eslint-enable camelcase */
