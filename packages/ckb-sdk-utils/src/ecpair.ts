import { pointFromScalar } from 'tiny-secp256k1'
import { hexToBytes, bytesToHex } from '.'

export interface Options {
  compressed?: boolean
}

class ECPair {
  protected sk: Uint8Array = new Uint8Array(0)

  protected pk: Uint8Array = new Uint8Array(0)

  public compressed: boolean = false

  constructor(
    sk: Uint8Array | string,
    { compressed = true }: Options = {
      compressed: true,
    }
  ) {
    this.sk = typeof sk === 'string' ? hexToBytes(sk) : sk
    this.compressed = compressed
    this.pk = pointFromScalar(sk as Buffer, this.compressed) || this.pk
  }

  get privateKey(): Uint8Array {
    return this.sk
  }

  get publicKey() {
    return this.pk
  }

  get privateKeyHex(): string {
    return bytesToHex(this.sk)
  }

  get publicKeyHex(): string {
    return bytesToHex(this.pk)
  }
}

export default ECPair
