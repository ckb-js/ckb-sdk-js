import JSBI from 'jsbi'
import ECPair from './ecpair'
import { hexToBytes } from './convertors'
import { pubkeyToAddress, AddressOptions } from './address'
import { assertToBeHexStringOrBigint } from './validators'
import { ParameterRequiredException } from './exceptions'
import crypto from './crypto'
import { serializeScript } from './serialization/script'
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction'
import { PERSONAL } from './const'

export * from './address'
export * from './serialization'
export * from './convertors'

export { serializeScript, serializeRawTransaction, serializeTransaction, serializeWitnessArgs, JSBI, PERSONAL }
export const { blake2b, bech32, blake160 } = crypto

export const scriptToHash = (script: CKBComponents.Script) => {
  if (!script) throw new ParameterRequiredException('Script')
  const serializedScript = serializeScript(script)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedScript))
  const digest = s.digest('hex')
  return `0x${digest}` as string
}

export const rawTransactionToHash = (rawTransaction: Omit<CKBComponents.RawTransaction, 'witnesses'>) => {
  if (!rawTransaction) throw new ParameterRequiredException('Raw transaction')
  const serializedRawTransaction = serializeRawTransaction(rawTransaction)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedRawTransaction))
  const digest = s.digest('hex')
  return `0x${digest}` as string
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
