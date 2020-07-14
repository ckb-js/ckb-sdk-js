import ErrorCode from './ErrorCode'

export class AddressPayloadException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(payload: string) {
    super(`${payload} is not a single-sig address payload`)
  }
}

export class AddressException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(addr: string) {
    super(`${addr} is not a single-sig address`)
  }
}

export default {
  AddressPayloadException,
  AddressException,
}
