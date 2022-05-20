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

export class AddressFormatTypeException extends Error {
  code = ErrorCode.AddressInvalid

  constructor(type: number) {
    super(`0x${type.toString(16).padStart(2, '0')} is not a valid address format type`)
  }
}

export class AddressFormatTypeAndEncodeMethodNotMatchException extends Error {
  code = ErrorCode.AddressInvalid

  constructor(type: number, bech32Type: 'bech32' | 'bech32m' | 'unknown' = 'unknown') {
    super(`Address format type 0x${type.toString(16).padStart(2, '0')} doesn't match encode method ${bech32Type}`)
  }
}

export default {
  AddressPayloadException,
  AddressException,
  CodeHashException,
  HashTypeException,
  AddressFormatTypeException,
  AddressFormatTypeAndEncodeMethodNotMatchException,
}
