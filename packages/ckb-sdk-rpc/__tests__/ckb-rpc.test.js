const path = require('path')

const env = path.join(__dirname, '../.env')

const config = require('dotenv').config({
  path: env,
}).parsed

const CKBRPC = require('../lib').default

const rpc = new CKBRPC(config.RPC_URL)

describe('ckb-rpc', () => {
  it('local node info', async () => {
    const info = await rpc.localNodeInfo()
    expect(typeof info.nodeId).toBe('string')
  })

  it('get tip block number', async () => {
    const tipBlockNumber = await rpc.getTipBlockNumber()
    expect(typeof tipBlockNumber).toBe('string')
  })

  it('get block hash and get block of genesis block', async () => {
    const hash = await rpc.getBlockHash('0')
    expect(hash.length).toBe(66)
    const block = await rpc.getBlock(hash)
    expect(block.header.hash).toBe(hash)
  })

  it('get tip block number', async () => {
    const blockNumber = await rpc.getTipBlockNumber()
    expect(typeof blockNumber).toBe('string')
  })

  it.skip('send transaction', async () => {
    const hash = await rpc.sendTransaction({
      version: 0,
      deps: [],
      inputs: [],
      outputs: [],
    })
    expect(typeof hash).toBe('string')
  })

  it('get tip header', async () => {
    const header = await rpc.getTipHeader()
    expect(typeof header.hash).toBe('string')
  })

  it.skip('get transaction', async () => {
    const hash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(hash)
    const { transactions } = block
    if (transactions.length) {
      const txHash = transactions[0].hash
      const tx = await rpc.getTransaction(txHash)
      expect(tx.hash).toBe(txHash)
    } else {
      throw new Error('No transaction found')
    }
  })

  it.skip('get live cell', async () => {
    const hash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(hash)
    const { transactions } = block
    if (transactions.length) {
      const txHash = transactions[0].hash
      const outPoint = {
        hash: txHash,
        index: 0,
      }
      const cellRes = await rpc.getLiveCell(outPoint)
      expect(cellRes.status).toBe('live')
    } else {
      throw new Error('No transaction found')
    }
  })

  it('get cells by lock hash', async () => {
    const lockHash = '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674'
    const cells = await rpc.getCellsByLockHash(lockHash, '0', '100')
    expect(Array.isArray(cells)).toBeTruthy()
  })

  it.skip('trace a transaction', async () => {
    const traceHash = await rpc.traceTransaction({
      version: 0,
      deps: [],
      inputs: [],
      outputs: [],
    })
    expect(typeof traceHash).toBe('string')
    const traces = await rpc.getTransactionTrace(traceHash)
    expect(Array.isArray(traces)).toBeTruthy()
  })
})
