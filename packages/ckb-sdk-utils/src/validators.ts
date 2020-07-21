import { HexStringException, HexStringWithout0xException } from './exceptions'

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

export default {
  assertToBeHexString,
  assertToBeHexStringOrBigint,
}
