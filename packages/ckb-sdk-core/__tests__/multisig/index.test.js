const { serializeMultisigConfig, hashMultisig, getMultisigStatus, isMultisigConfig } = require('../../lib/multisig')
const fixtures = require('./fixtures.json')

describe('test serializeMultisigConfig', () => {
  const serializeMultisigConfigTable = Object.entries(fixtures.serializeMultisigConfig).map(
    ([title, { config, expected, exception }]) => [
      title,
      config,
      exception,
      expected
    ],
  )
  test.each(serializeMultisigConfigTable)(
    '%s',
    (_title, config, exception, expected) => {
      if (exception !== undefined) {
        expect(() =>serializeMultisigConfig(config)).toThrowError(exception)
      } else {
        const result = serializeMultisigConfig(config)
        expect(result).toEqual(expected)
      }
    },
  )
})
describe('test hashMultisig', () => {
  const hashMultisigTable = Object.entries(fixtures.hashMultisig).map(
    ([title, { config, expected, exception }]) => [
      title,
      config,
      exception,
      expected
    ],
  )

  test.each(hashMultisigTable)(
    '%s',
    (_title, config, exception, expected) => {
      if (exception !== undefined) {
        expect(() => hashMultisig(config)).toThrowError(exception)
      } else {
        const result = hashMultisig(config)
        expect(result).toEqual(expected)
      }
    },
  )
})
describe('test getMultisigStatus', () => {
  const table = Object.entries(fixtures.getMultisigStatus).map(
    ([title, { config, signatures, expected, exception }]) => [
      title,
      config,
      signatures,
      exception,
      expected
    ],
  )

  test.each(table)(
    '%s',
    (_title, config, signatures, exception, expected) => {
      if (exception !== undefined) {
        expect(() =>getMultisigStatus(config, signatures)).toThrowError(exception)
      } else {
        const result = getMultisigStatus(config, signatures)
        expect(result).toEqual(expected)
      }
    },
  )
})
describe('test isMultisigConfig', () => {
  const table = Object.entries(fixtures.isMultisigConfig).map(
    ([title, { config, expected }]) => [
      title,
      config,
      expected
    ],
  )

  test.each(table)(
    '%s',
    (_title, config, expected) => {
      expect(isMultisigConfig(config)).toEqual(expected)
    },
  )
})