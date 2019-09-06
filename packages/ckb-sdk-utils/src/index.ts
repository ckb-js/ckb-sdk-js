import * as util from 'util'
import crypto from './crypto'
import { serializeScript } from './serialization/script'
import { serializeRawTransaction } from './serialization/transaction'

export * from './address'
export * from './serialization'
export { serializeScript } from './serialization/script'
export { serializeRawTransaction } from './serialization/transaction'

declare const TextDecoder: any // will be removed when Node@11 becomes LTS
declare const TextEncoder: any // will be removed when Node@11 becomes LTS
export const { blake2b, bech32, blake160 } = crypto
const textEncoder = new (typeof TextEncoder !== 'undefined' ? TextEncoder : util.TextEncoder)()
const textDecoder = new (typeof TextDecoder !== 'undefined' ? TextDecoder : util.TextDecoder)()
export const PERSONAL = textEncoder.encode('ckb-default-hash')

export const hexToBytes = (rawhex: any) => {
  let hex = rawhex.toString(16)

  hex = hex.replace(/^0x/i, '')
  hex = hex.length % 2 ? `0${hex}` : hex

  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }

  return new Uint8Array(bytes)
}

export const bytesToHex = (bytes: Uint8Array): string => {
  const hex = []
  /* eslint-disabled */
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xf).toString(16))
  }
  /* eslint-enabled */
  return hex.join('')
}

export const bytesToUtf8 = (bytes: Uint8Array) => textDecoder.decode(bytes)

export const hexToUtf8 = (hex: string) => bytesToUtf8(hexToBytes(hex))

export const utf8ToBytes = (str: string) => textEncoder.encode(str)

export const utf8ToHex = (str: string) => bytesToHex(utf8ToBytes(str))

export const scriptToHash = (script: CKBComponents.Script) => {
  if (!script) throw new Error('Script is required')
  const serializedScript = serializeScript(script)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedScript))
  const digest = s.digest('hex')
  return digest as string
}

export const rawTransactionToHash = (rawTransaction: CKBComponents.RawTransaction) => {
  if (!rawTransaction) throw new Error('Raw transaction is required')
  const serializedRawTransaction = serializeRawTransaction(rawTransaction)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedRawTransaction))
  const digest = s.digest('hex')
  return digest as string
}

export const transactionToHash = (rawTransaction: CKBComponents.RawTransaction) => {
  const serializedScript = serializeRawTransaction(rawTransaction)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedScript))
  const digest = s.digest('hex')
  return digest as string
}

const reverseString = (str: string) =>
  str
    .split('')
    .reverse()
    .join('')
export const toHexInLittleEndian = (int: number | string, paddingBytes: number = 4) => {
  if (Number.isNaN(+int)) {
    throw new TypeError('The input cannot be converted to a number')
  }
  const hex = (+int).toString(16)
  const reversedHex = reverseString(hex)
  const frags = reversedHex.match(/\w{1,2}/g) || []
  return frags
    .map(frag => reverseString(frag.padEnd(2, '0')))
    .join('')
    .padEnd(paddingBytes * 2, '0')
}
