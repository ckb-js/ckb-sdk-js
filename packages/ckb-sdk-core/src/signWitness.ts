import { blake2b, hexToBytes, bytesToHex, PERSONAL } from '@nervosnetwork/ckb-sdk-utils'
import KeyPair from './keyPair'

export default (keyPair: KeyPair, transactionHash: string, witness: string = '') => {
  const s = blake2b(32, null, null, PERSONAL)
  const witnessBytes = hexToBytes(witness)
  s.update(hexToBytes(transactionHash))
  s.update(witnessBytes)
  const message = `0x${s.digest('hex')}`
  const data = [...hexToBytes(keyPair.signRecoverable(message)), ...witnessBytes]
  return bytesToHex(new Uint8Array(data))
}
