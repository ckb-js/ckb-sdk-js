const Core = require('../lib').default

const url = 'http://localhost:8114'
const core = new Core(url)

describe('ckb-core', () => {
  const fixture = {
    empty: {
      codeHash: '',
      outPoint: {
        blockHash: '',
        cell: {
          txHash: '',
          index: '0',
        },
      },
    },
    target: {
      codeHash: '9e3b3557f11b2b3532ce352bfe8017e9fd11d154c4c7f9b7aaaa1e621b539a08',
      outPoint: {
        blockHash: 'aad9b82caa07f5989dfb8caa44927f0bab515a96ccaaceba82c7bea609fec205',
        cell: {
          txHash: 'bffab7ee0a050e2cb882de066d3dbf3afdd8932d6a26eda44f06e4b23f0f4b5a',
          index: '1',
        },
      },
    },
  }
  it('load the system cell', async () => {
    expect(core.config.systemCellInfo).toEqual(fixture.empty)

    const systemCellInfo = await core.loadSystemCell()
    expect(systemCellInfo).toEqual(fixture.target)
  })
})
