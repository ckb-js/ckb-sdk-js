import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import signWitnessGroup from './signWitnessGroup'
import groupScripts from './groupScripts'

type SignatureProvider = string | ((message: string | Uint8Array) => string)
type LockHash = string
type TransactionHash = string
type CachedLock = Pick<CachedCell, 'lock'>

export interface SignWitnesses {
  (key: SignatureProvider): (params: {
    transactionHash: TransactionHash
    witnesses: StructuredWitness[]
  }) => StructuredWitness[]
  (key: Map<LockHash, SignatureProvider>): (params: {
    transactionHash: TransactionHash
    witnesses: StructuredWitness[]
    inputCells: CachedLock[]
    skipMissingKeys: boolean
  }) => StructuredWitness[]
  (key: SignatureProvider | Map<LockHash, SignatureProvider>): (params: {
    transactionHash: TransactionHash
    witnesses: StructuredWitness[]
    inputCells?: CachedLock[]
    skipMissingKeys?: boolean
  }) => StructuredWitness[]
}

export const isMap = <K = any, V = any>(val: any): val is Map<K, V> => {
  return val.size !== undefined
}

const signWitnesses: SignWitnesses = (key: SignatureProvider | Map<LockHash, SignatureProvider>) => ({
  transactionHash,
  witnesses = [],
  inputCells = [],
  skipMissingKeys = false,
}: {
  transactionHash: string
  witnesses: StructuredWitness[]
  inputCells: CachedLock[]
  skipMissingKeys: boolean
}) => {
  if (!key) throw new ArgumentRequired('Signature provider')
  if (!transactionHash) throw new ArgumentRequired('Transaction hash')
  if (!witnesses.length) throw new Error('Witnesses is empty')

  if (isMap(key)) {
    const rawWitnesses = witnesses
    const restWitnesses = witnesses.slice(inputCells.length)
    const groupedScripts = groupScripts(inputCells)

    groupedScripts.forEach((indices, lockhash) => {
      const sk = key.get(lockhash)
      if (!sk) {
        if (!skipMissingKeys) {
          throw new Error(`The signature provider to sign lockhash ${lockhash} is not found`)
        } else {
          return
        }
      }

      const ws = [...indices.map((idx) => witnesses[idx]), ...restWitnesses]

      const witnessIncludeSignature = signWitnessGroup(sk, transactionHash, ws)[0]
      rawWitnesses[indices[0]] = witnessIncludeSignature
    })
    return rawWitnesses
  }

  const signedWitnesses = signWitnessGroup(key, transactionHash, witnesses)
  return signedWitnesses
}

export default signWitnesses
