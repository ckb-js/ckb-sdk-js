const { default: ECPair } = require('../../lib/ecpair')
const { HexStringShouldStartWith0x } = require('../../lib/exceptions')
const { instantiate: instantiateFixtures } = require('./ecpare.fixtures.json')
const { sigFixtures, signRecoverableFixtures } = require('./signature.fixtures.json')
const { hexToBytes } = require('../../lib')
const { ArgumentRequired } = require('../../lib/exceptions')

describe('ECPair', () => {
  it('new ecpair', () => {
    const fixture = instantiateFixtures.basic

    const ecpair = new ECPair(hexToBytes(fixture.privateKey), {
      compressed: fixture.compressed,
    })
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toBe(fixture.privateKey)
    expect(ecpair.getPrivateKey('hex')).toBe(fixture.privateKey)
    expect(ecpair.getPrivateKey('words').words).toEqual(fixture.privateKeyWords)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
    expect(ecpair.getPublicKey('hex')).toBe(fixture.publicKey)
    expect(ecpair.getPublicKey('bytes')).toEqual(fixture.publicKeyBytes)
  })

  it('new ecpair with empty options, default compressed should be true', () => {
    const fixture = instantiateFixtures.withEmptyOption

    const ecpair = new ECPair(hexToBytes(fixture.privateKey), {})
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toEqual(fixture.privateKey)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
  })

  it('new ecpair with default options which should be { compressed: true }', () => {
    const fixture = instantiateFixtures.withDefaultOption

    const ecpair = new ECPair(hexToBytes(fixture.privateKey))
    expect(ecpair.compressed).toBe(fixture.compressed)
    expect(ecpair.privateKey).toEqual(fixture.privateKey)
    expect(ecpair.publicKey).toBe(fixture.publicKey)
  })

  it('Instantiate with an empty private key should throw an error', () => {
    expect(() => new ECPair()).toThrow(new ArgumentRequired('Private key'))
  })

  it('Instantiate with a private key without 0x should throw an error', () => {
    const privateKey = 'e79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3'
    expect(() => new ECPair(privateKey, {})).toThrow(new HexStringShouldStartWith0x(privateKey))
  })

  it('sign and verify message', () => {
    sigFixtures.forEach(fixture => {
      const ecpair = new ECPair(`0x${fixture.privkey}`)
      const sig = ecpair.sign(`0x${fixture.msg}`)
      // slice sig from 0, -2 to ignore the recovery param
      expect(sig).toBe(`0x${fixture.sig.slice(0, -2)}`)
      expect(ecpair.verify(`0x${fixture.msg}`, `0x${fixture.sig.slice(0, -2)}`)).toBe(true)
    })
  })

  it('signRecoverable', () => {
    signRecoverableFixtures.forEach(fixture => {
      const ecpair = new ECPair(`0x${fixture.privKey}`)
      const sig = ecpair.signRecoverable(`0x${fixture.msg}`)
      expect(sig).toBe(`0x${fixture.sig}`)
    })
  })
})
