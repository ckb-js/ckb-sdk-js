import { ec as EC } from 'elliptic'

import { hexToBytes } from '.'

const ec = new EC('secp256k1')

export interface Options {
  compressed?: boolean
}

class ECPair {
  protected key: EC.KeyPair

  public compressed: boolean = false

  constructor(
    sk: Uint8Array | string,
    { compressed = true }: Options = {
      compressed: true,
    }
  ) {
    if (typeof sk === 'undefined') throw new Error('Private key is required')
    this.key = ec.keyFromPrivate(sk)
    this.compressed = compressed
  }

  get privateKey(): string {
    return this.key.getPrivate('hex')
  }

  get publicKey() {
    return this.key.getPublic(this.compressed, 'hex')
  }

  public getPrivateKey = (enc: 'hex' = 'hex') => this.key.getPrivate(enc)

  public getPublicKey = (enc: 'hex' | 'array') => this.key.getPublic(this.compressed, enc)

  public sign = (msg: string | Uint8Array) => {
    const message = typeof msg === 'string' ? hexToBytes(msg) : msg
    return this.key
      .sign(message, {
        canonical: true,
      })
      .toDER('hex')
  }

  public verify = (msg: string | Buffer, sig: string | Buffer) => {
    const message = typeof msg === 'string' ? hexToBytes(msg) : msg
    const signature = typeof sig === 'string' ? hexToBytes(sig) : sig
    return this.key.verify(message, signature as any)
  }
}

export default ECPair
