import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { pubkeyToAddress, blake160, AddressPrefix, AddressType } from '@nervosnetwork/ckb-sdk-utils'
import { AddressOptions } from '@nervosnetwork/ckb-sdk-utils/lib/address'

class KeyPair extends ECPair {
  public testnetAddress = ''

  public mainnetAddress = ''

  public publicKeyHash = ''

  public constructor(
    sk: Uint8Array | string,
    {
      addressAlgorithm = pubkeyToAddress,
      type = AddressType.HashIdx,
      codeHashOrCodeHashIndex = '0x00',
    }: Partial<
      {
        addressAlgorithm: Function
      } & AddressOptions
    > = {
      addressAlgorithm: pubkeyToAddress,
      type: AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    }
  ) {
    super(sk)
    this.testnetAddress = addressAlgorithm(this.publicKey, {
      prefix: AddressPrefix.Testnet,
      type,
      codeHashOrCodeHashIndex,
    })
    this.mainnetAddress = addressAlgorithm(this.privateKey, {
      prefix: AddressPrefix.Mainnet,
      type,
      codeHashOrCodeHashIndex,
    })
    this.publicKeyHash = `0x${blake160(this.publicKey as string, 'hex')}`
  }
}

export default KeyPair
