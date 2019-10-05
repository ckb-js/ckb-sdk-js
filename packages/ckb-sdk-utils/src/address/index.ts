import { bech32, blake160, hexToBytes, bytesToHex } from '..'
import { HexStringShouldStartWith0x } from '../exceptions'

export enum AddressPrefix {
  Mainnet = 'ckb',
  Testnet = 'ckt',
}

export enum AddressType {
  BinHash = '0x00',
  HashIdx = '0x01', // short version for locks with popular codehash
  DataCodeHash = '0x02', // full version with hash type 'Data'
  TypeCodeHash = '0x04', // full version with hash type 'Type'
}

export type CodeHashIndex = '0x00' | string

export interface AddressOptions {
  prefix: AddressPrefix
  type: AddressType
  codeHashOrCodeHashIndex: CodeHashIndex | CKBComponents.Hash256
}

export const defaultAddressOptions = {
  prefix: AddressPrefix.Testnet,
  type: AddressType.HashIdx,
  codeHashOrCodeHashIndex: '0x00',
}

/**
 * @function toAddressPayload
 * @description payload = type(01) | code hash index(00) | args(blake160-formatted pubkey)
 * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md
 * @param {string | Uint8Array} args, use as the identifier of an address, usually the public key hash is used.
 * @param {string} type, used to indicate which format is adopted to compose the address.
 * @param {string} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to
 */
export const toAddressPayload = (
  args: string | Uint8Array,
  type: AddressType = AddressType.HashIdx,
  codeHashOrCodeHashIndex: CodeHashIndex | CKBComponents.Hash256 = '0x00'
): Uint8Array => {
  if (typeof args === 'string') {
    if (!args.startsWith('0x')) {
      throw new HexStringShouldStartWith0x(args)
    }
    return new Uint8Array([...hexToBytes(type), ...hexToBytes(codeHashOrCodeHashIndex), ...hexToBytes(args)])
  }
  return new Uint8Array([...hexToBytes(type), ...hexToBytes(codeHashOrCodeHashIndex), ...args])
}

/**
 * @name bech32Address
 * @description generate the address by bech32 algorithm
 * @param arg, used as the identifier of an address, usually the public key hash is used.
 * @param {string} prefix, the prefix precedes the address.
 * @param {string} type, used to indicate which format is adopted to compose the address.
 * @param {string} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to.
 */
export const bech32Address = (
  arg: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashOrCodeHashIndex = '0x00',
  }: AddressOptions = defaultAddressOptions
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(arg, type, codeHashOrCodeHashIndex)))

/**
 * @name fullPayloadToAddress
 * @description generate the address with payload in full version format.
 * @param {string} arg, used as the identifier of an address.
 * @param {string} prefix, the prefix precedes the address.
 * @param {string} type, used to indicate which format the address conforms to,
 *                       with hash type of Data or with hash type of Type.
 * @param {string} codeHash, the code hash used in the full version payload.
 */
export const fullPayloadToAddress = ({
  arg,
  prefix = AddressPrefix.Testnet,
  type = AddressType.DataCodeHash,
  codeHash,
}: {
  arg: string
  prefix: AddressPrefix
  type: AddressType.DataCodeHash | AddressType.TypeCodeHash
  codeHash: CKBComponents.Hash256
}) =>
  bech32Address(arg, {
    prefix,
    type,
    codeHashOrCodeHashIndex: codeHash,
  })

export const pubkeyToAddress = (
  pubkey: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashOrCodeHashIndex = '0x00' as CodeHashIndex,
  }: AddressOptions = defaultAddressOptions
) => {
  const publicKeyHash = blake160(pubkey)
  return bech32Address(publicKeyHash, {
    prefix,
    type,
    codeHashOrCodeHashIndex,
  })
}

export declare interface ParseAddress {
  (address: string): Uint8Array
  (address: string, encode: 'binary'): Uint8Array
  (address: string, encode: 'hex'): string
  (address: string, encode: 'binary' | 'hex'): Uint8Array | string
}
/**
 * @return addressPayload, consists of type | params | publicKeyHash
 *         e.g. 0x | 01 | 00 | e2fa82e70b062c8644b80ad7ecf6e015e5f352f6
 */
export const parseAddress: ParseAddress = (address: string, encode: 'binary' | 'hex' = 'binary'): any => {
  const decoded = bech32.decode(address)
  const data = bech32.fromWords(new Uint8Array(decoded.words))
  return encode === 'binary' ? data : bytesToHex(data)
}
