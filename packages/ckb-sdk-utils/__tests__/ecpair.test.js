const ECPair = require('../lib/ecpair').default
const { sigFixtures } = require('./signature-fixtures.json')
const { hexToBytes } = require('../lib')

describe('ECPair', () => {
  it('new ecpair', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      compressed: true,
      publicKey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
    }

    const ecpair = new ECPair(hexToBytes(fixture.privateKey), {
      compressed: fixture.compressed,
    })
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toBe(fixture.privateKey)
    expect(ecpair.getPrivateKey('hex')).toBe(fixture.privateKey)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
    expect(ecpair.getPublicKey('hex')).toBe(fixture.publicKey)
  })

  it('new ecpair with empty options, default compressed should be true', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      compressed: true,
      publicKey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
    }

    const ecpair = new ECPair(hexToBytes(fixture.privateKey), {})
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toEqual(fixture.privateKey)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
  })

  it('new ecpair with default options which should be { compressed: true }', () => {
    const fixture = {
      privateKey: 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
      compressed: true,
      publicKey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
    }

    const ecpair = new ECPair(hexToBytes(fixture.privateKey))
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toEqual(fixture.privateKey)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
  })

  it('sign and verify message', () => {
    sigFixtures.forEach(fixture => {
      const ecpair = new ECPair(fixture.privkey)
      const sig = ecpair.sign(fixture.msg)
      // slice sig from 0, -2 to ignore the recovery param
      expect(sig).toBe(fixture.sig.slice(0, -2))
      expect(ecpair.verify(fixture.msg, fixture.sig.slice(0, -2))).toBe(true)
    })
  })
})
