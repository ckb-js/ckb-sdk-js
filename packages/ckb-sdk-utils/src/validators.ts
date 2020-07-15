import {
  HexStringException,
  HexStringWithout0xException,
  AddressException,
  AddressPayloadException,
} from './exceptions'
import { parseAddress } from './address'

export const assertToBeHexString = (value: string) => {
  if (typeof value !== 'string' || !value.startsWith('0x') || Number.isNaN(+value)) {
    throw new HexStringException(value)
  }
  return true
}

export const assertToBeHexStringOrBigint = (value: string | bigint) => {
  if (typeof value === 'bigint') {
    return true
  }
  if (typeof value === 'string') {
    if (!value.startsWith('0x')) {
      throw new HexStringWithout0xException(value)
    }
    return true
  }
  throw new TypeError(`${value} should be type of string or bigint`)
}

export const assertToBeAddressPayload = (payload: string) => {
  if (!payload.startsWith('0x0100') || payload.length !== 46) {
    throw new AddressPayloadException(payload)
  }
  return true
}

export const assertToBeAddress = (address: string) => {
  if (address.length !== 46) {
    throw new AddressException(address)
  }
  try {
    const payload = parseAddress(address, 'hex')
    assertToBeAddressPayload(payload)
  } catch (err) {
    throw new AddressException(address)
  }
  return true
}

export default {
  assertToBeHexString,
  assertToBeHexStringOrBigint,
  assertToBeAddressPayload,
  assertToBeAddress,
}
