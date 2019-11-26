import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { assertToBeHexStringOrBigint } from '@nervosnetwork/ckb-sdk-utils/lib/validators'

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

type LockHash = string
type PublicKeyHash = string
type Capacity = string | bigint
export type Cell = Pick<CachedCell, 'dataHash' | 'type' | 'capacity' | 'outPoint'>

export interface RawTransactionParamsBase {
  fee?: Capacity
  safeMode: boolean
  deps: DepCellInfo
  capacityThreshold?: Capacity
  changeThreshold?: Capacity
  changePublicKeyHash?: PublicKeyHash
}

interface RawTransactionParams extends RawTransactionParamsBase {
  fromPublicKeyHash: PublicKeyHash
  toPublicKeyHash: PublicKeyHash
  capacity: Capacity
  cells?: Cell[]
}

interface ComplexRawTransactionParams extends RawTransactionParamsBase {
  fromPublicKeyHashes: PublicKeyHash[]
  receivePairs: { publicKeyHash: PublicKeyHash; capacity: Capacity }[]
  cells: Map<LockHash, CachedCell[]>
}

const generateRawTransaction = ({
  fee = BigInt(0),
  changePublicKeyHash,
  safeMode = true,
  deps,
  capacityThreshold = BigInt(61_00_000_000),
  changeThreshold = BigInt(61_00_000_000),
  ...params
}: RawTransactionParams | ComplexRawTransactionParams): CKBComponents.RawTransactionToSign => {
  if (!deps) {
    throw new Error('The deps is not loaded')
  }

  const scriptBase: Omit<CKBComponents.Script, 'args'> = {
    codeHash: deps.codeHash,
    hashType: deps.hashType,
  }

  assertToBeHexStringOrBigint(fee)
  assertToBeHexStringOrBigint(capacityThreshold)
  assertToBeHexStringOrBigint(changeThreshold)
  const targetFee = BigInt(fee)
  const minCapacity = BigInt(capacityThreshold)
  const minChange = BigInt(changeThreshold)

  const fromPkhes = 'fromPublicKeyHash' in params ? [params.fromPublicKeyHash] : params.fromPublicKeyHashes
  const toPkhAndCapacityPairs =
    'toPublicKeyHash' in params
      ? [{ publicKeyHash: params.toPublicKeyHash, capacity: params.capacity }]
      : params.receivePairs

  let unspentCellsMap = new Map<LockHash, Cell[]>()
  if ('fromPublicKeyHash' in params) {
    const lockHash = scriptToHash({
      ...scriptBase,
      args: params.fromPublicKeyHash,
    })
    unspentCellsMap.set(lockHash, params.cells || [])
  } else {
    unspentCellsMap = params.cells
  }

  const targetOutputs = toPkhAndCapacityPairs.map(pkhAndCapacity => {
    const capacity = BigInt(pkhAndCapacity.capacity)
    if (capacity < minCapacity) {
      throw new Error(`Capacity should not be less than ${minCapacity} shannon`)
    }
    return {
      capacity,
      lock: {
        ...scriptBase,
        args: pkhAndCapacity.publicKeyHash,
      },
    }
  })

  const changeOutput = {
    capacity: BigInt(0),
    lock: {
      ...scriptBase,
      args: changePublicKeyHash || fromPkhes[0],
    },
  }

  const targetCapacity = targetOutputs.reduce((acc, o) => acc + o.capacity, BigInt(0))
  const costCapacity = targetCapacity + targetFee + minChange
  const inputs: CKBComponents.CellInput[] = []

  let inputCapacity = BigInt(0)
  for (let i = 0; i < fromPkhes.length; i++) {
    const pkh = fromPkhes[i]
    const lockhash = scriptToHash({
      ...scriptBase,
      args: pkh,
    })
    const unspentCells = unspentCellsMap.get(lockhash) || []

    for (let j = 0; j < unspentCells.length; j++) {
      const c = unspentCells[j]

      if (!safeMode || (c.dataHash === EMPTY_DATA_HASH && !c.type)) {
        inputs.push({
          previousOutput: c.outPoint,
          since: '0x0',
        })
        inputCapacity += BigInt(c.capacity)
        if (inputCapacity > costCapacity) {
          break
        }
      }
    }
    if (inputCapacity > costCapacity) {
      break
    }
  }

  if (inputCapacity < costCapacity) {
    throw new Error('Input capacity is not enough')
  }

  if (inputCapacity > targetCapacity + targetFee) {
    changeOutput.capacity = inputCapacity - targetCapacity - targetFee
  }

  const outputs = targetOutputs.map(o => ({ ...o, capacity: `0x${o.capacity.toString(16)}` }))

  if (changeOutput.capacity > BigInt(0)) {
    outputs.push({ ...changeOutput, capacity: `0x${changeOutput.capacity.toString(16)}` })
  }
  const outputsData = outputs.map(() => '0x')

  const tx = {
    version: '0x0',
    cellDeps: [
      {
        outPoint: deps.outPoint,
        depType: 'depGroup' as CKBComponents.DepType,
      },
    ],
    headerDeps: [],
    inputs,
    outputs,
    witnesses: [],
    outputsData,
  }
  return tx
}

export default generateRawTransaction
