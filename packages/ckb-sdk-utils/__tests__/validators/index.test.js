const {
  assertToBeHexString,
  assertToBeHexStringOrBigint,
  assertToBeAddress,
  assertToBeAddressPayload,
} = require('../../lib/validators')
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

  describe('assert to be single-sig address', () => {
    const { assertToBeSingleSigAddress: fixture } = fixtures

    it('single sig address should pass', () => {
      expect(assertToBeAddress(fixture.singleSigAddress)).toBe(true)
    })

    it('address with invalid single sig payload should throw an error', () => {
      expect(() => assertToBeAddress(fixture.addressWithInvalidSingleSigPayload)).toThrow(
        new Error(`${fixture.addressWithInvalidSingleSigPayload} is not a single-sig address`),
      )
    })

    it('address has the incorrect size should throw an error', () => {
      expect(() => assertToBeAddress(fixture.addressWithIncorrectSize)).toThrow(
        new Error(`${fixture.addressWithIncorrectSize} is not a single-sig address`),
      )
    })
  })

  describe('assert to be single-sig address payload', () => {
    const { assertToBeSignleSigAddressPayload: fixture } = fixtures

    it('single sig address payload should pass', () => {
      expect(assertToBeAddressPayload(fixture.singleSigAddressPayload)).toBe(true)
    })

    it('payload not starts with 0x0100 should throw an error', () => {
      expect(() => assertToBeAddressPayload(fixture.payloadNotStartsWith0x0100)).toThrow(
        new Error(`${fixture.payloadNotStartsWith0x0100} is not a single-sig address payload`),
      )
    })

    it('payload has the incorrect size should throw an error', () => {
      expect(() => assertToBeAddressPayload(fixture.paylaodWithIncorrectSize)).toThrow(
        new Error(`${fixture.paylaodWithIncorrectSize} is not a single-sig address payload`),
      )
    })
  })
})
