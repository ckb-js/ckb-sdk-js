import JSBI from 'jsbi'
import { getTransactionSize } from '../sizes'
import { ReconciliationException } from '../exceptions'

declare namespace Reconciliation {
  type Cell = { capacity: string; outPoint: CKBComponents.OutPoint }
  interface ExtraInputsParams {
    tx: CKBComponents.RawTransactionToSign
    feeRate: string | bigint
    changeThreshold: string | bigint
    cells: Array<Cell>
    extraCount: number
  }
}

export const extraInputs = (params: Reconciliation.ExtraInputsParams): any => {
  const feeRate = JSBI.BigInt(`${params.feeRate}`)
  const changeThreshold = JSBI.BigInt(`${params.changeThreshold}`)

  const size = JSBI.BigInt(getTransactionSize(params.tx))
  const currentChangeOutput = params.tx.outputs[params.tx.outputs.length - 1]
  const currentChange = JSBI.BigInt(currentChangeOutput.capacity)

  const fee = JSBI.divide(JSBI.multiply(size, feeRate), JSBI.BigInt(1000))
  const lack = JSBI.subtract(JSBI.add(fee, changeThreshold), currentChange)

  if (JSBI.LE(lack, JSBI.BigInt(0))) {
    return {
      ...params.tx,
      outputs: [
        ...params.tx.outputs.slice(0, -1),
        {
          ...currentChangeOutput,
          capacity: `0x${JSBI.subtract(currentChange, fee).toString(16)}`,
        },
      ],
    }
  }

  params.cells.sort((c1, c2) => +JSBI.subtract(JSBI.BigInt(c1.capacity), JSBI.BigInt(c2.capacity)))

  const SIZE_PER_INPUT = JSBI.BigInt(44)
  const FEE_PER_INPUT = JSBI.divide(JSBI.multiply(SIZE_PER_INPUT, feeRate), JSBI.BigInt(1000))

  for (let i = 1; i <= Math.min(params.extraCount, params.cells.length); i++) {
    const extraCost = JSBI.multiply(JSBI.BigInt(i), FEE_PER_INPUT)
    const totalLack = JSBI.add(lack, extraCost)
    const extraCapacity = params.cells
      .slice(0, i)
      .reduce((sum, c) => JSBI.add(sum, JSBI.BigInt(c.capacity)), JSBI.BigInt(0))
    if (JSBI.GE(extraCapacity, totalLack)) {
      const inputs = [
        ...params.tx.inputs,
        ...params.cells.slice(0, i).map(c => ({
          previousOutput: c.outPoint,
          since: '0x0',
        })),
      ]
      const change = JSBI.add(changeThreshold, JSBI.subtract(extraCapacity, totalLack))
      const changeOutput = { ...currentChangeOutput, capacity: `0x${change.toString(16)}` }
      const outputs = [...params.tx.outputs.slice(0, -1), changeOutput]
      const tx: CKBComponents.RawTransactionToSign = { ...params.tx, inputs, outputs }
      return tx
    }
  }
  throw new ReconciliationException()
}

export default extraInputs
