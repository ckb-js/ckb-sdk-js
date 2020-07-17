/**
 * Encoded string 'ckb-default-hash'
 *
 * @constant
 * @type {bytes}
 */
export const PERSONAL = new Uint8Array([99, 107, 98, 45, 100, 101, 102, 97, 117, 108, 116, 45, 104, 97, 115, 104])

export const EMPTY_WITNESS_ARGS: CKBComponents.WitnessArgs = {
  lock: '',
  inputType: '',
  outputType: '',
}

export const EMPTY_SECP_SIG = `0x${'0'.repeat(130)}`

export default {
  PERSONAL,
  EMPTY_WITNESS_ARGS,
  EMPTY_SECP_SIG,
}
