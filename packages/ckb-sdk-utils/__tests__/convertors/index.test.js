const {
  toUint16Le,
  toUint32Le,
  toUint64Le,
  hexToBytes,
  bytesToHex,
  utf8ToHex,
  hexToUtf8,
  toHexInLittleEndian,
} = require('../../lib/convertors')
const { HexStringWithout0xException } = require('../../lib/exceptions')

const {
  uint16Le: uint16LeFixture,
  uint32Le: uint32LeFixture,
  uint64Le: uint64LeFixture,
  hexToBytes: hexToBytesFixture,
  bytesToHex: bytesToHexFixture,
  utf8ToHex: utf8ToHexFixture,
  hexToUtf8: hexToUtf8Fixture,
  toHexInLittleEndian: toHexInLittleEndianFixture,
} = require('./fixtures.json')

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

describe('hex to bytes', () => {
  const fixtureTable = hexToBytesFixture.map(({ hex, expected }) => [hex, expected])
  test.each(fixtureTable)('%s => %j', (hex, exptected) => {
    expect(hexToBytes(hex).join(',')).toBe(exptected.join(','))
  })

  it('hex string without 0x should throw an error', () => {
    expect(() => hexToBytes('abcd12')).toThrow(new HexStringWithout0xException('abcd12'))
  })
})

describe('bytes to hex', () => {
  const fixtureTable = bytesToHexFixture.map(({ bytes, expected }) => [bytes, expected])
  test.each(fixtureTable)('%j => %s', (bytes, expected) => {
    expect(bytesToHex(bytes)).toEqual(expected)
  })
})

describe('utf8 to hex', () => {
  const fixtureTable = utf8ToHexFixture.map(({ utf8, expected }) => [utf8, expected])
  test.each(fixtureTable)('%s => %s', (utf8, expected) => {
    expect(utf8ToHex(utf8)).toBe(expected)
  })
})

describe('hex to utf8', () => {
  const fixtureTable = hexToUtf8Fixture.map(({ hex, expected }) => [hex, expected])
  test.each(fixtureTable)('%s => %s', (hex, expected) => {
    expect(hexToUtf8(hex)).toBe(expected)
  })

  it('hex string without 0x should throw an error', () => {
    expect(() => hexToBytes('abcd')).toThrow(new HexStringWithout0xException('abcd'))
  })
})

describe('Test toHexInLittleEndian', () => {
  const fixtureTable = toHexInLittleEndianFixture.map(({ value, expected }) => [
    typeof value === 'number' ? BigInt(value) : value,
    expected,
  ])
  test.each(fixtureTable)('%s => %s', (value, expected) => {
    expect(toHexInLittleEndian(value)).toBe(expected)
  })
  it('hex string without 0x should throw an error', () => {
    expect(() => toHexInLittleEndian('123')).toThrow(new HexStringWithout0xException('123'))
  })
  it('throw an error when received a input unable to be converted into a number', () => {
    expect(() => toHexInLittleEndian('invalid number')).toThrow(new HexStringWithout0xException('invalid number'))
  })
})
