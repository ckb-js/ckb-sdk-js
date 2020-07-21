import { scriptToHash, JSBI } from '@nervosnetwork/ckb-sdk-utils'
import { assertToBeHexStringOrBigint } from '@nervosnetwork/ckb-sdk-utils/lib/validators'

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const MIN_CELL_CAPACITY = `0x${(61_00_000_000).toString(16)}`

type ScriptBase = Omit<CKBComponents.Script, 'args'>

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
    | Pick<RawTransactionParams.Simple, 'fromPublicKeyHash' | 'toPublicKeyHash' | 'capacity' | 'cells'>
    | Pick<RawTransactionParams.Complex, 'receivePairs' | 'fromPublicKeyHashes' | 'cells'>,
  scriptBase: ScriptBase,
) => {
  const fromPkhes = 'fromPublicKeyHash' in params ? [params.fromPublicKeyHash] : params.fromPublicKeyHashes
  const toPkhAndCapacityPairs =
    'toPublicKeyHash' in params
      ? [{ publicKeyHash: params.toPublicKeyHash, capacity: params.capacity }]
      : params.receivePairs

  let unspentCellsMap = new Map<RawTransactionParams.LockHash, RawTransactionParams.Cell[]>()
  if ('fromPublicKeyHash' in params) {
    const lockHash = scriptToHash({ ...scriptBase, args: params.fromPublicKeyHash })
    unspentCellsMap.set(lockHash, params.cells || [])
  } else {
    unspentCellsMap = params.cells || new Map()
  }
  return { fromPkhes, toPkhAndCapacityPairs, unspentCellsMap }
}

export const getTargetOutputs = ({
  toPkhAndCapacityPairs,
  minCapacity,
  scriptBase,
}: {
  toPkhAndCapacityPairs: ReturnType<typeof getKeyAndCellsPairs>['toPkhAndCapacityPairs']
  minCapacity: JSBI
  scriptBase: ScriptBase
}) => {
  return toPkhAndCapacityPairs.map(pkhAndCapacity => {
    const capacity = JSBI.BigInt(`${pkhAndCapacity.capacity}`)
    if (JSBI.lessThan(capacity, minCapacity)) {
      throw new Error(`Capacity should be at least ${minCapacity} shannon`)
    }
    return { capacity, lock: { ...scriptBase, args: pkhAndCapacity.publicKeyHash } }
  })
}

export const getInputs = ({
  fromPkhes,
  scriptBase,
  safeMode,
  costCapacity,
  unspentCellsMap,
}: {
  fromPkhes: ReturnType<typeof getKeyAndCellsPairs>['fromPkhes']
  unspentCellsMap: ReturnType<typeof getKeyAndCellsPairs>['unspentCellsMap']
  scriptBase: ScriptBase
  safeMode: boolean
  costCapacity: JSBI
}) => {
  const inputs: CKBComponents.CellInput[] = []

  let sum = JSBI.BigInt(0)
  for (let i = 0; i < fromPkhes.length; i++) {
    const pkh = fromPkhes[i]
    const lockhash = scriptToHash({ ...scriptBase, args: pkh })
    const unspentCells = unspentCellsMap.get(lockhash) || []

    for (let j = 0; j < unspentCells.length; j++) {
      const c = unspentCells[j]

      if (!safeMode || (c.dataHash === EMPTY_DATA_HASH && !c.type)) {
        inputs.push({ previousOutput: c.outPoint, since: '0x0' })
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

  const scriptBase: Omit<CKBComponents.Script, 'args'> = { codeHash: deps.codeHash, hashType: deps.hashType }
  const { targetFee, minCapacity, minChange, zeroBigInt } = getBigInts({ fee, capacityThreshold, changeThreshold })
  const { fromPkhes, toPkhAndCapacityPairs, unspentCellsMap } = getKeyAndCellsPairs(params, scriptBase)
  const targetOutputs = getTargetOutputs({ toPkhAndCapacityPairs, minCapacity, scriptBase })
  const targetCapacity = targetOutputs.reduce((acc, o) => JSBI.add(acc, o.capacity), zeroBigInt)
  const costCapacity = JSBI.add(JSBI.add(targetCapacity, targetFee), minChange)
  const changeOutput = { capacity: zeroBigInt, lock: { ...scriptBase, args: changePublicKeyHash || fromPkhes[0] } }
  const { inputs, sum: inputSum } = getInputs({ fromPkhes, scriptBase, safeMode, costCapacity, unspentCellsMap })

  if (JSBI.greaterThan(inputSum, JSBI.add(targetCapacity, targetFee))) {
    changeOutput.capacity = JSBI.subtract(JSBI.subtract(inputSum, targetCapacity), targetFee)
  }

  const outputs = targetOutputs.map(o => ({ ...o, capacity: `0x${o.capacity.toString(16)}` }))

  if (JSBI.greaterThan(changeOutput.capacity, zeroBigInt)) {
    outputs.push({ ...changeOutput, capacity: `0x${changeOutput.capacity.toString(16)}` })
  }
  const outputsData = outputs.map(() => '0x')

  const tx = {
    version: '0x0',
    cellDeps: [{ outPoint: deps.outPoint, depType: 'depGroup' as CKBComponents.DepType }],
    headerDeps: [],
    inputs,
    outputs,
    witnesses: [],
    outputsData,
  }
  return tx
}

export default generateRawTransaction
