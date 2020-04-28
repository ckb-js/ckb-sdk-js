import * as util from 'util'
import JSBI from 'jsbi'
import ECPair from './ecpair'
import { pubkeyToAddress, AddressOptions } from './address'
import { assertToBeHexStringOrBigint } from './validators'
import { HexStringShouldStartWith0x, ArgumentRequired } from './exceptions'
import crypto from './crypto'
import { serializeScript } from './serialization/script'
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction'

export * from './address'
export * from './serialization'
export * from './convertors'
export { serializeScript, serializeRawTransaction, serializeTransaction, serializeWitnessArgs }

declare const TextDecoder: any // should be removed when the type definition of TextDecoder updates
declare const TextEncoder: any // should be removed when the type definition of TextEncoder updates
const textEncoder = new (typeof TextEncoder !== 'undefined' ? TextEncoder : util.TextEncoder)()
const textDecoder = new (typeof TextDecoder !== 'undefined' ? TextDecoder : util.TextDecoder)()
export { JSBI }

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

export const PERSONAL = textEncoder.encode('ckb-default-hash')

export const { blake2b, bech32, blake160 } = crypto

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

const reverseString = (str: string) => str.split('').reverse().join('')

export const toHexInLittleEndian = (int: string | bigint, paddingBytes: number = 4) => {
  assertToBeHexStringOrBigint(int)
  const hex = JSBI.BigInt(`${int}`).toString(16)
  const reversedHex = reverseString(hex)
  const frags = reversedHex.match(/\w{1,2}/g) || []
  const hexInLittleEndian = frags
    .map((frag) => reverseString(frag.padEnd(2, '0')))
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
 * @param {string | bigint} transactionSize, the byte size of transaction
 * @param {string | bigint} feeRate, the fee rate with unit of shannons/KB
 * @returns {string} transactionFee
 */
export const calculateTransactionFee = (transactionSize: string | bigint, feeRate: string | bigint): string => {
  assertToBeHexStringOrBigint(transactionSize)
  assertToBeHexStringOrBigint(feeRate)
  const ratio = JSBI.BigInt(1000)
  const base = JSBI.multiply(JSBI.BigInt(`${transactionSize}`), JSBI.BigInt(`${feeRate}`))
  const fee = JSBI.divide(base, ratio)
  if (JSBI.lessThan(JSBI.multiply(fee, ratio), base)) {
    return `0x${JSBI.add(fee, JSBI.BigInt(1)).toString(16)}`
  }
  return `0x${fee.toString(16)}`
}

export const calculateSerializedTxSizeInBlock = (transaction: Omit<CKBComponents.Transaction, 'hash'>) => {
  const EXTRA_SIZE_IN_BLOCK = 4
  const serializedTransaction = serializeTransaction(transaction)
  return serializedTransaction.slice(2).length / 2 + EXTRA_SIZE_IN_BLOCK
}

export const parseEpoch = (epoch: CKBComponents.EpochInHeader) => ({
  length: `0x${JSBI.bitwiseAnd(
    JSBI.signedRightShift(JSBI.BigInt(epoch), JSBI.BigInt(40)),
    JSBI.BigInt(0xffff),
  ).toString(16)}`,
  index: `0x${JSBI.bitwiseAnd(JSBI.signedRightShift(JSBI.BigInt(epoch), JSBI.BigInt(24)), JSBI.BigInt(0xffff)).toString(
    16,
  )}`,
  number: `0x${JSBI.bitwiseAnd(JSBI.BigInt(epoch), JSBI.BigInt(0xffffff)).toString(16)}`,
})
