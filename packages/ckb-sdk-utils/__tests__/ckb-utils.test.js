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
describe('scriptToHash', () => {
  it('scriptToHash(basic script', () => {
    const fixture = {
      script: {
        version: 0,
        binaryHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: [[1]],
      },
      lockHash: 'dade0e507e27e2a5995cf39c8cf454b6e70fa80d03c1187db7a4cb2c9eab79da',
    }
    const lockHash = ckbUtils.lockScriptToHash(fixture.script)
    expect(lockHash).toBe(fixture.lockHash)
  })
})
