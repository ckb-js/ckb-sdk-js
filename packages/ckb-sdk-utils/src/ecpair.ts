import { pointFromScalar } from 'tiny-secp256k1'

export interface Options {
  compressed?: boolean
}

class ECPair {
  protected sk: Uint8Array = new Uint8Array(0)

  protected pk: Uint8Array = new Uint8Array(0)

  public compressed: boolean = false

  constructor(
    sk: Uint8Array,
    { compressed = true }: Options = {
      compressed: true,
    }
  ) {
    this.sk = sk
    this.compressed = compressed
    this.pk = pointFromScalar(sk as Buffer, this.compressed) || this.pk
  }

  get privateKey(): Uint8Array {
    return this.sk
  }

  get publicKey() {
    return this.pk
  }
}

export default ECPair
