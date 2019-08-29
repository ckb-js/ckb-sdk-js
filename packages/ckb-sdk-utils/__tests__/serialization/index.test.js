const ckbUtils = require('../../lib')
const fixtures = require('./fixtures.json')

const { serializeHash, serializeArg, serializeArgs, serializeCodeHash, serializeHashType, serializeScript } = ckbUtils

describe('Serialize Arg and Hash', () => {
  const fixtureTable = fixtures.serializeArg.map(({ arg, expected }) => [arg, expected])
  test.each(fixtureTable)('%j => %s', (arg, expected) => {
    expect(serializeArg(arg)).toBe(expected)
    expect(serializeHash(arg)).toBe(expected)
  })
})

describe('Serialize Args', () => {
  const fixtureTable = fixtures.serializeArgs.map(({ args, expected }) => [args, expected])
  test.each(fixtureTable)('%j => %s', (args, expected) => {
    expect(serializeArgs(args)).toBe(expected)
  })
})

describe('Serialize CodeHash', () => {
  const fixtureTable = fixtures.serializeCodeHash.map(({ codeHash, expected }) => [codeHash, expected])
  test.each(fixtureTable)('%s => %s', (codeHash, expected) => {
    expect(serializeCodeHash(codeHash)).toBe(expected)
  })
})

describe('Serialize HashType', () => {
  const fixtureTable = fixtures.serializeHashType.map(({ hashType, expected }) => [hashType, expected])
  test.each(fixtureTable)('%s => %s', (hashType, expected) => {
    expect(serializeHashType(hashType)).toBe(expected)
  })

  it('throw errors if hash type is neither data nor type', () => {
    expect(() => serializeHashType('unknown')).toThrow(new TypeError("Hash type must be either of 'data' or 'type'"))
  })
})

describe('Serialize Script', () => {
  const fixtureTable = fixtures.serializeScript.map(({ script, expected }) => [script, expected])
  test.each(fixtureTable)('%j => %s', (script, expected) => {
    expect(serializeScript(script)).toBe(expected)
  })

  it('throw errors if the script is not passed into the method', () => {
    expect(() => serializeScript()).toThrow(new Error('Script is required'))
  })
})
