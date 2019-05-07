import * as ecc from 'tiny-secp256k1'

export interface Options {
  compressed?: boolean
}

class ECPair {
  private sk: Uint8Array = new Uint8Array(0)

  public pk: Uint8Array = new Uint8Array(0)

  public compressed: boolean = false

  constructor(
    sk: Uint8Array,
    options: Options = {
      compressed: true,
    }
  ) {
    this.sk = sk
    this.compressed = options.compressed || true
    this.pk = ecc.pointFromScalar(this.sk as Buffer, this.compressed) || this.pk
  }

  get privateKey(): Uint8Array {
    return this.sk
  }

  get publicKey() {
    if (!this.pk) {
      this.pk = ecc.pointFromScalar(this.sk as Buffer, this.compressed) || this.pk
    }
    return this.pk
  }
}

// const fromPrivateKey = (buffer: Buffer, options: Options) => {
//   typeforce(types.Buffer256bit, buffer)
//   if (!ecc.isPrivate(buffer)) {
//     throw new TypeError('Private key not in range [1, n)')
//   }
//   return new ECPair(buffer, options)
// }

// export const makeRandom = (options: any = {}) => {
//   const { rng = randomBytes } = options
//   let d
//   do {
//     d = rng(32)
//     typeforce(types.Buffer256bit, d)
//   } while (!ecc.isPrivate(d))
//   return fromPrivateKey(d, options)
// }

export default ECPair
