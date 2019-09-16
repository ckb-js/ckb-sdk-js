export default class extends Error {
  constructor(hex: string) {
    super(`${hex} is an invalid hex string`)
  }
}
