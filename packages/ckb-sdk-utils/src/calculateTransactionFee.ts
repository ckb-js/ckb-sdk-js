import JSBI from 'jsbi'
import { assertToBeHexStringOrBigint } from './validators.js'

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/common_scripts.html#calculatefee-2 @ckb-lumos/common-script/common.calculatefee}
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

export default calculateTransactionFee
