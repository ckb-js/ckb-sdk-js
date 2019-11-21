const groupInputs = require('../../lib/groupInputs').default
const fixture = require('./fixtures.json')

describe(`test group inputs`, () => {
  const fixtureTable = Object.entries(fixture).map(([title, { cells, expected }]) => [title, cells, expected])
  test.each(fixtureTable)('%s', (_title, cells, expected) => {
    const groups = groupInputs(cells)
    expect(groups).toEqual(new Map(expected))
  })
})
