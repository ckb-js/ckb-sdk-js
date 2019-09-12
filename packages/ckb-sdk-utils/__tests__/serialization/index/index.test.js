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
    const fixtureTable = Object.entries(fixtures.serializeArray).map(([title, { array, expected, exception }]) => [
      title,
      array,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, array, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeArray(array)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeArray(array)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Struct', () => {
    const fixtureTable = Object.entries(fixtures.serializeStruct).map(([title, { struct, expected, exception }]) => [
      title,
      new Map(struct),
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, struct, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeStruct(struct)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeStruct(struct)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Fixed Vector', () => {
    const fixtureTable = Object.entries(fixtures.serializeFixVec).map(([title, { fixvec, expected, exception }]) => [
      title,
      fixvec,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, fixvec, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeFixVec(fixvec)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeFixVec(fixvec)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Dynamic Vector', () => {
    const fixtureTable = Object.entries(fixtures.serializeDynVec).map(([title, { dynvec, expected, exception }]) => [
      title,
      dynvec,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, dynvec, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeDynVec(dynvec)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeDynVec(dynvec)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Table', () => {
    const fixtureTable = Object.entries(fixtures.serializeTable).map(([title, { table, expected, exception }]) => [
      title,
      new Map(table),
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, table, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeTable(table)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeTable(table)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Option', () => {
    const fixtureTable = Object.entries(fixtures.serializeOption).map(([title, { option, expected, exception }]) => [
      title,
      option,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, option, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeOption(option)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeOption(option)).toThrow(exception)
      }
    })
  })
})
