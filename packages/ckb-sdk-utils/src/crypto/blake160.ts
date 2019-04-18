import blake2b from 'blake2b-wasm'
import { PERSONAL, hexToBytes } from '../index'

export const blake160 = (data: Uint8Array | string, encode: 'binary' | 'hex' = 'binary') => {
  const formattedData = typeof data === 'string' ? hexToBytes(data) : data
  const s = blake2b(32, null, null, PERSONAL)
  s.update(formattedData)
  return s.digest(encode).slice(0, encode === 'binary' ? 20 : 40)
}

export default blake160
