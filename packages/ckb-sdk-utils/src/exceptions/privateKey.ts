import ErrorCode from './ErrorCode'

export class PrivateKeyLenException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super('Private key has invalid length')
  }
}
export default {
  PrivateKeyLenException,
}
