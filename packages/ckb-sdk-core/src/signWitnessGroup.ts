import { blake2b, hexToBytes, PERSONAL, toUint64Le, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { serizeMultisigConfig, MultisigConfig } from './multisig'

export type SignatureProvider = string
  | ((message: string | Uint8Array, witness: StructuredWitness[]) => string)
  | ((message: string | Uint8Array, witness: StructuredWitness[]) => Promise<string>)
  type TransactionHash = string

const signWitnessGroup = async (
  sk: SignatureProvider,
  transactionHash: TransactionHash,
  witnessGroup: StructuredWitness[],
  multisigConfig?: MultisigConfig
) => {
  if (!witnessGroup.length) {
    throw new Error('WitnessGroup cannot be empty')
  }
  if (typeof witnessGroup[0] !== 'object') {
    throw new Error('The first witness in the group should be type of WitnessArgs')
  }

  const emptyWitness = {
    ...witnessGroup[0],
    lock: `0x${'0'.repeat(130)}`,
  }
  if (multisigConfig) {
    emptyWitness.lock = `${serizeMultisigConfig(multisigConfig)}${'0'.repeat(130 * multisigConfig.m)}`
  }

  const serializedEmptyWitnessBytes = hexToBytes(serializeWitnessArgs(emptyWitness))
  const serializedEmptyWitnessSize = serializedEmptyWitnessBytes.length

  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(transactionHash))
  s.update(hexToBytes(toUint64Le(`0x${serializedEmptyWitnessSize.toString(16)}`)))
  s.update(serializedEmptyWitnessBytes)

  witnessGroup.slice(1).forEach(w => {
    const bytes = hexToBytes(typeof w === 'string' ? w : serializeWitnessArgs(w))
    s.update(hexToBytes(toUint64Le(`0x${bytes.length.toString(16)}`)))
    s.update(bytes)
  })

  const message = `0x${s.digest('hex')}`
  if (typeof sk === 'string') {
    const keyPair = new ECPair(sk)
    emptyWitness.lock = keyPair.signRecoverable(message)
  } else {
    emptyWitness.lock = await sk(message, [emptyWitness, ...witnessGroup.slice(1)])
  }
  return [multisigConfig ? emptyWitness : serializeWitnessArgs(emptyWitness), ...witnessGroup.slice(1)]
}

export default signWitnessGroup
