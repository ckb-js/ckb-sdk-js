import { JSBI } from '@nervosnetwork/ckb-sdk-utils'

interface EpochInfo {
  index: string
  length: string
  number: string
}

export const calculateLockEpochs = ({
  withdrawEpoch,
  depositEpoch,
  DAO_LOCK_PERIOD_EPOCHS,
}: {
  withdrawEpoch: EpochInfo
  depositEpoch: EpochInfo
  DAO_LOCK_PERIOD_EPOCHS: number
}) => {
  const withdrawFraction = JSBI.multiply(JSBI.BigInt(withdrawEpoch.index), JSBI.BigInt(depositEpoch.length))
  const depositFraction = JSBI.multiply(JSBI.BigInt(depositEpoch.index), JSBI.BigInt(withdrawEpoch.length))
  let depositedEpochs = JSBI.subtract(JSBI.BigInt(withdrawEpoch.number), JSBI.BigInt(depositEpoch.number))
  if (JSBI.greaterThan(withdrawFraction, depositFraction)) {
    depositedEpochs = JSBI.add(depositedEpochs, JSBI.BigInt(1))
  }
  /* eslint-disable indent */
  const lockEpochs = JSBI.lessThan(depositedEpochs, JSBI.BigInt(DAO_LOCK_PERIOD_EPOCHS))
    ? JSBI.BigInt(DAO_LOCK_PERIOD_EPOCHS)
    : JSBI.multiply(
        JSBI.divide(
          JSBI.add(depositedEpochs, JSBI.BigInt(DAO_LOCK_PERIOD_EPOCHS - 1)),
          JSBI.BigInt(DAO_LOCK_PERIOD_EPOCHS),
        ),
        JSBI.BigInt(DAO_LOCK_PERIOD_EPOCHS),
      )
  /* eslint-enable indent */
  return lockEpochs
}
export default { calculateLockEpochs }
