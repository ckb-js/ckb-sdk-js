const {
  serializeArray,
  serializeStruct,
  serializeFixVec,
  serializeDynVec,
  serializeTable,
  serializeOption,
} = require('../../../lib')
const fixtures = require('./fixtures.json')

describe('Test General Serialization', () => {
  describe('Serialize Array', () => {
    const fixtureTable = fixtures.serializeArray.map(({ array, expected }) => [array, expected])
    test.each(fixtureTable)('%s => %s', (array, expected) => {
      expect(serializeArray(array)).toBe(expected)
    })
    it('thorw errors if the array is not type of string or bytes', () => {
      expect(() => serializeArray(undefined)).toThrow(
        new TypeError('The array to be serialized should by type of string or bytes')
      )
    })
  })

  describe('Serialize Struct', () => {
    const fixtureTable = fixtures.serializeStruct.map(({ struct, expected }) => [new Map(struct), expected])
    test.each(fixtureTable)('%s => %s', (struct, expected) => {
      expect(serializeStruct(struct)).toBe(expected)
    })
  })

  describe('Serialize Fixed Vector', () => {
    const fixtureTable = fixtures.serializeFixVec.map(({ fixvec, expected }) => [fixvec, expected])
    test.each(fixtureTable)('%s => %s', (fixvec, expected) => {
      expect(serializeFixVec(fixvec)).toBe(expected)
    })

    it('throw errors if the fixed vector is not an array of bytes', () => {
      expect(() => serializeFixVec(undefined)).toThrow(
        new TypeError('The fixed vector to be serialized should be a string or an array of bytes')
      )
    })
  })

  describe('Serialize Dynamic Vector', () => {
    const fixtureTable = fixtures.serializeDynVec.map(({ dynvec, expected }) => [dynvec, expected])
    test.each(fixtureTable)('%s => %s', (dynvec, expected) => {
      expect(serializeDynVec(dynvec)).toBe(expected)
    })

    it('throw errors if the dynamic vector is not an array of bytes', () => {
      expect(() => serializeDynVec(undefined)).toThrow(
        new TypeError('The dynamic vector to be serialized should be an array of bytes')
      )
    })
  })

  describe('Serialize Table', () => {
    const fixtureTable = fixtures.serializeTable.map(({ table, expected }) => [new Map(table), expected])
    test.each(fixtureTable)('%s => %s', (table, expected) => {
      expect(serializeTable(table)).toBe(expected)
    })
  })

  describe('Serialize Option', () => {
    const fixtureTable = fixtures.serializeOption.map(({ option, expected }) => [option, expected])
    test.each(fixtureTable)('%s => %s', (option, expected) => {
      expect(serializeOption(option)).toBe(expected)
    })
  })
})
