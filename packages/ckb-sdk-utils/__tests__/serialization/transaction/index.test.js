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
const fixtures = require('./fixtures.json')

describe('Test Transaction Serialization', () => {
  describe('Serialize Version', () => {
    const fixtureTable = Object.entries(fixtures.serializeVersion).map(([title, { version, expected, exception }]) => [
      title,
      version,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, version, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeVersion(version)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeVersion(version)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize OutPoint', () => {
    const fixtureTable = Object.entries(fixtures.serializeOutPoint).map(
      ([title, { outPoint, expected, exception }]) => [title, outPoint, expected, exception]
    )

    test.each(fixtureTable)('%s', (_title, outPoint, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeOutPoint(outPoint)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeOutPoint(outPoint)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize DepType', () => {
    const fixtureTable = Object.entries(fixtures.serializeDepType).map(([title, { depType, expected, exception }]) => [
      title,
      depType,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, depType, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeDepType(depType)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeDepType(depType)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize CellDep', () => {
    const fixtureTable = Object.entries(fixtures.serializeCellDep).map(([title, { cellDep, expected, exception }]) => [
      title,
      cellDep,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%s', (_title, cellDep, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeCellDep(cellDep)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeCellDep(cellDep)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize CellDeps', () => {
    const fixtureTable = Object.entries(fixtures.serializeCellDeps).map(
      ([title, { cellDeps, expected, exception }]) => [title, cellDeps, expected, exception]
    )
    test.each(fixtureTable)('%j', (_title, cellDeps, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeCellDeps(cellDeps)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeCellDeps(cellDeps)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize HeaderDeps', () => {
    const fixtureTable = Object.entries(fixtures.serializeHeaderDeps).map(
      ([title, { headerDeps, expected, exception }]) => [title, headerDeps, expected, exception]
    )
    test.each(fixtureTable)('%j', (_title, headerDeps, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeHeaderDeps(headerDeps)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeHeaderDeps(headerDeps)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Inputs', () => {
    const fixtureTable = Object.entries(fixtures.serializeInputs).map(([title, { inputs, expected, exception }]) => [
      title,
      inputs,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%j', (_title, inputs, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeInputs(inputs)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeInputs(inputs)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Output', () => {
    const fixtureTable = Object.entries(fixtures.serializeOutput).map(([title, { output, expected, exception }]) => [
      title,
      output,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%j', (_title, output, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeOutput(output)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeOutput(output)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize Outputs', () => {
    const fixtureTable = Object.entries(fixtures.serializeOutputs).map(([title, { outputs, expected, exception }]) => [
      title,
      outputs,
      expected,
      exception,
    ])
    test.each(fixtureTable)('%j', (_title, outputs, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeOutputs(outputs)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeOutputs(outputs)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize OutputsData', () => {
    const fixtureTable = Object.entries(fixtures.serializeOutputsData).map(
      ([title, { outputsData, expected, exception }]) => [title, outputsData, expected, exception]
    )
    test.each(fixtureTable)('%j', (_title, outputsData, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeOutputsData(outputsData)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeOutputsData(outputsData)).toThrow(new Error(exception))
      }
    })
  })

  describe('Serialize RawTransaction', () => {
    const fixtureTable = Object.entries(fixtures.serializeRawTransaction).map(
      ([title, { rawTransaction, expected, exception }]) => [title, rawTransaction, expected, exception]
    )
    test.each(fixtureTable)('%j', (_title, rawTransaction, expected, exception) => {
      if (undefined !== expected) {
        expect(serializeRawTransaction(rawTransaction)).toBe(expected)
      }
      if (undefined !== exception) {
        expect(() => serializeRawTransaction(rawTransaction)).toThrow(new Error(exception))
      }
    })
  })
})
