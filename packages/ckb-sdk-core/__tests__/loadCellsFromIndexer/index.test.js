const { loadCellsFromIndexer } = require('../../lib/loadCellsFromIndexer')
const CellCollector = require('../../__mocks__/CellCollector')
const fixtures = require('./fixtures.json')

describe('Test load cells from indexer', () => {
  describe('Test loadCellsFromIndexer', () => {
    it('Should return cell list', async () => {
      const fixture = fixtures.loadCellsFromIndexer['should return 10 cells']
      const actual = await loadCellsFromIndexer({ ...fixture.params[0], CellCollector })
      expect(actual).toHaveLength(fixture.expected)
    })
  })
})
