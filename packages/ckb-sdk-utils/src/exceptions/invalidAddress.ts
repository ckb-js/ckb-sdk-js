export class InvalidSingleSignatureAddressPayload extends Error {
  constructor(payload: string) {
    super(`${payload} is not a single signature address payload`)
  }
}

export class InvalidSingleSignatureAddress extends Error {
  constructor(addr: string) {
    super(`${addr} is not a single signature address`)
  }
}

export default {
  InvalidSingleSignatureAddressPayload,
  InvalidSingleSignatureAddress,
}
