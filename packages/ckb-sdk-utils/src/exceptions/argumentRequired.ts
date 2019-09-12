export default class extends Error {
  constructor(name: string) {
    super(`${name} is required`)
  }
}
