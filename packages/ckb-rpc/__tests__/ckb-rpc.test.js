const config = require('../../../node_modules/dotenv').config().parsed

const CkbRpc = require('../lib').default

const rpc = new CkbRpc(config.RPC_URL)
// rpc.setDebugLevel(1)

describe('ckb-rpc', () => {
  'use strict'

  // getTipBlockNumber
  it('get tip block number', async () => {
    const blockNumber = await rpc.getTipBlockNumber()
    expect(typeof blockNumber).toBe('number')
  })

  // getBlockHash, getBlock
  it('get block 0', async () => {
    const block0Hash = await rpc.getBlockHash(0)
    expect(block0Hash.startsWith('0x')).toBe(true)
    expect(block0Hash.length).toBe(66)
    const block0 = await rpc.getBlock(block0Hash)
    expect(block0.hash).toBe(block0Hash)
    expect(typeof block0.header).toBe('object')
  })

  // get tip header
  it('get tip header', async () => {
    const header = await rpc.getTipHeader()
    expect(typeof header.raw).toBe('object')
    expect(typeof header.seal).toBe('object')
  })

  // get current cell
  // it('get')

})
