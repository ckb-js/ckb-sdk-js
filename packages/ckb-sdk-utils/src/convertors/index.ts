import { assertToBeHexStringOrBigint, assertToBeHexString } from '../validators'
import { HexStringWithout0xException } from '../exceptions'

/**
 * Converts an uint16 into a hex string in little endian
 *
 * @deprecated please migrate to [@ckb-lumos/codec/Uint16LE]{@link  https://lumos-website.vercel.app/api/modules/codec.html#uint16le-2}
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
 * @deprecated please migrate to [@ckb-lumos/codec/Uint32LE]{@link  https://lumos-website.vercel.app/api/modules/codec.html#uint32le-2}
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
 * @deprecated please migrate to [@ckb-lumos/codec/Uint64LE]{@link  https://lumos-website.vercel.app/api/modules/codec.html#uint64le-2}
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

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/hexToByteArray]{@link https://lumos-website.vercel.app/api/modules/helpers.html#hextobytearray}
 */
export const hexToBytes = (rawhex: string | number | bigint) => {
  if (rawhex === '') return new Uint8Array()
  if (typeof rawhex === 'string' && !rawhex.startsWith('0x')) {
    throw new HexStringWithout0xException(rawhex)
  }

  let hex = rawhex.toString(16).replace(/^0x/i, '')
  hex = hex.length % 2 ? `0${hex}` : hex

  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }

  return new Uint8Array(bytes)
}

/**
 * Converts a hex string in little endian into big endian
 *
 * @memberof convertors
 * @param {string} le16 The hex string to convert
 * @returns {string} Returns a big endian
 */
 export const toBigEndian = (leHex: string) => {
  assertToBeHexString(leHex)
  const bytes = hexToBytes(leHex);
  return `0x${bytes.reduceRight((pre, cur) => pre + cur.toString(16).padStart(2, '0'), '')}`
}

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/byteArrayToHex]{@link https://lumos-website.vercel.app/api/modules/helpers.html#bytearraytohex}
 */
export const bytesToHex = (bytes: Uint8Array): string =>
  `0x${[...bytes].map(b => b.toString(16).padStart(2, '0')).join('')}`

export default {
  toUint16Le,
  toUint32Le,
  toUint64Le,
  hexToBytes,
  bytesToHex,
  toBigEndian
}
