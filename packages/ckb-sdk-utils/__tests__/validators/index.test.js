const {
  assertToBeHexStringOrBigint,
  assertToBeSingleSigAddress,
  assertToBeSingleSigAddressPayload,
} = require('../../lib/validators')
const fixtures = require('./fixtures.json')

describe('validators', () => {
  describe('assert to be type of hex string or bigint', () => {
    const { assertToBeHexStringOrBigint: fixture } = fixtures

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

  describe('assert to be single sig address', () => {
    const { assertToBeSingleSigAddress: fixture } = fixtures

    it('single sig address should pass', () => {
      expect(assertToBeSingleSigAddress(fixture.singleSigAddress)).toBe(true)
    })

    it('address with invalid single sig payload should throw an error', () => {
      expect(() => assertToBeSingleSigAddress(fixture.addressWithInvalidSingleSigPayload)).toThrow(
        new Error(`${fixture.addressWithInvalidSingleSigPayload} is not a single signature address`)
      )
    })

    it('address has the incorrect size should throw an error', () => {
      expect(() => assertToBeSingleSigAddress(fixture.addressWithIncorrectSize)).toThrow(
        new Error(`${fixture.addressWithIncorrectSize} is not a single signature address`)
      )
    })
  })

  describe('assert to be single signature address payload', () => {
    const { assertToBeSingleSigAddressPayload: fixture } = fixtures

    it('single sig address payload should pass', () => {
      expect(assertToBeSingleSigAddressPayload(fixture.singleSigAddressPayload)).toBe(true)
    })

    it('payload not starts with 0x0100 should throw an error', () => {
      expect(() => assertToBeSingleSigAddressPayload(fixture.payloadNotStartsWith0x0100)).toThrow(
        new Error(`${fixture.payloadNotStartsWith0x0100} is not a single signature address payload`)
      )
    })

    it('payload has the incorrect size should throw an error', () => {
      expect(() => assertToBeSingleSigAddressPayload(fixture.paylaodWithIncorrectSize)).toThrow(
        new Error(`${fixture.paylaodWithIncorrectSize} is not a single signature address payload`)
      )
    })
  })
})
