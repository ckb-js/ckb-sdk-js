const { toUint16Le, toUint32Le, toUint64Le } = require('../../lib/convertors')

const { uint16Le: uint16LeFixture, uint32Le: uint32LeFixture, uint64Le: uint64LeFixture } = require('./fixtures.json')

describe('Test toUint16Le', () => {
  const fixtureTable = uint16LeFixture.map(({ value, expected, exception }) => [value, expected, exception])
  test.each(fixtureTable)(`%s => %s ? %s`, (value, expected, exception) => {
    if (exception) {
      expect(() => toUint16Le(value)).toThrow(exception)
    } else {
      const actualFromStr = toUint16Le(value)
      const actualFromBigInt = toUint16Le(BigInt(value))
      expect(actualFromStr).toBe(expected)
      expect(actualFromBigInt).toBe(expected)
    }
  })
})

describe('Test toUint32Le', () => {
  const fixtureTable = uint32LeFixture.map(({ value, expected, exception }) => [value, expected, exception])
  test.each(fixtureTable)(`%s => %s ? %s`, (value, expected, exception) => {
    if (exception) {
      expect(() => toUint32Le(value)).toThrow(exception)
    } else {
      const actualFromStr = toUint32Le(value)
      const actualFromBigInt = toUint32Le(BigInt(value))
      expect(actualFromStr).toBe(expected)
      expect(actualFromBigInt).toBe(expected)
    }
  })
})

describe('Test toUint64Le', () => {
  const fixtureTable = uint64LeFixture.map(({ value, expected, exception }) => [value, expected, exception])
  test.each(fixtureTable)(`%s => %s ? %s`, (value, expected, exception) => {
    if (exception) {
      expect(() => toUint64Le(value)).toThrow(exception)
    } else {
      const actualFromStr = toUint64Le(value)
      const actualFromBigInt = toUint64Le(BigInt(value))
      expect(actualFromStr).toBe(expected)
      expect(actualFromBigInt).toBe(expected)
    }
  })
})
