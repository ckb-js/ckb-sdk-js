/// <reference types="../types/blake2b-wasm" />

import * as util from 'util'
import ECPair from './ecpair'
import { pubkeyToAddress, AddressOptions } from './address'
import { HexStringShouldStartWith0x, ArgumentRequired, InvalidHexString } from './exceptions'
import crypto from './crypto'
import { serializeScript } from './serialization/script'
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction'

export * from './address'
export * from './serialization'
export { serializeScript, serializeRawTransaction, serializeTransaction, serializeWitnessArgs }

declare const TextDecoder: any // will be removed when Node@11 becomes LTS
declare const TextEncoder: any // will be removed when Node@11 becomes LTS
export const { blake2b, bech32, blake160 } = crypto
const textEncoder = new (typeof TextEncoder !== 'undefined' ? TextEncoder : util.TextEncoder)()
const textDecoder = new (typeof TextDecoder !== 'undefined' ? TextDecoder : util.TextDecoder)()
export const PERSONAL = textEncoder.encode('ckb-default-hash')

export const hexToBytes = (rawhex: string | number) => {
  if (rawhex === '') return new Uint8Array()
  if (typeof rawhex === 'string' && !rawhex.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(rawhex)
  }
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
  return `0x${hex.join('')}`
}

export const bytesToUtf8 = (bytes: Uint8Array) => textDecoder.decode(bytes)

export const hexToUtf8 = (hex: string) => bytesToUtf8(hexToBytes(hex))

export const utf8ToBytes = (str: string) => textEncoder.encode(str)

export const utf8ToHex = (str: string) => bytesToHex(utf8ToBytes(str))

export const scriptToHash = (script: CKBComponents.Script) => {
  if (!script) throw new ArgumentRequired('Script')
  const serializedScript = serializeScript(script)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedScript))
  const digest = s.digest('hex')
  return `0x${digest}` as string
}

export const rawTransactionToHash = (rawTransaction: Omit<CKBComponents.RawTransaction, 'witnesses'>) => {
  if (!rawTransaction) throw new ArgumentRequired('Raw transaction')
  const serializedRawTransaction = serializeRawTransaction(rawTransaction)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedRawTransaction))
  const digest = s.digest('hex')
  return `0x${digest}` as string
}

const reverseString = (str: string) =>
  str
    .split('')
    .reverse()
    .join('')

export const toHexInLittleEndian = (int: number | string, paddingBytes: number = 4) => {
  if (Number.isNaN(+int)) {
    throw new InvalidHexString(`${int}`)
  }
  if (typeof int === 'string' && !int.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(int)
  }
  const hex = BigInt(int).toString(16)
  const reversedHex = reverseString(hex)
  const frags = reversedHex.match(/\w{1,2}/g) || []
  const hexInLittleEndian = frags
    .map(frag => reverseString(frag.padEnd(2, '0')))
    .join('')
    .padEnd(paddingBytes * 2, '0')
  return `0x${hexInLittleEndian}`
}

export const privateKeyToPublicKey = (privateKey: string) => {
  const keyPair = new ECPair(privateKey)
  return keyPair.publicKey
}

export const privateKeyToAddress = (privateKey: string, options: AddressOptions) =>
  pubkeyToAddress(privateKeyToPublicKey(privateKey), options)

/**
 * @function calculateTransactionFee
 * @description calculate the transaction fee by transaction size and fee rate
 * @param {bigint} transactionSize, the bytes of transaction
 * @param {bigint} feeRate, the fee rate with unit of shannons/KB
 */
export const calculateTransactionFee = (transactionSize: bigint, feeRate: bigint) => {
  const ratio = BigInt(1000)
  const base = transactionSize * feeRate
  const fee = base / ratio
  if (fee * ratio < base) {
    return fee + BigInt(1)
  }
  return fee
}

export const calculateSerializedTxSizeInBlock = (transaction: Omit<CKBComponents.Transaction, 'hash'>) => {
  const EXTRA_SIZE_IN_BLOCK = 4
  const serializedTransaction = serializeTransaction(transaction)
  return serializedTransaction.slice(2).length / 2 + EXTRA_SIZE_IN_BLOCK
}

export const parseEpoch = (epoch: CKBComponents.EpochInHeader) => ({
  length: `0x${((BigInt(epoch) >> BigInt(40)) & BigInt(0xffff)).toString(16)}`,
  index: `0x${((BigInt(epoch) >> BigInt(24)) & BigInt(0xffff)).toString(16)}`,
  number: `0x${(BigInt(epoch) & BigInt(0xffffff)).toString(16)}`,
})
