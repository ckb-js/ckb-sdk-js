const paramsFmt = require('../../lib/paramsFormatter').default
const { params } = require('./fixtures.json')

describe('params formatter', () => {
  it('toHash', () => {
    params.toHash.forEach(fixture => {
      const formatted = paramsFmt.toHash(fixture.source)
      expect(formatted).toBe(fixture.target)
    })
  })

  it('toOutPoint', () => {
    params.toOutPoint.forEach(fixture => {
      const formatted = paramsFmt.toOutPoint(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toNumber', () => {
    params.toNumber.forEach(fixture => {
      const formatted = paramsFmt.toNumber(fixture.source)
      expect(formatted).toBe(fixture.target)
    })
  })

  it('toRawTransaction', () => {
    params.toRawTransaction.forEach(fixture => {
      const formatted = paramsFmt.toRawTransaction(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })
})
