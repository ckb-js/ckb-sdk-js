import { JSBI } from '@nervosnetwork/ckb-sdk-utils'
import { assertToBeHexString } from '@nervosnetwork/ckb-sdk-utils/lib/validators'

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

export const absoluteEpochSince = ({
  length,
  index,
  number,
}: {
  length: string
  index: string
  number: string
}): string => {
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

export const filterCellsByInputs = (
  cells: Pick<CachedCell, 'outPoint' | 'lock'>[],
  inputs: Pick<CKBComponents.CellInput, 'previousOutput'>[],
) => {
  return inputs.map(input => {
    const outPoint = input.previousOutput
    const cell = cells.find(c => c.outPoint?.txHash === outPoint?.txHash && c.outPoint?.index === outPoint?.index)
    if (!cell) {
      throw new Error(`Cell of ${JSON.stringify(outPoint)} is not found`)
    }
    return cell
  })
}

export default { calculateLockEpochs, absoluteEpochSince, filterCellsByInputs }
