import { TextEncoder, TextDecoder } from 'util'
import crypto from './crypto'

export * from './address'

export const { blake2b, bech32, blake160 } = crypto

const isBrowser = typeof window !== 'undefined'
const textEncoder = isBrowser ? new window.TextEncoder() : new TextEncoder()
const textDecoder = isBrowser ? new window.TextDecoder() : new TextDecoder()

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

export const lockScriptToHash = ({ codeHash, args }: { codeHash?: string; args?: (Uint8Array | string)[] }) => {
  const s = blake2b(32, null, null, PERSONAL)
  if (codeHash) {
    s.update(hexToBytes(codeHash.replace(/^0x/, '')))
  }
  if (args && args.length) {
    args.forEach(arg => (typeof arg === 'string' ? s.update(hexToBytes(arg)) : s.update(arg)))
  }

  const digest = s.digest('hex')
  return digest as string
}
