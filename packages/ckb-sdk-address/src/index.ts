import ECPair, { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { hexToBytes, AddressPrefix, AddressType, AddressBinIdx, pubkeyToAddress } from '@nervosnetwork/ckb-sdk-utils'

class Address extends ECPair {
  public value = ''

  public constructor(
    sk: Uint8Array | string,
    {
      compressed = true,
      addressAlgorithm = pubkeyToAddress,
      ...addressOptions
    }: Options &
      Partial<{
        addressAlgorithm: Function
        prefix: AddressPrefix
        type: AddressType
        binIdx: AddressBinIdx
      }>
  ) {
    super(typeof sk === 'string' ? hexToBytes(sk) : sk, {
      compressed,
    })
    this.value = addressAlgorithm(this.publicKey, addressOptions)
  }
}

export default Address
