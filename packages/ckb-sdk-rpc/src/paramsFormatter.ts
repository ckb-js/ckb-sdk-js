/* eslint-disable camelcase */
const formatter = {
  toOptional: (format?: Function) => (arg: any) => {
    if (!format || arg === undefined || arg === null) {
      return arg
    }
    return format(arg)
  },
  toHash: (hash: string): CKB_RPC.Hash256 => {
    if (typeof hash !== 'string') {
      throw new TypeError(`Hash ${hash} should be type of string`)
    }
    return hash.startsWith('0x') ? hash : `0x${hash}`
  },
  toNumber: (number: CKBComponents.Number | number): CKB_RPC.Number => {
    if (typeof number === 'number') {
      return `0x${number.toString(16)}`
    }
    if (typeof number !== 'string') {
      throw new TypeError(`The number ${number} should be a number or a hex string`)
    }
    if (!number.startsWith('0x')) {
      throw new Error(`If the number ${number} is a hex string, please prefix it with 0x`)
    }
    return number
  },
  toScript: (script: CKBComponents.Script): CKB_RPC.Script => {
    const { codeHash, hashType: hash_type, ...rest } = script
    return {
      code_hash: formatter.toHash(codeHash),
      hash_type,
      ...rest,
    }
  },
  toOutPoint: (outPoint: CKBComponents.OutPoint | null): CKB_RPC.OutPoint | null => {
    if (!outPoint) return outPoint
    const { txHash, index, ...rest } = outPoint
    return {
      tx_hash: formatter.toHash(txHash),
      index: formatter.toNumber(index),
      ...rest,
    }
  },
  toInput: (input: CKBComponents.CellInput): CKB_RPC.CellInput => {
    if (!input) return input
    const { previousOutput, since, ...rest } = input
    return {
      previous_output: formatter.toOutPoint(previousOutput),
      since: formatter.toNumber(since),
      ...rest,
    }
  },
  toOutput: (output: CKBComponents.CellOutput): CKB_RPC.CellOutput => {
    if (!output) return output
    const { capacity, lock, type = null, ...rest } = output
    return {
      capacity: formatter.toNumber(capacity),
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    }
  },
  toDepType: (type: CKBComponents.DepType) => {
    if (type === 'depGroup') {
      return 'dep_group'
    }
    return type
  },
  toCellDep: (cellDep: CKBComponents.CellDep): CKB_RPC.CellDep => {
    if (!cellDep) return cellDep
    const { outPoint = null, depType = 'code', ...rest } = cellDep
    return {
      out_point: formatter.toOutPoint(outPoint),
      dep_type: formatter.toDepType(depType),
      ...rest,
    }
  },
  toRawTransaction: (transaction: CKBComponents.RawTransaction): CKB_RPC.RawTransaction => {
    if (!transaction) return transaction
    const {
      version,
      cellDeps = [],
      inputs = [],
      outputs = [],
      outputsData: outputs_data = [],
      headerDeps: header_deps = [],
      ...rest
    } = transaction
    const formattedInputs = inputs.map(input => formatter.toInput(input))
    const formattedOutputs = outputs.map(output => formatter.toOutput(output))
    const formattedCellDeps = cellDeps.map(cellDep => formatter.toCellDep(cellDep))
    const tx = {
      version: formatter.toNumber(version),
      cell_deps: formattedCellDeps,
      inputs: formattedInputs,
      outputs: formattedOutputs,
      outputs_data,
      header_deps,
      ...rest,
    }
    return tx
  },
  toPageNumber: (pageNo: string | number = '0x1') => formatter.toNumber(pageNo),
  toPageSize: (pageSize: string | number = 50) => {
    const size = +pageSize || 50
    if (size > 50) throw new Error('Page size is up to 50')
    if (size < 0) throw new Error('Page size is expected to be positive')
    return formatter.toNumber(size)
  },
  toReverseOrder: (reverse: boolean = false) => !!reverse,
}

export default formatter
/* eslint-enable camelcase */
