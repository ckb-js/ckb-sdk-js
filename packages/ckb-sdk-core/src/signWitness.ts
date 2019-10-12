import { blake2b, hexToBytes, bytesToHex, PERSONAL } from '@nervosnetwork/ckb-sdk-utils'
import Address from './address'

export default (addrObj: Address, transactionHash: string, witness: string = '') => {
  const s = blake2b(32, null, null, PERSONAL)
  const witnessBytes = hexToBytes(witness)
  s.update(hexToBytes(transactionHash))
  s.update(witnessBytes)
  const message = `0x${s.digest('hex')}`
  const data = [...hexToBytes(addrObj.signRecoverable(message)), ...witnessBytes]
  return bytesToHex(new Uint8Array(data))
}
