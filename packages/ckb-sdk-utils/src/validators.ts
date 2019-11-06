import { HexStringShouldStartWith0x } from './exceptions'

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

export default {
  assertToBeHexStringOrBigint,
}
