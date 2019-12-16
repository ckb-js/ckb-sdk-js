import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { assertToBeHexStringOrBigint } from '@nervosnetwork/ckb-sdk-utils/lib/validators'
import { JSBI } from '@nervosnetwork/ckb-sdk-utils'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'

const getMinBigInt = (x: JSBI, y: JSBI) => {
  return JSBI.greaterThan(x, y) ? y : x
}

const loadCells = async ({
  lockHash,
  start = '0x0',
  end,
  STEP = '0x64',
  rpc,
}: {
  lockHash: string
  start?: string | bigint
  end?: string | bigint
  STEP?: string | bigint
  rpc: RPC
}) => {
  console.warn(`This method is only for demo, don't use it in production`)
  if (!lockHash) {
    throw new ArgumentRequired('lockHash')
  }
  if (!rpc) {
    throw new ArgumentRequired('RPC object')
  }
  assertToBeHexStringOrBigint(start)

  if (end !== undefined) {
    assertToBeHexStringOrBigint(end)
  }

  const from = JSBI.BigInt(`${start}`)
  const tipBlockNumber = await rpc.getTipBlockNumber().then(n => JSBI.BigInt(n))

  let to = end === undefined ? tipBlockNumber : getMinBigInt(JSBI.BigInt(`${end}`), tipBlockNumber)

  to = getMinBigInt(to, tipBlockNumber)

  if (JSBI.lessThan(to, from)) {
    throw new Error(`start(${start}) should not be less than end(${to})`)
  }

  const range = JSBI.subtract(to, from)

  /* eslint-disable indent */
  const groups = JSBI.greaterThan(range, JSBI.BigInt(0))
    ? Array.from({ length: Math.ceil(JSBI.toNumber(range) / Number(STEP)) }, (_, idx) => [
        JSBI.add(
          JSBI.add(from, JSBI.multiply(JSBI.BigInt(idx), JSBI.BigInt(`${STEP}`))),
          idx ? JSBI.BigInt(1) : JSBI.BigInt(0),
        ),
        getMinBigInt(JSBI.add(from, JSBI.multiply(JSBI.BigInt(idx + 1), JSBI.BigInt(`${STEP}`))), to),
      ])
    : [[from, to]]
  /* eslint-enabler indent */

  const cells: CachedCell[] = []

  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < groups.length; i++) {
    const cellDigestsInRange = await rpc.getCellsByLockHash(
      lockHash,
      `0x${groups[i][0].toString(16)}`,
      `0x${groups[i][1].toString(16)}`,
    )
    const cellDetailInRange = await Promise.all(
      cellDigestsInRange.map(cellDigest => rpc!.getLiveCell(cellDigest.outPoint!, true)),
    )
    cells.push(
      ...cellDigestsInRange
        .map((digest, idx) => ({
          ...digest,
          dataHash: cellDetailInRange[idx].cell.data!.hash,
          status: cellDetailInRange[idx].status,
          type: cellDetailInRange[idx].cell.output.type,
        }))
        .filter(cell => cell.status === 'live'),
    )
  }
  /* eslint-enable no-await-in-loop */

  return cells
}
export default loadCells
