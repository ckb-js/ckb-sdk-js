const typeforce = require('typeforce')

const UINT31_MAX = 2 ** 31 - 1

const Uint31 = (value: number) => typeforce.UInt32(value) && value <= UINT31_MAX

const BIP32Path = (value: any) =>
  typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)

const ECPoint = typeforce.quacksLike('Point')

export default {
  UINT31_MAX,
  Uint31,
  BIP32Path,
  ECPoint,
  Buffer256bit: typeforce.BufferN(32),
  Hash160bit: typeforce.BufferN(20),
  Hash256bit: typeforce.BufferN(32),
}
