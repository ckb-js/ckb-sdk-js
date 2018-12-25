import * as ecc from 'tiny-secp256k1'
import types from './types'

const randomBytes = require('randombytes')
const typeforce = require('typeforce')
const wif = require('wif')

// const skRequired = (target: object, key: string, descriptor: any) => {
//   if (!target.privateKey)
// }
const isOptions = typeforce.maybe(
  typeforce.compile({
    compressed: typeforce.maybe(typeforce.Boolean),
    // network: typeforce.maybe(typeforce.Network),
  }),
)

interface Options {
  compressed: any
  network: any
}

// function ECPair(d: string, Q:string, options = {}) {
//   this.compressed = options.compressed
// }
class ECPair {
  private _sk: Buffer = Buffer.from([])

  public _pk: Buffer = Buffer.from([])

  public _compressed: boolean = false

  public network: any

  constructor(sk: Buffer | null, pk: Buffer | null, options: Options) {
    this._sk = sk || this._sk
    this._compressed = options.compressed || true
    this.network = options.network || ''
    if (pk) {
      this._pk = ecc.pointCompress(pk, this._compressed)
    }
  }

  get privateKey() {
    return this._sk
  }

  get publicKey() {
    if (!this._pk) {
      this._pk = ecc.pointFromScalar(this._sk, this._compressed) || this._pk
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
    return ecc.sign(hash, this._sk)
  }

  public verify = (hash: Buffer, signature: Buffer) =>
    ecc.verify(hash, this.publicKey, signature)
}

const fromPrivateKey = (buffer: Buffer, options: Options) => {
  typeforce(types.Buffer256bit, buffer)
  if (!ecc.isPrivate(buffer)) throw new TypeError('Private key not in range [1, n)')
  // typeforce(isOptions, options)
  return new ECPair(buffer, null, options)
}

const fromPublicKey = (buffer: Buffer, options: Options) => {
  typeforce(ecc.isPoint, buffer)
  // typeforce()
  return new ECPair(null, buffer, options)
}

const fromWIF = (string: string, network: any) => {
  const decoded = wif.decode(string)
  const { version } = decoded
  // TODO:
}

const makeRandom = (options: any = {}) => {
  const { rng = randomBytes } = options
  let d
  do {
    d = rng(32)
    typeforce(types.Buffer256bit, d)
  } while (!ecc.isPrivate(d))
  return fromPrivateKey(d, options)
}

export default ECPair
