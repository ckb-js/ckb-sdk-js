import { assertToBeHexStringOrBigint } from '../validators'

/**
 * Converts an uint16 into a hex string in little endian
 *
 * @memberof convertors
 * @param {string|bigint} uint16 The uint16 to convert
 * @returns {string} Returns a hex string
 */
export const toUint16Le = (uint16: string | bigint) => {
  assertToBeHexStringOrBigint(uint16)
  const dv = new DataView(new ArrayBuffer(2))
  dv.setUint16(0, Number(uint16), true)
  return `0x${dv.getUint16(0, false).toString(16).padStart(4, '0')}`
}

/**
 * Converts an uint32 into a hex string in little endian
 *
 * @memberof convertors
 * @param {string|bigint} uint32 The uint32 to convert
 * @returns {string} Returns a hex string
 */
export const toUint32Le = (uint32: string | bigint) => {
  assertToBeHexStringOrBigint(uint32)
  const dv = new DataView(new ArrayBuffer(4))
  dv.setUint32(0, Number(uint32), true)
  return `0x${dv.getUint32(0, false).toString(16).padStart(8, '0')}`
}

/**
 * Converts an uint64 into a hex string in little endian
 *
 * @memberof convertors
 * @param {string|bigint} uint64 The uint64 to convert
 * @returns {string} Returns a hex string
 */
export const toUint64Le = (uint64: string | bigint) => {
  assertToBeHexStringOrBigint(uint64)
  const val = (typeof uint64 === 'bigint' ? uint64.toString(16) : uint64.slice(2)).padStart(16, '0')
  const viewRight = toUint32Le(`0x${val.slice(0, 8)}`).slice(2)
  const viewLeft = toUint32Le(`0x${val.slice(8)}`).slice(2)
  return `0x${viewLeft}${viewRight}`
}

export default { toUint16Le, toUint32Le, toUint64Le }
