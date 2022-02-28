import JSBI from 'jsbi'
import ECPair from './ecpair'
import { hexToBytes } from './convertors'
import { pubkeyToAddress, AddressOptions } from './address'
import { ParameterRequiredException } from './exceptions'
import crypto from './crypto'
import { serializeOutput, serializeScript } from './serialization';
import { serializeRawTransaction, serializeTransaction, serializeWitnessArgs } from './serialization/transaction'
import { PERSONAL } from './const'

export * from './address'
export * from './serialization'
export * from './convertors'
export * from './epochs'
export * from './sizes'
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

export const calculateMaximumWithdraw = (
  depositCell: CKBComponents.CellOutput,
  depositAr: string,
  withdrawAr: string
) => {
    const depositCellSerialized = serializeOutput(depositCell).slice(2).length / 2;
    console.log(depositCellSerialized);
    const occupiedCapacity = JSBI.asUintN(
      64,
      JSBI.multiply(JSBI.BigInt(100000000), JSBI.BigInt(depositCellSerialized))
    );
    return JSBI.add(
      JSBI.divide(
        JSBI.multiply(
          JSBI.subtract(
            JSBI.asUintN(64, JSBI.BigInt(depositCell.capacity)),
            occupiedCapacity
          ),
          JSBI.asUintN(64, JSBI.BigInt(withdrawAr))
        ),
        JSBI.asUintN(64, JSBI.BigInt(depositAr))
      ),
      occupiedCapacity
    ).toString()
}