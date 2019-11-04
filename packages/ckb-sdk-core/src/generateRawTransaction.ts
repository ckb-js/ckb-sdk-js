import { HexStringShouldStartWith0x } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

const generateRawTransaction = ({
  fromPublicKeyHash,
  toPublicKeyHash,
  capacity,
  fee = BigInt(0),
  safeMode = true,
  cells: unspentCells = [],
  deps,
  cellCapacityThreshold = BigInt(61_00_000_000),
}: {
  fromPublicKeyHash: string
  toPublicKeyHash: string
  capacity: bigint | string | number
  fee?: bigint | string | number
  safeMode: boolean
  cells?: CachedCell[]
  deps: DepCellInfo
  cellCapacityThreshold?: bigint | string | number
}): CKBComponents.RawTransactionToSign => {
  if (!deps) {
    throw new Error('The deps is not loaded')
  }

  if (typeof capacity === 'string' && !capacity.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(capacity)
  }

  if (typeof cellCapacityThreshold === 'string' && !cellCapacityThreshold.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(cellCapacityThreshold)
  }

  const targetCapacity = BigInt(capacity)
  const realFee = BigInt(fee)
  const threshold = BigInt(cellCapacityThreshold)

  if (targetCapacity < threshold) {
    throw new Error(`Capacity should not be less than ${threshold} shannon`)
  }

  const costCapacity = targetCapacity + realFee + threshold

  const lockScript = {
    codeHash: deps.codeHash,
    hashType: deps.hashType,
    args: fromPublicKeyHash,
  }

  /**
   * the new cell for next owner
   */
  const toOutput = {
    capacity: targetCapacity,
    lock: {
      hashType: deps.hashType,
      codeHash: deps.codeHash,
      args: toPublicKeyHash,
    },
  }

  /**
   * the new cell as a change
   */
  const changeOutput = {
    capacity: BigInt(0),
    lock: lockScript,
  }

  if (!unspentCells.length) {
    throw new Error('No available cells found in the cell map, please make sure the loadCells method is called')
  }
  const inputs = []
  let inputCapacity = BigInt(0)
  /**
   * pick inputs
   */
  for (let i = 0; i < unspentCells.length; i++) {
    const unspentCell = unspentCells[i]
    if (!safeMode || unspentCell.dataHash === EMPTY_DATA_HASH) {
      inputs.push({
        previousOutput: unspentCell.outPoint,
        since: '0x0',
      })
      inputCapacity += BigInt(unspentCells[i].capacity)
      if (inputCapacity >= costCapacity) {
        break
      }
    }
  }
  if (inputCapacity < costCapacity) {
    throw new Error('Input capacity is not enough')
  }
  if (inputCapacity > targetCapacity + realFee) {
    changeOutput.capacity = inputCapacity - targetCapacity - realFee
  }

  /**
   * compose the raw transaction which has an empty witnesses
   */

  const outputs = [{ ...toOutput, capacity: `0x${toOutput.capacity.toString(16)}` }]

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
