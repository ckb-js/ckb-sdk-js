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
  toRawTransaction: (transaction: CKBComponents.RawTransaction): CKB_RPC.RawTransaction => {
    if (!transaction) return transaction
    const { version, deps, inputs, outputs, ...rest } = transaction
    const formattedInputs = inputs.map(input => formatter.toInput(input))
    const formattedOutputs = outputs.map(output => formatter.toOutput(output))
    const formattedDeps = deps.map(dep => formatter.toOutPoint(dep))
    const tx = {
      version,
      deps: formattedDeps,
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
