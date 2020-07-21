import ErrorCode from './ErrorCode'

export class AddressPayloadException extends Error {
  code = ErrorCode.AddressInvalid

  type: 'short' | 'full' | undefined

  constructor(payload: Uint8Array, type?: 'short' | 'full') {
    super(`${payload} is not a valid ${type ? `${type} version ` : ''}address payload`)
    this.type = type
  }
}

export class AddressException extends Error {
  code = ErrorCode.AddressInvalid

  type: 'short' | 'full' | undefined

  constructor(addr: string, type?: 'short' | 'full') {
    super(`${addr} is not a valid ${type ? `${type} version ` : ''}address`)
    this.type = type
  }
}

export default {
  AddressPayloadException,
  AddressException,
}
