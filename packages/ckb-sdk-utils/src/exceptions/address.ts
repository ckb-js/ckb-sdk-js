import ErrorCode from './ErrorCode'

export class AddressPayloadException extends Error {
  code = ErrorCode.AddressInvalid

  type: 'short' | 'full' | undefined

  constructor(payload: Uint8Array, type?: 'short' | 'full') {
    super(`'${payload}' is not a valid ${type ? `${type} version ` : ''}address payload`)
    this.type = type
  }
}

export class AddressException extends Error {
  code = ErrorCode.AddressInvalid

  type: 'short' | 'full' | undefined

  constructor(addr: string, stack: string, type?: 'short' | 'full') {
    super(`'${addr}' is not a valid ${type ? `${type} version ` : ''}address`)
    this.type = type
    this.stack = stack
  }
}

export class CodeHashException extends Error {
  code = ErrorCode.AddressInvalid

  constructor(codeHash: string) {
    super(`'${codeHash}' is not a valid code hash`)
  }
}

export class HashTypeException extends Error {
  code = ErrorCode.AddressInvalid

  constructor(hashType: string) {
    super(`'${hashType}' is not a valid hash type`)
  }
}

export class ArgsLenException extends Error {
  code = ErrorCode.AddressInvalid

  constructor(argsLen: string) {
    super(`'${argsLen}' is not a valid args length`)
  }
}

export default {
  AddressPayloadException,
  AddressException,
  CodeHashException,
  HashTypeException,
  ArgsLenException,
}
