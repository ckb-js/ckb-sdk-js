import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'

type Cell = Pick<CachedCell, 'lock'>
export const groupScripts = (inputCells: Cell[]) => {
  const groups = new Map<string, number[]>()
  inputCells.forEach((cell, i) => {
    const lockhash = scriptToHash(cell.lock)
    const group = groups.get(lockhash) || []
    groups.set(lockhash, [...group, i])
  })
  return groups
}

export default groupScripts
