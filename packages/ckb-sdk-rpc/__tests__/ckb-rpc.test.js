const path = require('path')

const env = path.join(__dirname, '../.env')

const config = require('dotenv').config({
  path: env,
}).parsed

const CKBRPC = require('../lib').default
const { DebugLevel } = require('../lib/enum')

const rpc = new CKBRPC(config.RPC_URL)

describe('ckb-rpc success', () => {
  it('get blockchain info', async () => {
    const info = await rpc.getBlockchainInfo()
    expect(info).not.toBe(undefined)
  })

  it('local node info', async () => {
    const info = await rpc.localNodeInfo()
    expect(typeof info.nodeId).toBe('string')
  })

  it('get peers', async () => {
    const nodes = await rpc.getPeers()
    expect(Array.isArray(nodes)).toBeTruthy()
  })

  it('get peers state', async () => {
    const state = await rpc.getPeersState()
    expect(state).not.tobe(undefined)
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

  it('get transaction', async () => {
    const hash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(hash)
    const { transactions } = block
    if (transactions.length) {
      const txHash = transactions[0].hash
      const { transaction, txStatus } = await rpc.getTransaction(txHash)
      expect(transaction.hash).toBe(txHash)
      expect(txStatus).toEqual({
        blockHash: hash,
        status: 'committed',
      })
    } else {
      throw new Error('No transaction found')
    }
  })

  it('get live cell', async () => {
    const hash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(hash)
    const { transactions } = block
    if (transactions.length) {
      const txHash = transactions[0].hash
      const outPoint = {
        txHash,
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

describe('ckb-rpc errors', () => {
  it('throw raw error', async () => {
    expect(() => rpc.getBlock(0)).toThrow()
  })
})

describe('ckb-rpc settings and helpers', () => {
  it('set node', () => {
    const node = {
      url: 'http://localhost:8114',
    }
    rpc.setNode(node)
    expect(rpc.node).toEqual(node)
  })

  it('has 18 default rpc', () => {
    expect(rpc.methods.length).toBe(18)
  })

  it(`set debug level to ${DebugLevel.Off}`, async () => {
    const info = jest.spyOn(global.console, 'info')
    const group = jest.spyOn(global.console, 'group')
    const groupEnd = jest.spyOn(global.console, 'groupEnd')
    rpc.setDebugLevel(DebugLevel.Off)
    await rpc.getTipBlockNumber()
    expect(info).not.toHaveBeenCalled()
    expect(group).not.toHaveBeenCalled()
    expect(groupEnd).not.toHaveBeenCalled()
  })

  it(`set debug level to ${DebugLevel.On}`, async () => {
    const info = jest.spyOn(global.console, 'info')
    const group = jest.spyOn(global.console, 'group')
    const groupEnd = jest.spyOn(global.console, 'groupEnd')
    rpc.setDebugLevel(DebugLevel.On)
    await rpc.getTipBlockNumber()
    expect(info).toHaveBeenCalled()
    expect(group).toHaveBeenCalled()
    expect(groupEnd).toHaveBeenCalled()
    rpc.setDebugLevel(DebugLevel.Off)
  })
})
