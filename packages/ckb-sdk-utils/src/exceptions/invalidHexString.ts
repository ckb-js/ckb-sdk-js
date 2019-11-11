export class InvalidHexString extends Error {
  constructor(hex: string) {
    super(`${hex} is an invalid hex string`)
  }
}

export class HexStringShouldStartWith0x extends Error {
  constructor(hex: string) {
    super(`Hex string ${hex} should start with 0x`)
  }
}

export default {
  InvalidHexString,
  HexStringShouldStartWith0x,
}
