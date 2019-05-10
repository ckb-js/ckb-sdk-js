const resultFmt = require('../../lib/resultFormatter').default
const { result } = require('./fixtures.json')

describe('result formatter', () => {
  it('toNumber', () => {
    result.toNumber.forEach(fixture => {
      const formatted = resultFmt.toNumber(fixture.source)
      expect(formatted).toBe(fixture.target)
    })
  })

  it('toHash', () => {
    result.toHash.forEach(fixture => {
      const formatted = resultFmt.toHash(fixture.source)
      expect(formatted).toBe(fixture.target)
    })
  })

  it('toScript', () => {
    result.toScript.forEach(fixture => {
      const formatted = resultFmt.toScript(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toOutput', () => {
    result.toOutput.forEach(fixture => {
      const formatted = resultFmt.toOutput(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toOutPoint', () => {
    result.toOutPoint.forEach(fixture => {
      const formatted = resultFmt.toOutPoint(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toTransaction', () => {
    result.toTransaction.forEach(fixture => {
      const formatted = resultFmt.toTransaction(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toTransactionWithStatus', () => {
    result.toTransactionWithStatus.forEach(fixture => {
      const formatted = resultFmt.toTransactionWithStatus(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toUncleBlock', () => {
    result.toUncleBlock.forEach(fixture => {
      const formatted = resultFmt.toUncleBlock(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toBlock', () => {
    result.toBlock.forEach(fixture => {
      const formatted = resultFmt.toBlock(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toBlockchainInfo', () => {
    result.toBlockchainInfo.forEach(fixture => {
      const formatted = resultFmt.toBlockchainInfo(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toNodeInfo', () => {
    result.toNodeInfo.forEach(fixture => {
      const formatted = resultFmt.toNodeInfo(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toTxPoolInfo', () => {
    result.toTxPoolInfo.forEach(fixture => {
      const formatted = resultFmt.toTxPoolInfo(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toPeers', () => {
    result.toPeers.forEach(fixture => {
      const formatted = resultFmt.toPeers(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toPeersState', () => {
    result.toPeersState.forEach(fixture => {
      const formatted = resultFmt.toPeersState(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toCell', () => {
    result.toCell.forEach(fixture => {
      const formatted = resultFmt.toCell(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toCellWithStatus', () => {
    result.toCellWithStatus.forEach(fixture => {
      const formatted = resultFmt.toCellWithStatus(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toCells', () => {
    result.toCells.forEach(fixture => {
      const formatted = resultFmt.toCells(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toHeader', () => {
    result.toHeader.forEach(fixture => {
      const formatted = resultFmt.toHeader(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })

  it('toEpoch', () => {
    result.toEpoch.forEach(fixture => {
      const formatted = resultFmt.toEpoch(fixture.source)
      expect(formatted).toEqual(fixture.target)
    })
  })
})
