import { serializeWitnessArgs, serializeTransaction } from './serialization/transaction'

export enum Size {
  SerializeOffset = 4,
  Base = 72,
  CellDep = 37,
  HeaderDep = 32,
  Input = 44,
}

export const getTransactionSize = (transaction: CKBComponents.RawTransaction) => {
  const tx = {
    ...transaction,
    witnesses: transaction.witnesses.map(wit => (typeof wit === 'string' ? wit : serializeWitnessArgs(wit))),
  }
  const EXTRA_SIZE_IN_BLOCK = 4
  const serializedTransaction = serializeTransaction(tx)
  return serializedTransaction.slice(2).length / 2 + EXTRA_SIZE_IN_BLOCK
}

export default { getTransactionSize }
