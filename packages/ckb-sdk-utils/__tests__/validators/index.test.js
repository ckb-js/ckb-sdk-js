const validators = require('../../lib/validators')
const fixtures = require('./fixtures.json')

describe('validators', () => {
  describe('assert to be type of hex string or bigint', () => {
    const { assertToBeHexStringOrBigint: fixture } = fixtures
    const { assertToBeHexStringOrBigint } = validators

    it('hex string starts with 0x should pass', () => {
      expect(assertToBeHexStringOrBigint(fixture.hexStringStartsWith0x)).toBe(true)
    })

    it('hex string starts without 0x should throw an error', () => {
      expect(() => assertToBeHexStringOrBigint(fixture.hexStringStartsWithout0x)).toThrow(
        new TypeError(`Hex string ${fixture.hexStringStartsWithout0x} should start with 0x`)
      )
    })

    it('bigint should pass', () => {
      expect(assertToBeHexStringOrBigint(BigInt(fixture.bigint))).toBe(true)
    })

    it('number should throw an error', () => {
      expect(() => assertToBeHexStringOrBigint(fixture.number)).toThrow(
        new TypeError(`${fixture.number} should be type of string or bigint`)
      )
    })
  })
})
