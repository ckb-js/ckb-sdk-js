import JSBI from 'jsbi'
import { assertToBeHexString } from './validators'

export interface EpochInfo {
  length: string
  index: string
  number: string
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html#generateabsoluteepochsince @ckb-lumos/base/since.generateAbsoluteEpochSince} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeepoch example}
 */
export const serializeEpoch = ({ length, index, number }: EpochInfo): string => {
  assertToBeHexString(length)
  assertToBeHexString(index)
  assertToBeHexString(number)

  const epochSince = JSBI.add(
    JSBI.add(
      JSBI.add(
        JSBI.leftShift(JSBI.BigInt(0x20), JSBI.BigInt(56)),
        JSBI.leftShift(JSBI.BigInt(length), JSBI.BigInt(40)),
      ),
      JSBI.leftShift(JSBI.BigInt(index), JSBI.BigInt(24)),
    ),
    JSBI.BigInt(number),
  )

  return `0x${epochSince.toString(16)}`
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html#parseepoch @ckb-lumos/base/since.parseEpoch} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#parseepoch example}
 */
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

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/common_scripts.html#calculatedaoearliestsince @ckb-lumos/lumos/commons.dao.calculateDaoEarliestSince} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#getwithdrawepoch example}
 * @memberof Utils
 * @function getWithdrawEpoch
 * @description Calculate the minimum epoch to withdraw the deposit by deposit epoch and withdrawing epoch
 * @param {string} depositEpoch Epoch when deposit happens
 * @param {string} withdrawingEpoch Epoch when withdrawing happens
 */
export const getWithdrawEpoch = (depositEpoch: string, withdrawingEpoch: string) => {
  const EPOCHS_PER_WITHDRAW_CYCLE = 180
  const depositEpochInfo = parseEpoch(depositEpoch)
  const withdrawingEpochInfo = parseEpoch(withdrawingEpoch)

  let depositedEpochCount = +withdrawingEpochInfo.number - +depositEpochInfo.number

  if (+withdrawingEpochInfo.index * +depositEpochInfo.length > +depositEpochInfo.index * +withdrawingEpochInfo.length) {
    depositedEpochCount += 1
  }

  const minEpockCountToLock =
    depositedEpochCount <= EPOCHS_PER_WITHDRAW_CYCLE
      ? EPOCHS_PER_WITHDRAW_CYCLE
      : (Math.floor((depositedEpochCount - 1) / EPOCHS_PER_WITHDRAW_CYCLE) + 1) * EPOCHS_PER_WITHDRAW_CYCLE

  return serializeEpoch({
    index: depositEpochInfo.index,
    length: depositEpochInfo.length,
    number: `0x${(+depositEpochInfo.number + minEpockCountToLock).toString(16)}`,
  })
}

export default {
  serializeEpoch,
  parseEpoch,
  getWithdrawEpoch,
}
