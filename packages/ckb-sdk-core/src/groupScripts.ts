import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'

type LockHash = string
type Index = number
type Cell = { lock: CKBComponents.Script }

export const groupScripts = (inputCells: Cell[]) => {
  const groups = new Map<LockHash, Index[]>()
  inputCells.forEach((cell, i) => {
    const lockhash = scriptToHash(cell.lock)
    const group = groups.get(lockhash) || []
    groups.set(lockhash, [...group, i])
  })
  return groups
}

export default groupScripts
