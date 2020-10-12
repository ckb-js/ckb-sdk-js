import { scriptToHash, JSBI, systemScripts } from '@nervosnetwork/ckb-sdk-utils'
import { EMPTY_WITNESS_ARGS } from '@nervosnetwork/ckb-sdk-utils/lib/const'
import { assertToBeHexStringOrBigint } from '@nervosnetwork/ckb-sdk-utils/lib/validators'

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const MIN_CELL_CAPACITY = `0x${(61_00_000_000).toString(16)}`

export const getBigInts = ({ fee, capacityThreshold, changeThreshold }: { [key: string]: string | bigint }) => {
  assertToBeHexStringOrBigint(fee!)
  assertToBeHexStringOrBigint(capacityThreshold!)
  assertToBeHexStringOrBigint(changeThreshold!)
  return {
    targetFee: JSBI.BigInt(`${fee}`),
    minCapacity: JSBI.BigInt(`${capacityThreshold}`),
    minChange: JSBI.BigInt(`${changeThreshold}`),
    zeroBigInt: JSBI.BigInt(0),
  }
}

export const getKeyAndCellsPairs = (
  params:
    | Pick<RawTransactionParams.Simple, 'inputScript' | 'outputScript' | 'capacity' | 'cells'>
    | Pick<RawTransactionParams.Complex, 'inputScripts' | 'outputs' | 'cells'>,
) => {
  const inputScripts = 'inputScript' in params ? [params.inputScript] : params.inputScripts
  const outputs: RawTransactionParams.Output[] =
    'outputScript' in params ? [{ lock: params.outputScript, capacity: params.capacity }] : params.outputs

  let unspentCellsMap = new Map<RawTransactionParams.LockHash, RawTransactionParams.Cell[]>()

  if ('inputScript' in params) {
    const lockHash = scriptToHash(params.inputScript)
    unspentCellsMap.set(lockHash, params.cells || [])
  } else {
    unspentCellsMap = params.cells || new Map()
  }
  return { inputScripts, outputs, unspentCellsMap }
}

export const getTargetOutputs = ({
  outputs,
  minCapacity,
}: {
  outputs: ReturnType<typeof getKeyAndCellsPairs>['outputs']
  minCapacity: JSBI
}) => {
  return outputs.map(output => {
    const capacity = JSBI.BigInt(`${output.capacity}`)
    if (JSBI.lessThan(capacity, minCapacity)) {
      throw new Error(`Capacity should be at least ${minCapacity} shannon`)
    }
    return { ...output, capacity }
  })
}

export const getInputs = ({
  inputScripts,
  safeMode,
  costCapacity,
  unspentCellsMap,
}: {
  inputScripts: CKBComponents.Script[]
  unspentCellsMap: ReturnType<typeof getKeyAndCellsPairs>['unspentCellsMap']
  safeMode: boolean
  costCapacity: JSBI
}) => {
  const inputs: Array<CKBComponents.CellInput & { lockhash: string }> = []

  let sum = JSBI.BigInt(0)
  for (let i = 0; i < inputScripts.length; i++) {
    const lockhash = scriptToHash(inputScripts[i])
    const unspentCells = unspentCellsMap.get(lockhash) || []

    for (let j = 0; j < unspentCells.length; j++) {
      const c = unspentCells[j]

      if (!safeMode || (c.dataHash === EMPTY_DATA_HASH && !c.type)) {
        inputs.push({ previousOutput: c.outPoint, since: '0x0', lockhash })
        sum = JSBI.add(sum, JSBI.BigInt(c.capacity))
        if (JSBI.greaterThanOrEqual(sum, costCapacity)) {
          break
        }
      }
    }

    if (JSBI.greaterThan(sum, costCapacity)) {
      break
    }
  }

  if (JSBI.lessThan(sum, costCapacity)) {
    throw new Error('Input capacity is not enough')
  }
  return { inputs, sum }
}

export const getLeftCells = ({
  usedCells,
  inputScripts,
  unspentCellsMap,
}: {
  inputScripts: CKBComponents.Script[]
  usedCells: CKBComponents.CellInput[]
  unspentCellsMap: ReturnType<typeof getKeyAndCellsPairs>['unspentCellsMap']
}): Array<{ capacity: string; outPoint: CKBComponents.OutPoint }> => {
  const leftCells: Array<{ capacity: string; outPoint: CKBComponents.OutPoint }> = []

  const isCellUsed = (cell: Pick<CachedCell, 'outPoint'>) =>
    usedCells.some(
      used =>
        used.previousOutput?.txHash === cell.outPoint?.txHash && used.previousOutput?.index === cell.outPoint?.index,
    )

  inputScripts.forEach(script => {
    const lockhash = scriptToHash(script)
    const cells = unspentCellsMap.get(lockhash)
    if (cells?.length) {
      cells.forEach(cell => {
        if (cell.dataHash === EMPTY_DATA_HASH && !cell.type && !isCellUsed(cell)) {
          leftCells.push({
            outPoint: cell.outPoint!,
            capacity: cell.capacity,
          })
        }
      })
    }
  })

  return leftCells
}

const isFee = (fee: RawTransactionParams.Fee): fee is RawTransactionParams.Capacity => typeof fee !== 'object'

const generateRawTransaction = ({
  fee = '0x0',
  changePublicKeyHash,
  safeMode = true,
  deps,
  capacityThreshold = MIN_CELL_CAPACITY,
  changeThreshold = MIN_CELL_CAPACITY,
  ...params
}: RawTransactionParams.Simple | RawTransactionParams.Complex): CKBComponents.RawTransactionToSign => {
  if (!deps) {
    throw new Error('The dep is not loaded')
  }

  const { targetFee, minCapacity, minChange, zeroBigInt } = getBigInts({
    fee: isFee(fee) ? fee : '0x0',
    capacityThreshold,
    changeThreshold,
  })
  const { inputScripts, outputs: toOutputs, unspentCellsMap } = getKeyAndCellsPairs(params)
  const targetOutputs = getTargetOutputs({ outputs: toOutputs, minCapacity })
  const targetCapacity = targetOutputs.reduce((acc, o) => JSBI.add(acc, o.capacity), zeroBigInt)
  const costCapacity = JSBI.add(JSBI.add(targetCapacity, targetFee), minChange)
  const changeOutput = {
    capacity: zeroBigInt,
    lock: {
      codeHash: systemScripts.SECP256K1_BLAKE160.codeHash,
      hashType: systemScripts.SECP256K1_BLAKE160.hashType,
      args: changePublicKeyHash || inputScripts[0].args,
    },
  }

  const { inputs, sum: inputSum } = getInputs({ inputScripts, safeMode, costCapacity, unspentCellsMap })

  if (JSBI.greaterThan(inputSum, JSBI.add(targetCapacity, targetFee))) {
    changeOutput.capacity = JSBI.subtract(JSBI.subtract(inputSum, targetCapacity), targetFee)
  }

  const outputs = targetOutputs.map(o => ({ ...o, capacity: `0x${o.capacity.toString(16)}` }))

  if (JSBI.greaterThan(changeOutput.capacity, zeroBigInt)) {
    outputs.push({ ...changeOutput, capacity: `0x${changeOutput.capacity.toString(16)}` })
  }

  const cellDeps = Array.isArray(deps) ? deps : [deps]

  const witnesses = params.witnesses ?? []
  inputs.forEach((input, idx) => {
    if (!witnesses[idx]) {
      witnesses[idx] = input.lockhash !== inputs[idx - 1]?.lockhash ? EMPTY_WITNESS_ARGS : '0x'
    }
  })

  const outputsData = params.outputsData ?? []
  outputs.forEach((_, idx) => {
    if (!outputsData[idx]) {
      outputsData[idx] = '0x'
    }
  })

  const tx = {
    version: '0x0',
    cellDeps: cellDeps.map(dep => ({ outPoint: dep.outPoint, depType: dep.depType })),
    headerDeps: [],
    inputs: inputs.map(({ previousOutput, since }) => ({ previousOutput, since })),
    outputs,
    witnesses,
    outputsData,
  }

  if (!isFee(fee)) {
    const leftCells = getLeftCells({ inputScripts, usedCells: tx.inputs, unspentCellsMap })
    return fee.reconciler({ tx, feeRate: fee.feeRate, changeThreshold, cells: leftCells, extraCount: 10 })
  }
  return tx
}

export default generateRawTransaction
