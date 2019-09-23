import { blake2b, PERSONAL, hexToBytes } from '@nervosnetwork/ckb-sdk-utils'

const signWitnesses = ({
  transactionHash,
  witnesses = [],
  signRecoverable,
}: {
  transactionHash: string
  witnesses: CKBComponents.Witness[]
  signRecoverable: Function
}) => {
  const signedWitnesses = witnesses.map(witness => {
    const oldData = witness.data || []
    const s = blake2b(32, null, null, PERSONAL)
    s.update(hexToBytes(transactionHash))
    oldData.forEach(datum => {
      s.update(hexToBytes(datum))
    })
    const message = `0x${s.digest('hex')}`
    const data = [signRecoverable(message), ...oldData]
    return {
      data,
    }
  })
  return signedWitnesses
}

export default signWitnesses
