// Type definition for blake2b-wasm v1.1.7
// Project: https://github.com/mafintosh/blake2b-wasm
// Definitions by: Keith Chen <https://github.com/keith-CY/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'blake2b-wasm' {
  export interface Blake2bConstructor {
    new (
      digestLength: number | Uint8Array,
      key: Uint8Array | Buffer | null,
      salt: Uint8Array | Buffer | null,
      personal: Uint8Array | Buffer | null,
      noAssert: boolean | null
    )
  }
  export interface Blake2b {
    update(input): Blake2b

    digest(enc: 'binary' | 'hex' | undefined | null): Uint8Array | string

    final(enc: 'binary' | 'hex' | undefined | null): Uint8Array | string

    static ready(cb: Function): Promise<void | Error>

    ready(cb: Function): Promise<void | Error>

    WASM: Buffer

    SUPPORT: boolean
  }
  export const blake2b: (
    digestLength: number | Uint8Array,
    key?: Uint8Array | Buffer | null,
    salt?: Uint8Array | Buffer | null,
    personal?: Uint8Array | Buffer | null,
    noAssert?: boolean | null
  ) => Blake2b

  export const BYTES_MIN = 16
  export const BYTES_MAX = 64
  export const BYTES = 32
  export const KEYBYTES_MIN = 16
  export const KEYBYTES_MAX = 64
  export const KEYBYTES = 32
  export const SALTBYTES = 16
  export const PERSONALBYTES = 16
  export default blake2b
}
