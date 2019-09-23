import RPC from '@nervosnetwork/ckb-sdk-rpc'

export interface Cell extends CKBComponents.CellIncludingOutPoint {
  status: string
  dataHash: string
}

const loadCells = async ({
  lockHash,
  start = 0,
  end,
  STEP = 100,
  rpc,
}: {
  lockHash: string
  start?: string | number
  end?: string | number
  STEP?: number
  rpc: RPC
}) => {
  if (!lockHash) {
    throw new Error('lockHash is required to load cells')
  }
  if (!rpc) {
    throw new Error('RPC module is required to load cells')
  }
  const from = +start
  if (!Number.isInteger(from)) {
    throw new Error(`${start} cannot be converted into a integer`)
  }
  const tipBlockNumber = await rpc.getTipBlockNumber()

  let to = end === undefined ? +tipBlockNumber : Math.min(+end, +tipBlockNumber)

  if (!Number.isInteger(to)) {
    throw new Error(`${end} cannot be converted into a integer`)
  }

  to = Math.min(to, +tipBlockNumber)

  if (to < from) {
    throw new Error(`${start} should not be less than ${end}`)
  }

  const groups = Array.from(
    {
      length: Math.ceil((to - from) / STEP),
    },
    (_, idx) => [from + idx * STEP + (idx ? 1 : 0), Math.min(from + (idx + 1) * STEP, to)]
  )

  const cells: Cell[] = []

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
        }))
        .filter(cell => cell.status === 'live')
    )
  }
  /* eslint-enable no-await-in-loop */

  return cells
}
export default loadCells
