export default class extends Error {
  constructor(hex: string) {
    super(`Hex string ${hex} should start with 0x`)
  }
}
