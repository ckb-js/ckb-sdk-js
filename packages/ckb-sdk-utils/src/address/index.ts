import { bech32, blake160, hexToBytes, bytesToHex } from '..'
import { HexStringShouldStartWith0x } from '../exceptions'

export enum AddressPrefix {
  Mainnet = 'ckb',
  Testnet = 'ckt',
}

export enum AddressType {
  BinHash = '0x00',
  HashIdx = '0x01',
}

export type CodeHashIndex = '0x00' | string

export interface AddressOptions {
  prefix: AddressPrefix
  type: AddressType
  codeHashIndex: CodeHashIndex
}

export const defaultAddressOptions = {
  prefix: AddressPrefix.Testnet,
  type: AddressType.HashIdx,
  codeHashIndex: '0x00',
}

/**
 * @description payload = type(01) | code hash index(00) | blake160-formatted pubkey
 * @see https://github.com/nervosnetwork/ckb/wiki/Common-Address-Format
 */
export const toAddressPayload = (
  publicKeyHash: string | Uint8Array,
  type: AddressType = AddressType.HashIdx,
  params: CodeHashIndex = '0x00'
): Uint8Array => {
  if (typeof publicKeyHash === 'string') {
    if (!publicKeyHash.startsWith('0x')) {
      throw new HexStringShouldStartWith0x(publicKeyHash)
    }
    return new Uint8Array([...hexToBytes(type), ...hexToBytes(params), ...hexToBytes(publicKeyHash)])
  }
  return new Uint8Array([...hexToBytes(type), ...hexToBytes(params), ...publicKeyHash])
}

export const bech32Address = (
  publicKeyHash: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashIndex = '0x00',
  }: AddressOptions = defaultAddressOptions
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(publicKeyHash, type, codeHashIndex)))

export const pubkeyToAddress = (
  pubkey: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashIndex = '0x00' as CodeHashIndex,
  }: AddressOptions = defaultAddressOptions
) => {
  const publicKeyHash = blake160(pubkey)
  return bech32Address(publicKeyHash, {
    prefix,
    type,
    codeHashIndex,
  })
}

export declare interface ParseAddress {
  (address: string): Uint8Array
  (address: string, prefix: AddressPrefix): Uint8Array
  (address: string, prefix: AddressPrefix, encode: 'binary'): Uint8Array
  (address: string, prefix: AddressPrefix, encode: 'hex'): string
  (address: string, prefix: AddressPrefix, encode: 'binary' | 'hex'): Uint8Array | string
}
/**
 * @return addressPayload, consists of type | params | publicKeyHash
 *         e.g. 0x | 01 | 00 | e2fa82e70b062c8644b80ad7ecf6e015e5f352f6
 */
export const parseAddress: ParseAddress = (
  address: string,
  prefix: AddressPrefix = AddressPrefix.Testnet,
  encode: 'binary' | 'hex' = 'binary'
): any => {
  const decoded = bech32.decode(address)
  if (decoded.prefix !== prefix) {
    throw new Error('Prefix not matched')
  }
  const data = bech32.fromWords(new Uint8Array(decoded.words))
  return encode === 'binary' ? data : bytesToHex(data)
}
