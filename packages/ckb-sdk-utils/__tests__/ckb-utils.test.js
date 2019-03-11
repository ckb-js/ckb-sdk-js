const ckbUtils = require('../lib')

describe('blake2b', () => {
  it('blake2b("") with personal', () => {
    const fixture = {
      str: '',
      digest: '44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e',
    }
    const s = ckbUtils.blake2b(32, null, null, ckbUtils.PERSONAL)
    s.update(Buffer.from(fixture.str, 'utf8'))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  it('blake2b("The quick brown fox jumps over the lazy dog") with personal', () => {
    const fixture = {
      str: 'The quick brown fox jumps over the lazy dog',
      digest: 'abfa2c08d62f6f567d088d6ba41d3bbbb9a45c241a8e3789ef39700060b5cee2',
    }
    const s = ckbUtils.blake2b(32, null, null, ckbUtils.PERSONAL)
    s.update(Buffer.from(fixture.str, 'utf8'))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })
})
describe('jsonScriptToTypeHash', () => {
  it('jsonScriptToTypeHash(basic script', () => {
    const fixture = {
      script: {
        version: 0,
        binary: [1],
        reference: '0x0000000000000000000000000000000000000000000000000000000000000000',
        signedArgs: [[1]],
        args: [[1]],
      },
      typeHash: 'afb140d0673571ed5710d220d6146d41bd8bc18a3a4ff723dad4331da5af5bb6',
    }
    const typeHash = ckbUtils.jsonScriptToTypeHash(fixture.script)
    expect(typeHash).toBe(fixture.typeHash)
  })
})
