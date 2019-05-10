/* eslint-disable camelcase */
const formatter = {
  toScript: ({ codeHash: code_hash, ...rest }: CKBComponents.Script): CKB_RPC.Script => ({
    code_hash,
    ...rest,
  }),
  toHash: (hash: string): CKB_RPC.Hash256 => (hash.startsWith('0x') ? hash : `0x${hash}`),
  toCellOutPoint: ({ txHash: tx_hash, ...rest }: CKBComponents.CellOutPoint): CKB_RPC.CellOutPoint => ({
    tx_hash,
    ...rest,
  }),
  toOutPoint: ({ cell = null, blockHash: block_hash = null, ...rest }: CKBComponents.OutPoint): CKB_RPC.OutPoint => ({
    cell: cell ? formatter.toCellOutPoint(cell) : cell,
    block_hash,
    ...rest,
  }),
  toNumber: (number: CKBComponents.BlockNumber): CKB_RPC.BlockNumber => number,
  toInput: ({ previousOutput, ...rest }: CKBComponents.CellInput): CKB_RPC.CellInput => ({
    previous_output: formatter.toOutPoint(previousOutput),
    ...rest,
  }),
  toOutput: ({ lock, type, ...rest }: CKBComponents.CellOutput): CKB_RPC.CellOutput => ({
    lock: formatter.toScript(lock),
    type: type ? formatter.toScript(type) : null,
    ...rest,
  }),
  toRawTransaction: ({
    version,
    deps,
    inputs,
    outputs,
    ...rest
  }: CKBComponents.RawTransaction): CKB_RPC.RawTransaction => {
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
}
export default formatter
/* eslint-enable camelcase */
