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
    expect(state).not.toBe(undefined)
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
})

describe('send transaction', () => {
  it('send transaction', async () => {
    const blockHash = await rpc.getBlockHash('0')
    const block = await rpc.getBlock(blockHash)
    const txHash = block.transactions[0].hash
    const tx = {
      version: 0,
      deps: [],
      inputs: [
        {
          previousOutput: {
            cell: {
              txHash,
              index: 0,
            },
            blockHash,
          },
          args: [],
          since: '0',
        },
      ],
      outputs: [
        {
          lock: {
            args: [],
            codeHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
          },
          type: null,
          capacity: '1',
          data: '0x',
        },
      ],
      witnesses: [],
    }
    const hash = rpc.sendTransaction(tx)
    expect(hash).toBeTruthy()
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

  it('has 17 default rpc', () => {
    expect(rpc.methods.length).toBe(17)
  })

  it('has initialized node url of http://localhost:8114', () => {
    expect(rpc.methods[0].constructor.node.url).toBe('http://localhost:8114')
  })

  it('set node url to http://test.localhost:8114', () => {
    const url = 'http://test.localhost:8114'
    rpc.setNode({
      url,
    })
    expect(rpc.methods[0].constructor.node.url).toBe(url)
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
