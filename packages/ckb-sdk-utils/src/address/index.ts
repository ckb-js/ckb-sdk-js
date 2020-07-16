import { bech32, blake160 } from '..'
import { hexToBytes, bytesToHex } from '../convertors'
import { HexStringWithout0xException, AddressException, AddressPayloadException } from '../exceptions'

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

export type CodeHashIndex = '0x00' | '0x01' | '0x02'

export interface AddressOptions {
  prefix: AddressPrefix
  type: AddressType
  codeHashOrCodeHashIndex: CodeHashIndex | CKBComponents.Hash256
}

export const defaultAddressOptions = {
  prefix: AddressPrefix.Mainnet,
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
  codeHashOrCodeHashIndex: CodeHashIndex | CKBComponents.Hash256 = '0x00',
): Uint8Array => {
  if (typeof args === 'string') {
    if (!args.startsWith('0x')) {
      throw new HexStringWithout0xException(args)
    }
    return new Uint8Array([...hexToBytes(type), ...hexToBytes(codeHashOrCodeHashIndex), ...hexToBytes(args)])
  }
  return new Uint8Array([...hexToBytes(type), ...hexToBytes(codeHashOrCodeHashIndex), ...args])
}

/**
 * @name bech32Address
 * @description generate the address by bech32 algorithm
 * @param args, used as the identifier of an address, usually the public key hash is used.
 * @param {string} prefix, the prefix precedes the address.
 * @param {string} type, used to indicate which format is adopted to compose the address.
 * @param {string} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to.
 */
export const bech32Address = (
  args: Uint8Array | string,
  {
    prefix = AddressPrefix.Mainnet,
    type = AddressType.HashIdx,
    codeHashOrCodeHashIndex = '0x00',
  }: AddressOptions = defaultAddressOptions,
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(args, type, codeHashOrCodeHashIndex)))

/**
 * @name fullPayloadToAddress
 * @description generate the address with payload in full version format.
 * @param {string} args, used as the identifier of an address.
 * @param {string} prefix, the prefix precedes the address.
 * @param {string} type, used to indicate which format the address conforms to,
 *                       with hash type of Data or with hash type of Type.
 * @param {string} codeHash, the code hash used in the full version payload.
 */
export const fullPayloadToAddress = ({
  args,
  prefix = AddressPrefix.Mainnet,
  type = AddressType.DataCodeHash,
  codeHash,
}: {
  args: string
  prefix: AddressPrefix
  type: AddressType.DataCodeHash | AddressType.TypeCodeHash
  codeHash: CKBComponents.Hash256
}) =>
  bech32Address(args, {
    prefix,
    type,
    codeHashOrCodeHashIndex: codeHash,
  })

export const pubkeyToAddress = (
  pubkey: Uint8Array | string,
  {
    prefix = AddressPrefix.Mainnet,
    type = AddressType.HashIdx,
    codeHashOrCodeHashIndex = '0x00' as CodeHashIndex,
  }: AddressOptions = defaultAddressOptions,
) => {
  const publicKeyHash = blake160(pubkey)
  return bech32Address(publicKeyHash, {
    prefix,
    type,
    codeHashOrCodeHashIndex,
  })
}

const isValidShortVersionPayload = (payload: Uint8Array) => {
  const [, index, ...data] = payload
  /* eslint-disable indent */
  switch (index) {
    case 0: // secp256k1 + blake160
    case 1: {
      // secp256k1 + multisig
      if (data.length !== 20) {
        throw new AddressPayloadException(payload, 'short')
      }
      break
    }
    case 2: {
      // anyone can pay
      if (data.length === 20 || data.length === 22 || data.length === 24) {
        break
      }
      throw new AddressPayloadException(payload, 'short')
    }
    default: {
      throw new AddressPayloadException(payload, 'short')
    }
  }
  /* eslint-enable indent */
}

const isValidPayload = (payload: Uint8Array) => {
  const [type, ...data] = payload
  /* eslint-disable indent */
  switch (type) {
    case +AddressType.HashIdx: {
      isValidShortVersionPayload(payload)
      break
    }
    case +AddressType.DataCodeHash:
    case +AddressType.TypeCodeHash: {
      if (data.length < 32) {
        throw new AddressPayloadException(payload, 'full')
      }
      break
    }
    default: {
      throw new AddressPayloadException(payload)
    }
  }
  /* eslint-enable indent */
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
  const payload = bech32.fromWords(new Uint8Array(decoded.words))
  try {
    isValidPayload(payload)
  } catch (err) {
    throw new AddressException(address, err.type)
  }
  return encode === 'binary' ? payload : bytesToHex(payload)
}
