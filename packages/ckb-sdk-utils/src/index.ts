import JSBI from 'jsbi'
import ECPair from './ecpair.js'
import { hexToBytes, toBigEndian } from './convertors/index.js'
import { pubkeyToAddress, AddressOptions } from './address/index.js'
import { ParameterRequiredException, HexStringWithout0xException } from './exceptions/index.js'
import crypto from './crypto/index.js'
import { serializeScript } from './serialization/index.js'
import { cellOccupied } from './occupiedCapacity.js'
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction.js'
import { PERSONAL } from './const.js'

export * from './address/index.js'
export * from './serialization/index.js'
export * from './convertors/index.js'
export * from './exceptions/index.js'
export * from './const.js'
export * from './validators.js'
export * from './epochs.js'
export * from './sizes.js'
export * from './occupiedCapacity.js'
export { ECPair }
export * as systemScripts from './systemScripts.js'
export * as reconcilers from './reconcilers/index.js'

export { serializeScript, serializeRawTransaction, serializeTransaction, serializeWitnessArgs, JSBI, PERSONAL }
export const { blake2b, bech32, bech32m, blake160 } = crypto

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/lumos.html#utils @ckb-lumos/lumos/utils} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#scripttohash example}
 */
export const scriptToHash = (script: CKBComponents.Script) => {
  if (!script) throw new ParameterRequiredException('Script')
  const serializedScript = serializeScript(script)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedScript))
  const digest = s.digest('hex')
  return `0x${digest}` as string
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/lumos.html#utils @ckb-lumos/lumos/utils} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#rawtransactiontohash example}
 */
export const rawTransactionToHash = (rawTransaction: Omit<CKBComponents.RawTransaction, 'witnesses'>) => {
  if (!rawTransaction) throw new ParameterRequiredException('Raw transaction')
  const serializedRawTransaction = serializeRawTransaction(rawTransaction)
  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(serializedRawTransaction))
  const digest = s.digest('hex')
  return `0x${digest}` as string
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/hd.html#privatekeytoblake160 @ckb-lumos/hd} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#privatekeytopublickey example}
 */
export const privateKeyToPublicKey = (privateKey: string) => {
  const keyPair = new ECPair(privateKey)
  return keyPair.publicKey
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/hd.html#privatekeytoblake160 @ckb-lumos/hd} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#privatekeytoaddress example}
 */
export const privateKeyToAddress = (privateKey: string, options: AddressOptions) =>
  pubkeyToAddress(privateKeyToPublicKey(privateKey), options)

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/common_scripts.html @ckb-lumos/common-scripts/lib/dao} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#extractdaodata example}
 */
export const extractDAOData = (dao: CKBComponents.DAO) => {
  if (!dao.startsWith('0x')) {
    throw new HexStringWithout0xException(dao)
  }
  const value = dao.replace('0x', '')
  return {
    c: toBigEndian(`0x${value.slice(0, 16)}`),
    ar: toBigEndian(`0x${value.slice(16, 32)}`),
    s: toBigEndian(`0x${value.slice(32, 48)}`),
    u: toBigEndian(`0x${value.slice(48, 64)}`),
  }
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/common_scripts.html @ckb-lumos/lumos/commons} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#calculatemaximumwithdraw example}
 */
export const calculateMaximumWithdraw = (
  outputCell: CKBComponents.CellOutput,
  outputDataCapacity: CKBComponents.Bytes,
  depositDAO: CKBComponents.DAO,
  withdrawDAO: CKBComponents.DAO,
) => {
  const depositCellSerialized = cellOccupied(outputCell) + outputDataCapacity.slice(2).length / 2
  const occupiedCapacity = JSBI.asUintN(128, JSBI.multiply(JSBI.BigInt(100000000), JSBI.BigInt(depositCellSerialized)))
  return `0x${JSBI.add(
    JSBI.divide(
      JSBI.multiply(
        JSBI.subtract(JSBI.asUintN(128, JSBI.BigInt(outputCell.capacity)), occupiedCapacity),
        JSBI.asUintN(128, JSBI.BigInt(extractDAOData(withdrawDAO).ar)),
      ),
      JSBI.asUintN(128, JSBI.BigInt(extractDAOData(depositDAO).ar)),
    ),
    occupiedCapacity,
  ).toString(16)}`
}
