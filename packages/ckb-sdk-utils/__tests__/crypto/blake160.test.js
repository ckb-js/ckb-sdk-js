const { blake160 } = require('../..')

describe('blake160', () => {
  it('blake160', () => {
    const fixture = {
      message: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      digest: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const digest = blake160(new Uint8Array(Buffer.from(fixture.message, 'hex')), 'hex')
    expect(digest).toBe(fixture.digest)
  })
})
