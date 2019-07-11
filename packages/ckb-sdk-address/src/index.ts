import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import * as utils from '@nervosnetwork/ckb-sdk-utils'
import { AddressOptions } from '@nervosnetwork/ckb-sdk-utils/lib/address'

const { hexToBytes, pubkeyToAddress, blake160, AddressPrefix, AddressType, AddressBinIdx } = utils

class Address extends ECPair {
  public value = ''

  public identifier = ''

  public constructor(
    sk: Uint8Array | string,
    {
      addressAlgorithm = pubkeyToAddress,
      prefix = AddressPrefix.Testnet,
      type = AddressType.BinIdx,
      binIdx = AddressBinIdx.P2PH,
    }: Partial<
      {
        addressAlgorithm: Function
      } & AddressOptions
    > = {
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
    this.identifier = blake160(this.publicKey as string, 'hex')
  }
}

export default Address
