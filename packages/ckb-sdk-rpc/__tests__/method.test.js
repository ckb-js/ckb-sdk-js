jest.mock('axios')
const axiosMock = require('axios')
const Method = require('../lib/method').default

describe('Test Method', () => {
  const ranNum = 1
  const id = Math.round(ranNum * 10000)
  const NODE = { url: 'http://localhost:8114' }
  const PROPERTIES = {
    name: 'method name',
    method: 'raw_method',
    paramsFormatters: [],
  }
  const method = new Method(NODE, PROPERTIES)

  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(ranNum)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
  afterEach(() => {
    axiosMock.mockClear()
  })

  it('has properties', () => {
    expect(method.name).toBe(PROPERTIES.name)
  })

  it('jsonrpc id mismatched', async () => {
    expect.assertions(1)
    axiosMock.mockResolvedValue({
      data: {
        id: id + 1,
        jsonrpc: '2.0',
        result: null,
      },
    })
    await method.call().catch(err => expect(err).toEqual(new Error(`JSONRPC id not matched`)))
  })

  it('returns with error', async () => {
    expect.assertions(1)
    axiosMock.mockResolvedValue({
      data: {
        id,
        jsonrpc: '2.0',
        error: 'mock error',
      },
    })
    await method.call().catch(err => expect(err).toEqual(new Error('"mock error"')))
  })
})
