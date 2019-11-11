export class InvalidAddressPayload extends Error {
  constructor(payload: string) {
    super(`${payload} is not a single-sig address payload`)
  }
}

export class InvalidAddress extends Error {
  constructor(addr: string) {
    super(`${addr} is not a single-sig address`)
  }
}

export default {
  InvalidAddressPayload,
  InvalidAddress,
}
