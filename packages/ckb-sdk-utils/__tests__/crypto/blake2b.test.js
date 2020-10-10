const { blake2b, PERSONAL } = require('../..')
const fixtures = require('./blake2b.fixtures.json')

describe('blake2b', () => {
  it('blake2b([]) with personal', () => {
    const fixture = {
      message: new Uint8Array(),
      digest: '44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(fixture.message)
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  it('blake2b(Buffer.from("The quick brown fox jumps over the lazy dog")) with personal', () => {
    const fixture = {
      message: 'The quick brown fox jumps over the lazy dog',
      digest: 'abfa2c08d62f6f567d088d6ba41d3bbbb9a45c241a8e3789ef39700060b5cee2',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(new Uint8Array(Buffer.from(fixture.message, 'utf8')))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  test.each(fixtures)('%s', ({ outlen, out, input, key, salt, personal }) => {
    if (+outlen < 16) {
      expect(() => {
        blake2b(
          outlen,
          key ? new Uint8Array(Buffer.from(key, 'hex')) : null,
          salt ? new Uint8Array(Buffer.from(salt, 'hex')) : null,
          personal ? new Uint8Array(Buffer.from(personal, 'hex')) : null,
        )
      }).toThrowError(`Expect outlen to be at least 16, but ${outlen} received`)
    } else {
      const s = blake2b(
        outlen,
        key ? new Uint8Array(Buffer.from(key, 'hex')) : null,
        salt ? new Uint8Array(Buffer.from(salt, 'hex')) : null,
        personal ? new Uint8Array(Buffer.from(personal, 'hex')) : null,
      )
      s.update(new Uint8Array(Buffer.from(input, 'hex')))
      const digest = s.digest('hex')
      expect(digest).toBe(out)
    }
  })
})
