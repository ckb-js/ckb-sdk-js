import { blake2b, hexToBytes, PERSONAL, toHexInLittleEndian, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'

type Key = string
type TransactionHash = string

const signWitnessGroup = (sk: Key, transactionHash: TransactionHash, witnessGroup: StructuredWitness[]) => {
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

  const serializedEmptyWitnessBytes = hexToBytes(serializeWitnessArgs(emptyWitness))
  const serialziedEmptyWitnessSize = serializedEmptyWitnessBytes.length

  const s = blake2b(32, null, null, PERSONAL)
  s.update(hexToBytes(transactionHash))
  s.update(hexToBytes(toHexInLittleEndian(serialziedEmptyWitnessSize, 8)))
  s.update(serializedEmptyWitnessBytes)

  witnessGroup.slice(1).forEach(w => {
    const bytes = hexToBytes(typeof w === 'string' ? w : serializeWitnessArgs(w))
    s.update(hexToBytes(toHexInLittleEndian(bytes.length, 8)))
    s.update(bytes)
  })

  const message = `0x${s.digest('hex')}`
  const keyPair = new ECPair(sk)
  emptyWitness.lock = keyPair.signRecoverable(message)
  return [serializeWitnessArgs(emptyWitness), ...witnessGroup.slice(1)]
}

export default signWitnessGroup
