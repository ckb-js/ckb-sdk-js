import JSBI from 'jsbi'
import ECPair from './ecpair'
import { hexToBytes, toBigEndian } from './convertors'
import { pubkeyToAddress, AddressOptions } from './address'
import { ParameterRequiredException, HexStringWithout0xException } from './exceptions'
import crypto from './crypto'
import { serializeScript } from './serialization'
import { cellOccupied } from './occupiedCapacity'
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction'
import { PERSONAL } from './const'

export * from './address'
export * from './serialization'
export * from './convertors'
export * from './epochs'
export * from './sizes'
export * from './occupiedCapacity'
export * as systemScripts from './systemScripts'
export * as reconcilers from './reconcilers'

export { serializeScript, serializeRawTransaction, serializeTransaction, serializeWitnessArgs, JSBI, PERSONAL }
export const { blake2b, bech32, bech32m, blake160 } = crypto

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


export const extractDAOData = (dao: CKBComponents.DAO) => {
  if (!dao.startsWith('0x')) {
    throw new HexStringWithout0xException(dao)
  }
  const value = dao.replace('0x', '')
  return {
    c: toBigEndian(`0x${value.slice(0, 16)}`),
    ar: toBigEndian(`0x${value.slice(16, 32)}`),
    s: toBigEndian(`0x${value.slice(32, 48)}`),
    u: toBigEndian(`0x${value.slice(48, 64)}`)
  }
}

export const calculateMaximumWithdraw = (
  outputCell: CKBComponents.CellOutput,
  outputDataCapacity: CKBComponents.Bytes,
  depositDAO: CKBComponents.DAO,
  withdrawDAO: CKBComponents.DAO
) => {
    const depositCellSerialized = cellOccupied(outputCell) + outputDataCapacity.slice(2).length / 2
    const occupiedCapacity = JSBI.asUintN(
      128,
      JSBI.multiply(JSBI.BigInt(100000000), JSBI.BigInt(depositCellSerialized))
    )
    return `0x${JSBI.add(
      JSBI.divide(
        JSBI.multiply(
          JSBI.subtract(
            JSBI.asUintN(128, JSBI.BigInt(outputCell.capacity)),
            occupiedCapacity
          ),
          JSBI.asUintN(128, JSBI.BigInt(extractDAOData(withdrawDAO).ar))
        ),
        JSBI.asUintN(128, JSBI.BigInt(extractDAOData(depositDAO).ar))
      ),
      occupiedCapacity
    ).toString(16)}`
}
