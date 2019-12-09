const { default: generateRawTransaction } = require('../../lib/generateRawTransaction')
const { default: CKB } = require('../../lib')
const rpc = require('../../__mocks__/rpc')

const fixtures = require('./fixtures.json')

describe('generate raw transaction', () => {
  const ckb = new CKB('http://localhost:8114')
  ckb.rpc = rpc

  const fixtureTable = Object.entries(fixtures).map(([title, { params, expected, exception }]) => [
    title,
    params,
    expected,
    exception,
  ])

  test.each(fixtureTable)('%s', (title, params, expected, exception) => {
    if (undefined === exception) {
      let fmtParams = params
      if ('fromPublicKeyHash' in params) {
        fmtParams = {
          ...params,
          capacity: BigInt(params.capacity),
          fee: BigInt(params.fee || 0),
        }
      } else {
        fmtParams = {
          ...params,
          receivePairs: params.receivePairs.map(pair => ({
            ...pair,
            capacity: BigInt(pair.capacity),
          })),
          cells: new Map(params.cells),
          fee: BigInt(params.fee || 0),
        }
      }
      const rawTransaction = generateRawTransaction(fmtParams)
      expect(rawTransaction).toEqual(expected)
    } else {
      expect(generateRawTransaction(params)).rejects.toThrowError(exception)
    }
  })
})
