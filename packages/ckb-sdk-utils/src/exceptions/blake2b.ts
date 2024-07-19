import ErrorCode from './ErrorCode.js'

export class OutLenTooSmallException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(outlen: number, minLen: number) {
    super(`Expect outlen to be at least ${minLen}, but ${outlen} received`)
  }
}

export class OutLenTooLargeException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(outlen: number, maxLen: number) {
    super(`Expect outlen to be at most ${maxLen}, but ${outlen} received`)
  }
}

export class KeyLenTooSmallException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(keyLen: number, minLen: number) {
    super(`Expect key length to be at least ${minLen}, but ${keyLen} received`)
  }
}

export class KeyLenTooLargeException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(keyLen: number, maxLen: number) {
    super(`Expect key length to be at most ${maxLen}, but ${keyLen} received`)
  }
}

export class OutTypeException extends TypeError {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super(`Expect out to be "binary", "hex", Uint8Array, or Buffer`)
  }
}

export class SaltTypeException extends TypeError {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super(`Expect salt to be Uint8Array or Buffer`)
  }
}

export class SaltLenException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(saltLen: number, requiredLen: number) {
    super(`Expect salt length to be ${requiredLen}, but ${saltLen} received`)
  }
}

export class InputTypeException extends TypeError {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super(`Expect input to be Uint8Array or Buffer`)
  }
}

export class KeyTypeException extends TypeError {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super(`Expect key to be Uint8Array or Buffer`)
  }
}

export class PersonalTypeException extends TypeError {
  code = ErrorCode.ParameterInvalid

  constructor() {
    super(`Expect PERSONAL to be Uint8Array or Buffer`)
  }
}

export class PersonalLenException extends Error {
  code = ErrorCode.ParameterInvalid

  constructor(personalLen: number, requiredLen: number) {
    super(`Expect PERSONAL length to be ${requiredLen}, but ${personalLen} received`)
  }
}

export default {
  OutLenTooSmallException,
  OutLenTooLargeException,
  KeyLenTooSmallException,
  KeyLenTooLargeException,
  OutTypeException,
  SaltTypeException,
  SaltLenException,
  InputTypeException,
  KeyTypeException,
  PersonalTypeException,
  PersonalLenException,
}
