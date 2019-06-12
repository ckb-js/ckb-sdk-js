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

  get privateKey() {
    return this.key.getPrivate('hex')
  }

  get publicKey() {
    return this.key.getPublic(this.compressed, 'hex') as string
  }

  public getPrivateKey = (enc: 'hex' = 'hex') => this.key.getPrivate(enc)

  public getPublicKey = (enc: 'hex' | 'array') => this.key.getPublic(this.compressed, enc)

  public sign = (message: string | Uint8Array): string => {
    const msg = typeof message === 'string' ? hexToBytes(message) : message
    return this.key
      .sign(msg, {
        canonical: true,
      })
      .toDER('hex')
  }

  public verify = (message: string | Buffer, sig: string | Buffer) => {
    const msg = typeof message === 'string' ? hexToBytes(message) : message
    const signature = typeof sig === 'string' ? hexToBytes(sig) : sig
    return this.key.verify(msg, signature as any)
  }

  public signRecoverable = (message: string | Uint8Array): string => {
    const msg = typeof message === 'string' ? hexToBytes(message) : message
    const { r, s, recoveryParam } = this.key.sign(msg, {
      canonical: true,
    })
    const fmtR = r.toString(16).padStart(64, '0')
    const fmtS = s.toString(16).padStart(64, '0')
    const fmtRecID = recoveryParam ? '01' : '00'
    return `${fmtR}${fmtS}${fmtRecID}`
  }
}

export default ECPair
