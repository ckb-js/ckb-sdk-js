import { blake2b, hexToBytes, PERSONAL, toUint64Le, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { serializeMultisigConfig, MultisigConfig } from './multisig'

export type SignatureProvider = string | ((message: string | Uint8Array) => string)
type TransactionHash = string

function signWitnessGroup(
  sk: SignatureProvider,
  transactionHash: TransactionHash,
  witnessGroup: StructuredWitness[],
  multisigConfig?: MultisigConfig
): StructuredWitness[]
function signWitnessGroup(
  sk: (message: string | Uint8Array, witness: StructuredWitness[]) => Promise<string>,
  transactionHash: TransactionHash,
  witnessGroup: StructuredWitness[],
  multisigConfig?: MultisigConfig
): Promise<StructuredWitness[]>

function signWitnessGroup(
  sk: SignatureProvider | ((message: string | Uint8Array, witness: StructuredWitness[]) => Promise<string>),
  transactionHash: TransactionHash,
  witnessGroup: StructuredWitness[],
  multisigConfig?: MultisigConfig
) {
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
    emptyWitness.lock = `${serializeMultisigConfig(multisigConfig)}${'0'.repeat(130 * multisigConfig.m)}`
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
    return [multisigConfig ? emptyWitness : serializeWitnessArgs(emptyWitness), ...witnessGroup.slice(1)]
  } else {
    const skResult = sk(message, [emptyWitness, ...witnessGroup.slice(1)])
    if (typeof skResult === 'string') {
      emptyWitness.lock = skResult
      return [multisigConfig ? emptyWitness : serializeWitnessArgs(emptyWitness), ...witnessGroup.slice(1)]
    }
    return skResult.then(res => {
      emptyWitness.lock = res
      return [multisigConfig ? emptyWitness : serializeWitnessArgs(emptyWitness), ...witnessGroup.slice(1)]
    })
  }
}

export default signWitnessGroup
