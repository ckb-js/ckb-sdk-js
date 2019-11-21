import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'

import signWitnessGroup from './signWitnessGroup'
import groupInputs from './groupInputs'

type Key = string | ECPair

type CachedLock = Pick<CachedCell, 'lock'>

export interface SignWitnesses {
  (key: Key): (params: { transactionHash: string; witnesses: StructuredWitness[] }) => StructuredWitness[]
  (key: Map<string, Key>): (params: {
    transactionHash: string
    witnesses: StructuredWitness[]
    inputCells: CachedLock[]
  }) => StructuredWitness[]
  (key: Key | Map<string, Key>): (params: {
    transactionHash: string
    witnesses: StructuredWitness[]
    inputCells?: CachedLock[]
  }) => StructuredWitness[]
}

export const isMap = (val: any): val is Map<any, any> => {
  return val.size !== undefined
}

const signWitnesses: SignWitnesses = (key: Key | Map<string, Key>) => ({
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

  if (isMap(key)) {
    const rawWitnesses = witnesses
    const restWitnesses = witnesses.slice(inputCells.length)
    const groupedInputs = groupInputs(inputCells)
    groupedInputs.forEach((indices, lockhash) => {
      const sk = key.get(lockhash)
      if (!sk) {
        throw new Error(`The private key to sign lockhash ${lockhash} is not found`)
      }
      const ws = [...indices.map(idx => witnesses[idx]), ...restWitnesses]

      const witnessIncludeSignature = signWitnessGroup(
        typeof sk === 'string' ? new ECPair(sk) : sk,
        transactionHash,
        ws,
      )[0]
      rawWitnesses[indices[0]] = witnessIncludeSignature
    })
    return rawWitnesses
  }

  const keyPair = typeof key === 'string' ? new ECPair(key) : key
  const signedWitnesses = signWitnessGroup(keyPair, transactionHash, witnesses)
  return signedWitnesses
}

export default signWitnesses
