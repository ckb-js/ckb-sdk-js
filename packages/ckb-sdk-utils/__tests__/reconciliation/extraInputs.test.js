const fixtures = require('./extraInputs.fixtures.json')
const { extraInputs } = require('../../lib/reconciliation/extraInputs')

describe('Test reconciliation by extra inputs strategy', () => {
  const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
    title,
    params,
    expected,
    exception,
  ])

  test.each(fixtureTable)(`%s`, (_title, params, expected, exception) => {
    expect.assertions(1)

    if (exception) {
      expect(() => extraInputs(...params)).toThrow(exception)
    } else {
      expect(extraInputs(...params)).toEqual(expected)
    }
  })
})
