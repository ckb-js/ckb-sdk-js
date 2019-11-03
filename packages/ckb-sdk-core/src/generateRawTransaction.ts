import { HexStringShouldStartWith0x } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

const generateRawTransaction = async ({
  fromPublicKeyHash,
  fee = BigInt(0),
  safeMode = true,
  cells: unspentCells = [],
  deps,
  outputs,
  outputsData,
}: {
  fromPublicKeyHash: string
  fee?: bigint | string | number
  safeMode: boolean
  cells?: CachedCell[]
  deps: DepCellInfo
  outputs: Output[]
  outputsData: string[]
}) => {
  if (!deps) {
    throw new Error('The deps is not loaded')
  }

  outputsData.forEach(data => {
    if (!data.startsWith('0x')) {
      throw new HexStringShouldStartWith0x(data)
    }
  })

  let targetCapacity = BigInt(0)
  for (let i = 0; i < outputs.length; i++) {
    const currOutput = outputs[i]
    targetCapacity += BigInt(currOutput.capacity)
  }

  const realFee = typeof fee !== 'bigint' ? BigInt(fee) : fee

  const costCapacity = targetCapacity + realFee

  const lockScript = {
    codeHash: deps.codeHash,
    hashType: deps.hashType,
    args: fromPublicKeyHash,
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
  if (inputCapacity > costCapacity) {
    changeOutput.capacity = inputCapacity - costCapacity
  }

  /**
   * compose the raw transaction which has an empty witnesses
   */

  if (changeOutput.capacity > BigInt(0)) {
    outputs.push({ ...changeOutput, capacity: changeOutput.capacity })
    outputsData.push('0x')
  }

  let realOutputs = outputs.slice()
  realOutputs = outputs.map(out => ({ ...out, capacity: `0x${out.capacity.toString(16)}` }))

  const tx = {
    version: '0x0',
    cellDeps: [
      {
        outPoint: deps.outPoint,
        depType: 'depGroup',
      },
    ],
    headerDeps: [],
    inputs,
    outputs: realOutputs,
    witnesses: [],
    outputsData,
  }
  return tx
}

export default generateRawTransaction
