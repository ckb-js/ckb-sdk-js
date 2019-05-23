import ECPair, { Options } from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { hexToBytes, AddressPrefix, AddressType, AddressBinIdx, pubkeyToAddress } from '@nervosnetwork/ckb-sdk-utils'

class Address extends ECPair {
  public value = ''

  public constructor(
    sk: Uint8Array | string,
    {
      addressAlgorithm = pubkeyToAddress,
      prefix = AddressPrefix.Testnet,
      type = AddressType.BinIdx,
      binIdx = AddressBinIdx.P2PH,
    }: Options &
      Partial<{
        addressAlgorithm: Function
        prefix: AddressPrefix
        type: AddressType
        binIdx: AddressBinIdx
      }> = {
      addressAlgorithm: pubkeyToAddress,
      prefix: AddressPrefix.Testnet,
      type: AddressType.BinIdx,
      binIdx: AddressBinIdx.P2PH,
    }
  ) {
    super(typeof sk === 'string' ? hexToBytes(sk) : sk)
    this.value = addressAlgorithm(this.publicKey, {
      prefix,
      type,
      binIdx,
    })
  }
}

export default Address
