/* eslint-disable camelcase */
const formatter = {
  toScript: (script: CKBComponents.Script): CKB_RPC.Script => {
    const { codeHash: code_hash, hashType: hash_type, ...rest } = script
    return {
      code_hash,
      hash_type,
      ...rest,
    }
  },
  toHash: (hash: string): CKB_RPC.Hash256 => (hash.startsWith('0x') ? hash : `0x${hash}`),
  toOutPoint: (outPoint: CKBComponents.OutPoint | null): CKB_RPC.OutPoint | null => {
    if (!outPoint) return outPoint
    const { txHash: tx_hash, ...rest } = outPoint
    return {
      tx_hash,
      ...rest,
    }
  },
  toNumber: (number: CKBComponents.BlockNumber): CKB_RPC.BlockNumber => number.toString(),
  toInput: (input: CKBComponents.CellInput): CKB_RPC.CellInput => {
    if (!input) return input
    const { previousOutput, ...rest } = input
    return {
      previous_output: formatter.toOutPoint(previousOutput),
      ...rest,
    }
  },
  toOutput: (output: CKBComponents.CellOutput): CKB_RPC.CellOutput => {
    if (!output) return output
    const { lock, type = null, ...rest } = output
    return {
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    }
  },
  toCellDep: (cellDep: CKBComponents.CellDep): CKB_RPC.CellDep => {
    if (!cellDep) return cellDep
    const { outPoint = null, isDepGroup: is_dep_group = false, ...rest } = cellDep
    return {
      out_point: formatter.toOutPoint(outPoint),
      is_dep_group,
      ...rest,
    }
  },
  toRawTransaction: (transaction: CKBComponents.RawTransaction): CKB_RPC.RawTransaction => {
    if (!transaction) return transaction
    const { version, cellDeps = [], inputs = [], outputs = [], ...rest } = transaction
    const formattedInputs = inputs.map(input => formatter.toInput(input))
    const formattedOutputs = outputs.map(output => formatter.toOutput(output))
    const formattedCellDeps = cellDeps.map(cellDep => formatter.toCellDep(cellDep))
    const tx = {
      version,
      cell_deps: formattedCellDeps,
      inputs: formattedInputs,
      outputs: formattedOutputs,
      ...rest,
    }
    return tx
  },
  toPageNumber: (pageNo: string | number = '1') => pageNo.toString(),
  toPageSize: (pageSize: string | number = 50) => {
    const size = +pageSize || 50
    if (size > 50) throw new Error('Page size is up to 50')
    if (size < 0) throw new Error('Page size is expected to be positive')
    return `${size}`
  },
  toReverseOrder: (reverse: boolean = false) => !!reverse,
}

export default formatter
/* eslint-enable camelcase */
