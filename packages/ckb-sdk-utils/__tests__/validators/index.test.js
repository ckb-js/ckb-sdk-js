const { assertToBeHexString, assertToBeHexStringOrBigint } = require('../../lib/validators')
const fixtures = require('./fixtures.json')

describe('validators', () => {
  describe('assert to be type of hex string', () => {
    const { assertToBeHexString: fixture } = fixtures

    it('valid hex string', () => {
      expect(assertToBeHexString(fixture.validHexString)).toBe(true)
    })

    it('string without 0x should fail', () => {
      expect(() => assertToBeHexString(fixture.stringWithout0x)).toThrow(
        new Error(`${fixture.stringWithout0x} is an invalid hex string`),
      )
    })

    it('invalid number should fail', () => {
      expect(() => assertToBeHexString(fixture.invalidNumber)).toThrow(
        new Error(`${fixture.invalidNumber} is an invalid hex string`),
      )
    })

    it('value which is not a string should fail', () => {
      expect(() => assertToBeHexString(fixture.notString)).toThrow(
        new Error(`${fixture.notString} is an invalid hex string`),
      )
    })
  })

  describe('assert to be type of hex string or bigint', () => {
    const { assertToBeHexStringOrBigint: fixture } = fixtures

    it('hex string starts with 0x should pass', () => {
      expect(assertToBeHexStringOrBigint(fixture.hexStringStartsWith0x)).toBe(true)
    })

    it('hex string starts without 0x should throw an error', () => {
      expect(() => assertToBeHexStringOrBigint(fixture.hexStringStartsWithout0x)).toThrow(
        new TypeError(`Hex string ${fixture.hexStringStartsWithout0x} should start with 0x`),
      )
    })

    it('bigint should pass', () => {
      expect(assertToBeHexStringOrBigint(BigInt(fixture.bigint))).toBe(true)
    })

    it('number should throw an error', () => {
      expect(() => assertToBeHexStringOrBigint(fixture.number)).toThrow(
        new TypeError(`${fixture.number} should be type of string or bigint`),
      )
    })
  })
})
