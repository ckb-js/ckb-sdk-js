import * as util from 'util'
import crypto from './crypto'

export * from './address'
export * from './serialization'

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

export const scriptToHash = ({ codeHash = '', args = [], hashType = 'data' }: CKBComponents.Script) => {
  const s = blake2b(32, null, null, PERSONAL)
  if (codeHash) {
    s.update(hexToBytes(codeHash.replace(/^0x/, '')))
  }

  if (hashType === 'data') {
    s.update(Buffer.from([0x0]))
  } else {
    s.update(Buffer.from([0x1]))
  }

  if (args && args.length) {
    args.forEach(arg => (typeof arg === 'string' ? s.update(hexToBytes(arg)) : s.update(arg)))
  }

  const digest = s.digest('hex')
  return digest as string
}

export const toHexInLittleEndian = (int: number, paddingBytes: number = 4) =>
  (+int)
    .toString(16)
    .replace(/^(.(..)*)$/, '0$1')
    .padEnd(paddingBytes * 2, '0')
