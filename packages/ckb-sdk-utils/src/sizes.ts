import { serializeWitnessArgs, serializeTransaction } from './serialization/transaction'

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/common_scripts.html#gettransactionsize @ckb-lumos/common-script/common.getTransactionSize} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#gettransactionsize example}
 * @name getTransactionSize
 * @description return the size of a transaction cost in a block, 4 bytes more than the serialized transaction.
 * @param {Object} transaction - Raw transaction
 * @returns {String} Virtual size of a transaction in a block
 */
export const getTransactionSize = (transaction: CKBComponents.RawTransactionToSign) => {
  const tx = {
    ...transaction,
    witnesses: transaction.witnesses.map(wit => (typeof wit === 'string' ? wit : serializeWitnessArgs(wit))),
  }
  // extra 4 bytes size due to the cost of serialized tx in a block
  const VIRTUAL_COST = 4
  const serializedTransaction = serializeTransaction(tx)
  return serializedTransaction.slice(2).length / 2 + VIRTUAL_COST
}

export default { getTransactionSize }
