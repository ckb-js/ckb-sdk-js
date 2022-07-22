import { blake160, bech32, bech32m } from '..'
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
  ParameterRequiredException,
  AddressFormatTypeException,
  AddressFormatTypeAndEncodeMethodNotMatchException,
} from '../exceptions'

const MAX_BECH32_LIMIT = 1023

// TODO: deprecate outdated methods

export enum AddressPrefix {
  Mainnet = 'ckb',
  Testnet = 'ckt',
}

export enum AddressType {
  FullVersion = '0x00', // full version identifies the hash_type
  HashIdx = '0x01', // short version for locks with popular codehash
  DataCodeHash = '0x02', // full version with hash type 'Data', deprecated
  TypeCodeHash = '0x04', // full version with hash type 'Type', deprecated
}

export enum Bech32Type {
  Bech32 = 'bech32',
  Bech32m = 'bech32m',
}

/**
 * @description payload to a full address of new version
 */
const payloadToAddress = (payload: Uint8Array, isMainnet = true) =>
  bech32m.encode(isMainnet ? AddressPrefix.Mainnet : AddressPrefix.Testnet, bech32m.toWords(payload), MAX_BECH32_LIMIT)

const scriptToPayload = ({ codeHash, hashType, args }: CKBComponents.Script): Uint8Array => {
  if (!args.startsWith('0x')) {
    throw new HexStringWithout0xException(args)
  }

  if (!codeHash.startsWith('0x') || codeHash.length !== 66) {
    throw new CodeHashException(codeHash)
  }

  enum HashType {
    data = '00',
    type = '01',
    data1 = '02',
  }

  if (!HashType[hashType]) {
    throw new HashTypeException(hashType)
  }

  return hexToBytes(`0x00${codeHash.slice(2)}${HashType[hashType]}${args.slice(2)}`)
}

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/encodeToAddress]{@link https://lumos-website.vercel.app/api/modules/helpers.html#encodetoaddress}
 * @function scriptToAddress
 * @description The only way recommended to generated a full address of new version
 * @param {object} script
 * @param {booealn} isMainnet
 * @returns {string} address
 */
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
 * @description obsolete payload = type(01) | code hash index(00) | args(blake160-formatted pubkey)
 *             new payload = type(00) | code hash | hash type(00|01|02) | args
 * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md
 * @param {string | Uint8Array} args, use as the identifier of an address, usually the public key hash is used.
 * @param {string} type, used to indicate which format is adopted to compose the address.
 * @param {string} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to,
 *                 default to be secp256k1 code hash/code hash index
 */
export const toAddressPayload = (
  args: string | Uint8Array,
  type: AddressType = AddressType.HashIdx,
  codeHashOrCodeHashIndex?: CodeHashIndex | CKBComponents.Hash256,
  hashType?: CKBComponents.ScriptHashType,
): Uint8Array => {
  if (typeof args === 'string' && !args.startsWith('0x')) {
    throw new HexStringWithout0xException(args)
  }

  if (
    ![AddressType.HashIdx, AddressType.DataCodeHash, AddressType.TypeCodeHash, AddressType.FullVersion].includes(type)
  ) {
    throw new AddressFormatTypeException(+type)
  }

  if ([AddressType.DataCodeHash, AddressType.TypeCodeHash].includes(type)) {
    /* eslint-disable max-len */
    console.warn(
      `Address of 'AddressType.DataCodeHash' or 'AddressType.TypeCodeHash' is deprecated, please use address of AddressPrefix.FullVersion`,
    )
  }

  if (!codeHashOrCodeHashIndex) {
    codeHashOrCodeHashIndex = type === AddressType.HashIdx ? '0x00' : SECP256K1_BLAKE160.codeHash
  }

  if (type !== AddressType.FullVersion) {
    return new Uint8Array([
      ...hexToBytes(type),
      ...hexToBytes(codeHashOrCodeHashIndex),
      ...(typeof args === 'string' ? hexToBytes(args) : args),
    ])
  }

  if (!hashType && codeHashOrCodeHashIndex === SECP256K1_BLAKE160.codeHash) {
    hashType = SECP256K1_BLAKE160.hashType
  }

  if (!codeHashOrCodeHashIndex.startsWith('0x') || codeHashOrCodeHashIndex.length !== 66) {
    throw new CodeHashException(codeHashOrCodeHashIndex)
  }

  if (!hashType) {
    throw new ParameterRequiredException('hashType')
  }

  return scriptToPayload({
    codeHash: codeHashOrCodeHashIndex,
    hashType,
    args: typeof args === 'string' ? args : bytesToHex(args),
  })
}

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/generateAddress]{@link https://lumos-website.vercel.app/api/modules/helpers.html#generateaddress}
 * @function bech32Address
 * @description generate the address by bech32 algorithm
 * @param args, used as the identifier of an address, usually the public key hash is used.
 * @param {[string]} prefix, the prefix precedes the address, default to be ckb.
 * @param {[string]} type, used to indicate which format is adopted to compose the address, default to be 0x01.
 * @param {[string]} codeHashOrCodeHashIndex, the referenced code hash or code hash index the address binds to,
 *                                            default to be 0x00.
 */
export const bech32Address = (
  args: Uint8Array | string,
  { prefix = AddressPrefix.Mainnet, type = AddressType.HashIdx, codeHashOrCodeHashIndex = '' }: AddressOptions = {},
) => bech32.encode(prefix, bech32.toWords(toAddressPayload(args, type, codeHashOrCodeHashIndex)), MAX_BECH32_LIMIT)

/**
 * @deprecated
 * @name fullPayloadToAddress
 * @description deprecated method to generate the address with payload in full version format. Use scriptToAddress instead.
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

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/generateSecp256k1Blake160Address]{@link https://lumos-website.vercel.app/api/modules/helpers.html#generatesecp256k1blake160address}
 * @function pubkeyToAddress
 */
export const pubkeyToAddress = (pubkey: Uint8Array | string, options: AddressOptions = {}) => {
  const publicKeyHash = blake160(pubkey)
  return bech32Address(publicKeyHash, options)
}

const isValidShortVersionPayload = (payload: Uint8Array, bech32Type?: Bech32Type) => {
  const [type, index, ...data] = payload
  if (bech32Type !== Bech32Type.Bech32) {
    throw new AddressFormatTypeAndEncodeMethodNotMatchException(type, bech32Type)
  }
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

const isPayloadValid = (payload: Uint8Array, bech32Type: Bech32Type) => {
  const type = payload[0]
  const data = payload.slice(1)
  /* eslint-disable indent */
  switch (type) {
    case +AddressType.HashIdx: {
      isValidShortVersionPayload(payload, bech32Type)
      break
    }
    case +AddressType.DataCodeHash:
    case +AddressType.TypeCodeHash: {
      if (bech32Type !== Bech32Type.Bech32) {
        throw new AddressFormatTypeAndEncodeMethodNotMatchException(type, bech32Type)
      }
      if (data.length < 32) {
        throw new AddressPayloadException(payload, 'full')
      }
      break
    }
    case +AddressType.FullVersion: {
      if (bech32Type !== Bech32Type.Bech32m) {
        throw new AddressFormatTypeAndEncodeMethodNotMatchException(type, bech32Type)
      }
      const codeHash = data.slice(0, 32)
      if (codeHash.length < 32) {
        throw new CodeHashException(bytesToHex(codeHash))
      }

      const hashType = parseInt(data[32].toString(), 16)
      if (hashType > 2) {
        throw new HashTypeException(`0x${hashType.toString(16)}`)
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
  let bech32Type: Bech32Type | undefined
  let payload: Uint8Array = new Uint8Array()
  try {
    const decoded = bech32.decode(address, MAX_BECH32_LIMIT)
    bech32Type = Bech32Type.Bech32
    payload = new Uint8Array(bech32.fromWords(new Uint8Array(decoded.words)))
  } catch {
    const decoded = bech32m.decode(address, MAX_BECH32_LIMIT)
    bech32Type = Bech32Type.Bech32m
    payload = new Uint8Array(bech32m.fromWords(new Uint8Array(decoded.words)))
  }

  try {
    isPayloadValid(payload, bech32Type)
  } catch (err) {
    if (err instanceof AddressFormatTypeAndEncodeMethodNotMatchException) {
      throw err
    }
    throw new AddressException(address, err.stack, err.type)
  }
  return encode === 'binary' ? payload : bytesToHex(payload)
}

/**
 * @deprecated please migrate to [@ckb-lumos/helpers/addressToScript]{@link https://lumos-website.vercel.app/api/modules/helpers.html#addresstoscript}
 */
export const addressToScript = (address: string): CKBComponents.Script => {
  const payload = parseAddress(address)
  const type = payload[0]

  switch (type) {
    case +AddressType.FullVersion: {
      const HASH_TYPE: Record<string, CKBComponents.ScriptHashType> = {
        '00': 'data',
        '01': 'type',
        '02': 'data1',
      }
      const p = bytesToHex(payload)

      const codeHash = `0x${p.substr(4, 64)}`
      const hashType = HASH_TYPE[p.substr(68, 2)]
      const args = `0x${p.substr(70)}`
      return { codeHash, hashType, args }
    }
    case +AddressType.HashIdx: {
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
    case +AddressType.DataCodeHash:
    case +AddressType.TypeCodeHash: {
      const codeHashAndArgs = bytesToHex(payload.slice(1))
      const hashType = type === +AddressType.DataCodeHash ? 'data' : 'type'
      return {
        codeHash: codeHashAndArgs.substr(0, 66),
        hashType,
        args: `0x${codeHashAndArgs.substr(66)}`,
      }
    }
    default: {
      throw new AddressFormatTypeException(type)
    }
  }
}
