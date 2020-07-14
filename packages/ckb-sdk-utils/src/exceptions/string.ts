import ErrorCode from './ErrorCode'

export class HexStringException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(hex: string) {
    super(`${hex} is an invalid hex string`)
  }
}

export class HexStringWithout0xException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(hex: string) {
    super(`Hex string ${hex} should start with 0x`)
  }
}

export default {
  HexStringException,
  HexStringWithout0xException,
}
