const {
  serializeVersion,
  serializeOutPoint,
  serializeDepType,
  serializeCellDep,
  serializeCellDeps,
  serializeHeaderDeps,
  serializeInputs,
  serializeOutput,
  serializeOutputs,
  serializeOutputsData,
  serializeRawTransaction,
} = require('../../../lib/serialization/transaction')
const { InvalidHexString } = require('../../../lib/exceptions')
const fixtures = require('./fixtures.json')

describe('Test Transaction Serialization', () => {
  describe('Serialize Version', () => {
    const fixtureTable = fixtures.serializeVersion.map(({ version, expected }) => [version, expected])
    test.each(fixtureTable)('%s => %s', (version, expected) => {
      expect(serializeVersion(version)).toBe(expected)
    })

    it('throw an error if the version is not a string', () => {
      expect(() => serializeVersion(undefined)).toThrow(new InvalidHexString('undefined'))
    })
  })

  describe('Serialize OutPoint', () => {
    const fixtureTable = fixtures.serializeOutPoint.map(({ outPoint, expected }) => [outPoint, expected])

    test.each(fixtureTable)('%s => %s', (outPoint, expected) => {
      expect(serializeOutPoint(outPoint)).toBe(expected)
    })
  })

  describe('Serialize DepType', () => {
    const fixtureTable = fixtures.serializeDepType.map(({ depType, expected }) => [depType, expected])
    test.each(fixtureTable)('%s => %s', (depType, expected) => {
      expect(serializeDepType(depType)).toBe(expected)
    })

    it("throw an error if the dep type is neither of 'data' nor 'depGroup'", () => {
      expect(() => serializeDepType('unknown type')).toThrow(
        new TypeError("Dep type must be either of 'code' or 'depGroup'")
      )
    })
  })

  describe('Serialize CellDep', () => {
    const fixtureTable = fixtures.serializeCellDep.map(({ cellDep, expected }) => [cellDep, expected])
    test.each(fixtureTable)('%s => %s', (cellDep, expected) => {
      expect(serializeCellDep(cellDep)).toBe(expected)
    })
  })

  describe('Serialize CellDeps', () => {
    const fixtureTable = fixtures.serializeCellDeps.map(({ cellDeps, expected }) => [cellDeps, expected])
    test.each(fixtureTable)('%j => %s', (cellDeps, expected) => {
      expect(serializeCellDeps(cellDeps)).toBe(expected)
    })
  })

  describe('Serialize HeaderDeps', () => {
    const fixtureTable = fixtures.serializeHeaderDeps.map(({ headerDeps, expected }) => [headerDeps, expected])
    test.each(fixtureTable)('%j => %s', (headerDeps, expected) => {
      expect(serializeHeaderDeps(headerDeps)).toBe(expected)
    })
  })

  describe('Serialize Inputs', () => {
    const fixtureTable = fixtures.serializeInputs.map(({ inputs, expected }) => [inputs, expected])
    test.each(fixtureTable)('%j => %s', (inputs, expected) => {
      expect(serializeInputs(inputs)).toBe(expected)
    })
  })

  describe('Serialize Output', () => {
    const fixtureTable = fixtures.serializeOutput.map(({ output, expected }) => [output, expected])
    test.each(fixtureTable)('%j => %s', (output, expected) => {
      expect(serializeOutput(output)).toBe(expected)
    })
  })

  describe('Serialize Outputs', () => {
    const fixtureTable = fixtures.serializeOutputs.map(({ outputs, expected }) => [outputs, expected])
    test.each(fixtureTable)('%j => %s', (outputs, expected) => {
      expect(serializeOutputs(outputs)).toBe(expected)
    })
  })

  describe('Serialize OutputsData', () => {
    const fixtureTable = fixtures.serializeOutputsData.map(({ outputsData, expected }) => [outputsData, expected])
    test.each(fixtureTable)('%j => %s', (outputsData, expected) => {
      expect(serializeOutputsData(outputsData)).toBe(expected)
    })
  })

  describe('Serialize RawTransaction', () => {
    const fixtureTable = fixtures.serializeRawTransaction.map(({ rawTransaction, expected }) => [
      rawTransaction,
      expected,
    ])
    test.each(fixtureTable)('%j => %s', (rawTransaction, expected) => {
      expect(serializeRawTransaction(rawTransaction)).toBe(expected)
    })
  })
})
