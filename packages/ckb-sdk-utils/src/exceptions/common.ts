import ErrorCode from './ErrorCode'

export class ParameterRequiredException extends Error {
  code = ErrorCode.ParameterRequired

  constructor(name: string) {
    super(`${name} is required`)
  }
}

export class SignMessageException extends Error {
  code = ErrorCode.SignMessageFailed

  constructor() {
    super('Fail to sign the message')
  }
}

export default {
  ParameterRequiredException,
  SignMessageException,
}
