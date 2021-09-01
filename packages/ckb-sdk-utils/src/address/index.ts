import { bech32, blake160 } from '..'
import {
  SECP256K1_BLAKE160,
  SECP256K1_MULTISIG,
  ANYONE_CAN_PAY_MAINNET,
  ANYONE_CAN_PAY_TESTNET,
} from '../systemScripts'
import { hexToBytes, bytesToHex } from '../convertors'
import {
  HexStringWithout0xException,
  AddressException,
  AddressPayloadException,
  CodeHashException,
  HashTypeException,
  ArgsLenException,
} from '../exceptions'

// TODO: deprecate outdated methods

export enum AddressPrefix {
  Mainnet = 'ckb',
  Testnet = 'ckt',
}

export enum AddressType {
  FullVersion = '0x00', // full version identified the hash_type and vm_version
  HashIdx = '0x01', // short version for locks with popular codehash
  DataCodeHash = '0x02', // full version with hash type 'Data', deprecated
  TypeCodeHash = '0x04', // full version with hash type 'Type', deprecated
}

const payloadToAddress = (payload: Uint8Array, isMainnet = true) =>
  bech32.encode(isMainnet ? AddressPrefix.Mainnet : AddressPrefix.Testnet, bech32.toWords(payload))

const scriptToPayload = ({ codeHash, hashType, args }: CKBComponents.Script): Uint8Array => {
  enum HashType {
    data = '00',
    type = '01',
    data1 = '02',
  }

  if (!args.startsWith('0x')) {
    throw new HexStringWithout0xException(args)
  }

  if (!codeHash.startsWith('0x') || codeHash.length !== 66) {
    throw new CodeHashException(codeHash)
  }

  if (!HashType[hashType]) {
    throw new HashTypeException(hashType)
  }
  const argsLen = args.length / 2 - 1

  return hexToBytes(
    `0x00${codeHash.slice(2)}${HashType[hashType]}${argsLen.toString(16).padStart(4, '0')}${args.slice(2)}`,
  )
}

export const scriptToAddress = (script: CKBComponents.Script, isMainnet = true) =>
  payloadToAddress(scriptToPayload(script), isMainnet)

/**
 * 0x00 SECP256K1 + blake160
 * 0x01 SECP256k1 + multisig
 * 0x02 anyone_can_pay
 */
export type CodeHashIndex = '0x00' | '0x01' | '0x02'

export interface AddressOptions {
  prefix?: AddressPrefix
  type?: AddressType
  codeHashOrCodeHashIndex?: CodeHashIndex | CKBComponents.Hash256
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
  if (typeof args === 'string' && !args.startsWith('0x')) {
    throw new HexStringWithout0xException(args)
  }

  if ([AddressType.DataCodeHash, AddressType.TypeCodeHash].includes(type)) {
    /* eslint-disable max-len */
    console.warn(
      `Address of 'AddressType.DataCodeHash' or 'AddressType.TypeCodeHash' is deprecated, please use address of AddressPrefix.FullVersion`,
    )
  }

  if (type !== AddressType.FullVersion) {
    return new Uint8Array([
      ...hexToBytes(type),
      ...hexToBytes(codeHashOrCodeHashIndex),
      ...(typeof args === 'string' ? hexToBytes(args) : args),
    ])
  }

  if (!codeHashOrCodeHashIndex.startsWith('0x') || codeHashOrCodeHashIndex.length !== 66) {
    throw new CodeHashException(codeHashOrCodeHashIndex)
  }

  return scriptToPayload({
    codeHash: codeHashOrCodeHashIndex,
    hashType: 'data1',
    args: typeof args === 'string' ? args : bytesToHex(args),
  })
}

/**
 * @name bech32Address
 * @description generate the address by bech32 algorithm
 * @param args, used as the identifier of an address, usually the public key hash is used.
 * @param {[string]} prefix, the prefix precedes the address, default to be ckb.
 * @param {[string]} type, used to indicate which format is adopted to compose the address, default to be 0x01.
 * @param {[string]} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to,
 *                                            default to be 0x00.
 */
export const bech32Address = (
  args: Uint8Array | string,
  { prefix = AddressPrefix.Mainnet, type = AddressType.HashIdx, codeHashOrCodeHashIndex = '0x00' }: AddressOptions = {},
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(args, type, codeHashOrCodeHashIndex)))

/**
 * @name fullPayloadToAddress
 * @description generate the address with payload in full version format.
 * @param {string} args, used as the identifier of an address.
 * @param {[string]} prefix, the prefix precedes the address, default to be ckb.
 * @param {[string]} type, used to indicate which format the address conforms to, default to be 0x02,
 *                       with hash type of Data or with hash type of Type.
 * @param {string} codeHash, the code hash used in the full version payload.
 */
export const fullPayloadToAddress = ({
  args,
  prefix,
  type = AddressType.DataCodeHash,
  codeHash,
}: {
  args: string
  prefix?: AddressPrefix
  type?: AddressType.DataCodeHash | AddressType.TypeCodeHash
  codeHash: CKBComponents.Hash256
}) => bech32Address(args, { prefix, type, codeHashOrCodeHashIndex: codeHash })

export const pubkeyToAddress = (pubkey: Uint8Array | string, options: AddressOptions = {}) => {
  const publicKeyHash = blake160(pubkey)
  return bech32Address(publicKeyHash, options)
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

const isPayloadValid = (payload: Uint8Array) => {
  const type = payload[0]
  const data = payload.slice(1)
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
    case +AddressType.FullVersion: {
      const codeHash = data.slice(0, 32)
      if (codeHash.length < 32) {
        throw new CodeHashException(bytesToHex(codeHash))
      }

      const hashType = parseInt(data[32].toString(), 16)
      if (hashType > 2) {
        throw new HashTypeException(`0x${hashType.toString(16)}`)
      }

      const argsLen = data.slice(33, 35)
      if (argsLen.length < 2) {
        throw new ArgsLenException(bytesToHex(argsLen))
      }

      if (data.slice(35).length !== +bytesToHex(argsLen)) {
        throw new ArgsLenException(bytesToHex(argsLen))
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
    isPayloadValid(payload)
  } catch (err) {
    throw new AddressException(address, err.stack, err.type)
  }
  return encode === 'binary' ? payload : bytesToHex(payload)
}

export const addressToScript = (address: string): CKBComponents.Script => {
  const payload = parseAddress(address)
  const type = payload[0]

  if (type === +AddressType.FullVersion) {
    const HASH_TYPE: Record<string, CKBComponents.ScriptHashType> = {
      '00': 'data',
      '01': 'type',
      '02': 'data1',
    }
    const p = bytesToHex(payload)

    const codeHash = `0x${p.substr(4, 64)}`
    const hashType = HASH_TYPE[p.substr(68, 2)]
    const argLen = parseInt(p.substr(70, 4), 16)
    const args = `0x${p.substr(74, argLen * 2)}`
    return { codeHash, hashType, args }
  }

  if (type === +AddressType.HashIdx) {
    const codeHashIndices = [
      SECP256K1_BLAKE160,
      SECP256K1_MULTISIG,
      address.startsWith(AddressPrefix.Mainnet) ? ANYONE_CAN_PAY_MAINNET : ANYONE_CAN_PAY_TESTNET,
    ]
    const index = payload[1]
    const args = payload.slice(2)
    const script = codeHashIndices[index]
    return {
      codeHash: script.codeHash,
      hashType: script.hashType,
      args: bytesToHex(args),
    }
  }

  const codeHashAndArgs = bytesToHex(payload.slice(1))
  const hashType = type === +AddressType.DataCodeHash ? 'data' : 'type'
  return {
    codeHash: codeHashAndArgs.substr(0, 66),
    hashType,
    args: `0x${codeHashAndArgs.substr(66)}`,
  }
}
