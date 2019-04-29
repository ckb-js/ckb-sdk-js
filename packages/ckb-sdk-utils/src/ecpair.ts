import * as ecc from 'tiny-secp256k1'
import types from './types'

const randomBytes = require('randombytes')
const typeforce = require('typeforce')
const wif = require('wif')

export interface Options {
  compressed?: boolean
  network?: any
}

class ECPair {
  private _sk: Uint8Array = new Uint8Array(0)

  public _pk: Uint8Array = new Uint8Array(0)

  public _compressed: boolean = false

  public network: any

  constructor(
    sk: Uint8Array,
    options: Options = {
      compressed: true,
      network: null,
    }
  ) {
    this._sk = sk
    this._compressed = options.compressed || true
    this.network = options.network || {}
    this._pk = ecc.pointFromScalar(this._sk as Buffer, this._compressed) || this._pk
  }

  get privateKey(): Uint8Array {
    return this._sk
  }

  get publicKey() {
    if (!this._pk) {
      this._pk = ecc.pointFromScalar(this._sk as Buffer, this._compressed) || this._pk
    }
    return this._pk
  }

  public toWIF = () => {
    if (!this._sk) throw new Error('Missing private key')
    // TODO: what is network wif
    return wif.encode(this.network.wif, this._sk, this._compressed)
  }

  public sign = (hash: Buffer) => {
    if (!this._sk) throw new Error('Missing private key')
    return ecc.sign(hash, this._sk as Buffer)
  }

  public verify = (hash: Buffer, signature: Buffer) => ecc.verify(hash, this.publicKey as Buffer, signature)
}

const fromPrivateKey = (buffer: Buffer, options: Options) => {
  typeforce(types.Buffer256bit, buffer)
  if (!ecc.isPrivate(buffer)) {
    throw new TypeError('Private key not in range [1, n)')
  }
  return new ECPair(buffer, options)
}

export const makeRandom = (options: any = {}) => {
  const { rng = randomBytes } = options
  let d
  do {
    d = rng(32)
    typeforce(types.Buffer256bit, d)
  } while (!ecc.isPrivate(d))
  return fromPrivateKey(d, options)
}

export default ECPair
