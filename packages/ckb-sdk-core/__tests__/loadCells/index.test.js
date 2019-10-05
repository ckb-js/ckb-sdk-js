const { default: loadCells } = require('../../lib/loadCells')
const rpc = require('../../__mocks__/rpc')
const fixtures = require('./fixtures.json')

describe('load cells', () => {
  const fixtureTable = Object.entries(fixtures).map(([title, { params, expectedCells, expectedCalls, exception }]) => [
    title,
    params,
    expectedCells,
    expectedCalls,
    exception,
  ])
  test.each(fixtureTable)('%s case: %j', async (_title, params, expectedCells, expectedCalls, exception) => {
    rpc.getCellsByLockHash.mockClear()
    if (undefined === exception) {
      const cells = await loadCells({
        ...params,
        rpc,
      })
      expect(cells).toHaveLength(expectedCells)
      expect(rpc.getCellsByLockHash.mock.calls).toEqual(expectedCalls)
    } else {
      expect(
        loadCells({
          ...params,
          rpc,
        })
      ).rejects.toThrowError(exception)
    }
  })

  it('parameters without rpc should throw an error', () => {
    expect(
      loadCells({
        lockHash: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
        start: '0x1',
        end: '0x12c',
        STEP: 100,
      })
    ).rejects.toThrowError('RPC object is required')
  })
})
