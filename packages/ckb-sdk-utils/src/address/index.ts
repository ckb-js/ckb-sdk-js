import { bech32, blake160, hexToBytes, bytesToHex } from '..'

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
  identifier: string | Uint8Array,
  type: AddressType = AddressType.HashIdx,
  params: CodeHashIndex = '0x00'
): Uint8Array => {
  if (typeof identifier === 'string') {
    return new Uint8Array([...hexToBytes(type), ...hexToBytes(params), ...hexToBytes(identifier)])
  }
  return new Uint8Array([...hexToBytes(type), ...hexToBytes(params), ...identifier])
}

export const bech32Address = (
  identifier: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashIndex = '0x00',
  }: AddressOptions = defaultAddressOptions
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(identifier, type, codeHashIndex)))

export const pubkeyToAddress = (
  pubkey: Uint8Array | string,
  {
    prefix = AddressPrefix.Testnet,
    type = AddressType.HashIdx,
    codeHashIndex = '0x00' as CodeHashIndex,
  }: AddressOptions = defaultAddressOptions
) => {
  const identifier = blake160(pubkey)
  return bech32Address(identifier, {
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
