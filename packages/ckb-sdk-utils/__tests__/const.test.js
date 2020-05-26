const { TextDecoder } = require('util')
const { PERSONAL } = require('../lib/const')

describe('Test constants', () => {
  it('PERSONAL should be encoded ckb-default-hash', () => {
    const decoded = new TextDecoder().decode(PERSONAL)
    expect(decoded).toBe('ckb-default-hash')
  })
})
