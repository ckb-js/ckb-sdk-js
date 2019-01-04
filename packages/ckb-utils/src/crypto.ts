const createHash = require('create-hash')

enum HASH_FUNC {
  RIPEMD160 = 'rmd160',
  SHA1 = 'sha1',
  SHA256 = 'sha256',
  HASH160 = 'hash160',
  HASH256 = 'hash256',
}

const ripemd160 = (buffer: Buffer) =>
  createHash(HASH_FUNC.RIPEMD160)
    .update(buffer)
    .digest()

const sha1 = (buffer: Buffer) =>
  createHash(HASH_FUNC.SHA1)
    .update(buffer)
    .digest()

const sha256 = (buffer: Buffer) =>
  createHash(HASH_FUNC.SHA256)
    .update(buffer)
    .digest()

const hash160 = (buffer: Buffer) => ripemd160(sha256(buffer))
const hash256 = (buffer: Buffer) => sha256(sha256(buffer))

export default {
  ripemd160,
  sha1,
  sha256,
  hash160,
  hash256,
}
