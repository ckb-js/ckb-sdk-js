import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { HexStringShouldStartWith0x, ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'

const getMinBigInt = (x: bigint, y: bigint) => (x > y ? y : x)

const loadCells = async ({
  lockHash,
  start = BigInt(0),
  end,
  STEP = BigInt(100),
  rpc,
}: {
  lockHash: string
  start?: string | bigint
  end?: string | bigint
  STEP?: bigint
  rpc: RPC
}) => {
  if (!lockHash) {
    throw new ArgumentRequired('lockHash')
  }
  if (!rpc) {
    throw new ArgumentRequired('RPC object')
  }
  if (typeof start === 'string' && !start.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(start)
  }

  if (typeof end === 'string' && !end.startsWith('0x')) {
    throw new HexStringShouldStartWith0x(end)
  }

  const from = BigInt(start)
  const tipBlockNumber = await rpc.getTipBlockNumber()

  let to = end === undefined ? BigInt(tipBlockNumber) : getMinBigInt(BigInt(end), BigInt(tipBlockNumber))

  to = getMinBigInt(to, BigInt(tipBlockNumber))

  if (to < from) {
    throw new Error(`start(${start}) should not be less than end(${end})`)
  }

  const range = to - from

  const groups = range
    ? Array.from({ length: Math.ceil(Number(range) / Number(STEP)) }, (_, idx) => [
      from + BigInt(idx) * STEP + (idx ? BigInt(1) : BigInt(0)),
      getMinBigInt(from + BigInt(idx + 1) * STEP, to),
    ])
    : [[from, to]]

  const cells: CachedCell[] = []

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < groups.length; i++) {
    const cellDigestsInRange = await rpc.getCellsByLockHash(lockHash, groups[i][0], groups[i][1])
    const cellDetailInRange = await Promise.all(
      cellDigestsInRange.map(cellDigest => rpc!.getLiveCell(cellDigest.outPoint!, true))
    )
    cells.push(
      ...cellDigestsInRange
        .map((digest, idx) => ({
          ...digest,
          dataHash: cellDetailInRange[idx].cell.data!.hash,
          status: cellDetailInRange[idx].status,
          type: cellDetailInRange[idx].cell.output.type,
        }))
        .filter(cell => cell.status === 'live')
    )
  }
  /* eslint-enable no-await-in-loop */

  return cells
}
export default loadCells
