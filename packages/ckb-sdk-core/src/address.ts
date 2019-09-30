import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { pubkeyToAddress, blake160, AddressPrefix, AddressType } from '@nervosnetwork/ckb-sdk-utils'
import { AddressOptions } from '@nervosnetwork/ckb-sdk-utils/lib/address'

class Address extends ECPair {
  public value = ''

  public publicKeyHash = ''

  public constructor(
    sk: Uint8Array | string,
    {
      addressAlgorithm = pubkeyToAddress,
      prefix = AddressPrefix.Testnet,
      type = AddressType.HashIdx,
      codeHashOrCodeHashIndex = '0x00',
    }: Partial<
      {
        addressAlgorithm: Function
      } & AddressOptions
    > = {
      addressAlgorithm: pubkeyToAddress,
      prefix: AddressPrefix.Testnet,
      type: AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    }
  ) {
    super(sk)
    this.value = addressAlgorithm(this.publicKey, {
      prefix,
      type,
      codeHashOrCodeHashIndex,
    })
    this.publicKeyHash = `0x${blake160(this.publicKey as string, 'hex')}`
  }
}

export default Address
