const {
  serializeArgs,
  serializeCodeHash,
  serializeHashType,
  serializeScript,
} = require('../../../lib/serialization/script')
const fixtures = require('./fixtures.json')

describe('Test Script Serialization', () => {
  describe('Serialize Args', () => {
    const fixtureTable = Object.entries(fixtures.serializeArgs).map(([title, { args, expected, exception }]) => [
      title,
      args,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, args, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeArgs(args)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeArgs(args)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize CodeHash', () => {
    const fixtureTable = Object.entries(fixtures.serializeCodeHash).map(
      ([title, { codeHash, expected, exception }]) => [title, codeHash, expected, exception]
    )
    test.each(fixtureTable)('%s', (_title, codeHash, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeCodeHash(codeHash)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeCodeHash(codeHash)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize HashType', () => {
    const fixtureTable = Object.entries(fixtures.serializeHashType).map(
      ([title, { hashType, expected, exception }]) => [title, hashType, expected, exception]
    )
    test.each(fixtureTable)('%s', (_title, hashType, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeHashType(hashType)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeHashType(hashType)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Script', () => {
    const fixtureTable = Object.entries(fixtures.serializeScript).map(([title, { script, expected, exception }]) => [
      title,
      script,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, script, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeScript(script)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeScript(script)).toThrow(new Error(exception))
      }
    })
  })
})
