const { serializeEpoch, parseEpoch, getWithdrawEpoch } = require('../..')
const fixtures = require('./fixtures.json')

describe('Test epochs', () => {
  describe('serialize epoch', () => {
    const fixtureTable = Object.entries(fixtures.serializeEpoch).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        const actual = serializeEpoch(...params)
        expect(actual).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('parse epoch', () => {
    const fixtureTable = Object.entries(fixtures.parseEpoch).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        const actual = parseEpoch(...params)
        expect(actual).toEqual(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })

  describe('get withdraw epoch', () => {
    const fixtureTable = Object.entries(fixtures.getWithdrawEpoch).map(([title, { params, expected, exception }]) => [
      title,
      params,
      expected,
      exception,
    ])

    test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
      expect.assertions(1)
      try {
        const actual = getWithdrawEpoch(...params)
        expect(actual).toBe(expected)
      } catch (err) {
        expect(err).toEqual(new Error(exception))
      }
    })
  })
})
