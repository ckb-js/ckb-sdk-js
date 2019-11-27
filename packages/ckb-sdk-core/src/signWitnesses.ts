import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import signWitnessGroup from './signWitnessGroup'
import groupScripts from './groupScripts'

type Key = string
type LockHash = string
type TransactionHash = string
type CachedLock = Pick<CachedCell, 'lock'>

export interface SignWitnesses {
  (key: Key): (params: { transactionHash: TransactionHash; witnesses: StructuredWitness[] }) => StructuredWitness[]
  (key: Map<LockHash, Key>): (params: {
    transactionHash: TransactionHash
    witnesses: StructuredWitness[]
    inputCells: CachedLock[]
  }) => StructuredWitness[]
  (key: Key | Map<LockHash, Key>): (params: {
    transactionHash: TransactionHash
    witnesses: StructuredWitness[]
    inputCells?: CachedLock[]
  }) => StructuredWitness[]
}

export const isMap = <K = any, V = any>(val: any): val is Map<K, V> => {
  return val.size !== undefined
}

const signWitnesses: SignWitnesses = (key: Key | Map<LockHash, Key>) => ({
  transactionHash,
  witnesses = [],
  inputCells = [],
}: {
  transactionHash: string
  witnesses: StructuredWitness[]
  inputCells: CachedLock[]
}) => {
  if (!key) throw new ArgumentRequired('Private key')
  if (!transactionHash) throw new ArgumentRequired('Transaction hash')
  if (!witnesses.length) throw new Error('Witnesses is empty')

  if (isMap(key)) {
    const rawWitnesses = witnesses
    const restWitnesses = witnesses.slice(inputCells.length)
    const groupedScripts = groupScripts(inputCells)
    groupedScripts.forEach((indices, lockhash) => {
      const sk = key.get(lockhash)
      if (!sk) {
        throw new Error(`The private key to sign lockhash ${lockhash} is not found`)
      }
      const ws = [...indices.map(idx => witnesses[idx]), ...restWitnesses]

      const witnessIncludeSignature = signWitnessGroup(sk, transactionHash, ws)[0]
      rawWitnesses[indices[0]] = witnessIncludeSignature
    })
    return rawWitnesses
  }

  const signedWitnesses = signWitnessGroup(key, transactionHash, witnesses)
  return signedWitnesses
}

export default signWitnesses
