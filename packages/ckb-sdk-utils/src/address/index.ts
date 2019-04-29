import { bech32, blake160, hexToBytes, bytesToHex, utf8ToBytes } from '..'

export enum AddressPrefix {
  Mainnet = 'ckb',
  Testnet = 'ckt',
}

export enum AddressType {
  BinHash = '0x00',
  BinIdx = '0x01',
}

export enum AddressBinIdx {
  P2PH = 'P2PH',
}

export interface AddressOptions {
  prefix: AddressPrefix
  type: AddressType
  binIdx: AddressBinIdx
}

export const defaultAddressOptions = {
  prefix: AddressPrefix.Mainnet,
  type: AddressType.BinIdx,
  binIdx: AddressBinIdx.P2PH,
}

/**
 * @description payload = type(01) | bin-idx("P2PH" => "50|32|50|40") | blake160-formatted pubkey
 * @see https://github.com/nervosnetwork/ckb/wiki/Common-Address-Format
 */
export const toAddressPayload = (
  blake160Pubkey: string | Uint8Array,
  type: AddressType = AddressType.BinIdx,
  params: AddressBinIdx = AddressBinIdx.P2PH
): Uint8Array => {
  if (typeof blake160Pubkey === 'string') {
    return new Uint8Array([...hexToBytes(type), ...utf8ToBytes(params), ...hexToBytes(blake160Pubkey)])
  }
  return new Uint8Array([...hexToBytes(type), ...utf8ToBytes(params), ...blake160Pubkey])
}

export const bech32Address = (
  data: Uint8Array | string,
  {
    prefix = AddressPrefix.Mainnet,
    type = AddressType.BinIdx,
    binIdx = AddressBinIdx.P2PH,
  }: AddressOptions = defaultAddressOptions
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(data, type, binIdx)))

export const pubkeyToAddress = (
  pubkey: Uint8Array | string,
  {
    prefix = AddressPrefix.Mainnet,
    type = AddressType.BinIdx,
    binIdx = AddressBinIdx.P2PH,
  }: AddressOptions = defaultAddressOptions
) => {
  const blake160Pubkey = blake160(pubkey)
  return bech32Address(blake160Pubkey, {
    prefix,
    type,
    binIdx,
  })
}

export const parseAddress = (
  address: string,
  prefix: AddressPrefix = AddressPrefix.Mainnet,
  encode: 'binary' | 'hex' = 'binary'
) => {
  const decoded = bech32.decode(address)
  if (decoded.prefix !== prefix) {
    throw new Error('Prefix not matched')
  }
  const data = bech32.fromWords(new Uint8Array(decoded.words))
  return encode === 'binary' ? data : bytesToHex(data)
}
