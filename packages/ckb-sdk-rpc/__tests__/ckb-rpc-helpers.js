const path = require('path')
const http = require('http')
const https = require('https')

const env = path.join(__dirname, '../.env')

const config = require('dotenv').config({
  path: env,
}).parsed

const CKBRPC = require('../lib').default
const { DebugLevel } = require('../lib/enum')

const rpc = new CKBRPC(config.RPC_URL)
describe('ckb-rpc settings and helpers', () => {
  const info = jest.spyOn(global.console, 'info')
  const group = jest.spyOn(global.console, 'group')
  const groupEnd = jest.spyOn(global.console, 'groupEnd')

  it(`set debug level to ${DebugLevel.Off}`, async () => {
    rpc.setDebugLevel(DebugLevel.Off)
    await rpc.getPeers()
    expect(info).not.toHaveBeenCalled()
    expect(group).not.toHaveBeenCalled()
    expect(groupEnd).not.toHaveBeenCalled()
  })

  it(`set debug level to ${DebugLevel.On}`, async () => {
    rpc.setDebugLevel(DebugLevel.On)
    await rpc.getPeers()
    expect(info).toHaveBeenCalled()
    expect(group).toHaveBeenCalled()
    expect(groupEnd).toHaveBeenCalled()
    rpc.setDebugLevel(DebugLevel.Off)
  })

  it('set node url', () => {
    const node = {
      url: 'http://localhost:8114',
    }
    rpc.setNode(node)
    expect(rpc.node).toEqual(node)
  })

  it('set http agent', () => {
    const httpAgent = new http.Agent()
    const node = {
      httpAgent,
    }
    rpc.setNode(node)
    expect(rpc.node.httpAgent).toBeDefined()
  })

  it('set https agent', () => {
    const httpsAgent = new https.Agent()
    const node = {
      httpsAgent,
    }
    rpc.setNode(node)
    expect(rpc.node.httpsAgent).toBeDefined()
  })

  it('has 29 default rpc', () => {
    expect(rpc.methods.length).toBe(29)
  })

  it('set node url to http://test.localhost:8114', () => {
    const url = 'http://test.localhost:8114'
    rpc.setNode({
      url,
    })
    expect(rpc.node.url).toBe(url)
  })
})
