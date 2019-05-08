/* eslint-disable camelcase */
const formatter = {
  toScript: ({ args, codeHash: code_hash }: CKBComponents.Script): CKB_RPC.Script => ({
    args,
    code_hash,
  }),
  toHash: (hash: string): CKB_RPC.Hash256 => (hash.startsWith('0x') ? hash : `0x${hash}`),
  toOutPoint: ({ txHash: tx_hash, index }: CKBComponents.OutPoint): CKB_RPC.OutPoint => ({
    tx_hash: formatter.toHash(tx_hash),
    index,
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
  toRawTransaction: ({ version, deps, inputs, outputs }: CKBComponents.RawTransaction): CKB_RPC.RawTransaction => {
    const formattedInputs = inputs.map(input => formatter.toInput(input))
    const formattedOutputs = outputs.map(output => formatter.toOutput(output))
    const formattedDeps = deps.map(dep => formatter.toOutPoint(dep))
    const tx = {
      version,
      deps: formattedDeps,
      inputs: formattedInputs,
      outputs: formattedOutputs,
    }
    return tx
  },
}
export default formatter
/* eslint-enable camelcase */
