import {
  HexStringShouldStartWith0x,
  InvalidSingleSignatureAddress,
  InvalidSingleSignatureAddressPayload,
} from './exceptions'
import { parseAddress } from './address'

export const assertToBeHexStringOrBigint = (value: string | bigint) => {
  if (typeof value === 'bigint') {
    return true
  }
  if (typeof value === 'string') {
    if (!value.startsWith('0x')) {
      throw new HexStringShouldStartWith0x(value)
    }
    return true
  }
  throw new TypeError(`${value} should be type of string or bigint`)
}

export const assertToBeSingleSigAddressPayload = (payload: string) => {
  if (!payload.startsWith('0x0100') || payload.length !== 46) {
    throw new InvalidSingleSignatureAddressPayload(payload)
  }
  return true
}

export const assertToBeSingleSigAddress = (address: string) => {
  if (address.length !== 46) {
    throw new InvalidSingleSignatureAddress(address)
  }
  try {
    const payload = parseAddress(address, 'hex')
    assertToBeSingleSigAddressPayload(payload)
  } catch (err) {
    throw new InvalidSingleSignatureAddress(address)
  }
  return true
}

export default {
  assertToBeHexStringOrBigint,
  assertToBeSingleSigAddressPayload,
  assertToBeSingleSigAddress,
}
