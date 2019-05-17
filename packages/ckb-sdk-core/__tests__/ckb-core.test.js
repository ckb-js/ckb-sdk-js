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
        blockHash: '92968288728fc0901b2ed94611fcf668db7d15842f019674e0805dffd26dadd5',
        cell: {
          txHash: '7c77c04b904bd937bd371ab0d413ed6eb887661e2484bc198aca6934ba5ea4e3',
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
