import Core from '@nervosnetwork/ckb-sdk-core'
import * as contrib from 'blessed-contrib'
import { screen } from 'blessed'

const { grid: Grid, table } = contrib

const MAX_BLOCKS = 50
const MAX_TRANSACTIONS = 50
let listener: any

interface ChainInfo {
  url: string
  version: string
  tipNumber: string
}
type Block = [string, string, number] // [number, hash, tx count]
type Transaction = [string, string, string] // [hash, inputs, outputs]
interface RenderedData {
  chainInfo: ChainInfo
  blocks: Block[]
  transactions: Transaction[]
}

const data: RenderedData = {
  chainInfo: {
    url: '',
    version: '',
    tipNumber: '',
  },
  blocks: [],
  transactions: [],
}

const dashboard = (core: Core) => {
  const MainScreen = screen({
    smartCSR: true,
    cursor: {
      artificial: true,
      shape: 'underline',
      blink: false,
      color: 'white',
    },
  })

  MainScreen.key(['escape', 'C-c'], () => process.exit(0))

  const Layout = new Grid({
    rows: 12,
    cols: 12,
    screen: MainScreen,
  })

  const chainInfo = Layout.set(0, 0, 2, 12, table, {
    label: 'Chain Infomation',
    fg: 'white',
    columnSpacing: 10,
    columnWidth: [30, 60, 30],
    interactive: false,
    data: {
      headers: [],
      data: [],
    },
  })

  const updateChainInfo = (info: ChainInfo) => {
    chainInfo.setData({
      headers: Object.keys(info).map(() => ''),
      data: Object.entries(info),
    })
    MainScreen.render()
  }

  const blocks = Layout.set(2, 0, 3, 12, table, {
    label: 'Block List',
    fg: 'white',
    columnSpacing: 10,
    columnWidth: [15, 66, 10],
    interactive: false,
    scrollable: true,
    data: {
      headers: [],
      data: [],
    },
  })

  const updateBlocks = (info: Block[]) => {
    blocks.setData({
      headers: ['block number', 'hash', 'tx count'],
      data: info,
    })
    MainScreen.render()
  }

  const transactions = Layout.set(5, 0, 7, 12, table, {
    label: 'Transaction List',
    fg: 'white',
    columnSpacing: 10,
    columnWidth: [66, 30, 60],
    interactive: false,
    scrollable: true,
    data: {
      headers: [],
      data: [],
    },
  })

  const updateTransactions = (info: Transaction[]) => {
    transactions.setData({
      headers: ['hash', 'inputs', 'outputs'],
      data: info,
    })
    MainScreen.render()
  }

  const fetchAndUpdateChainInfo = async () => {
    const [nodeInfo, tipNumber] = await Promise.all([core.rpc.localNodeInfo(), core.rpc.getTipBlockNumber()])
    data.chainInfo = {
      url: core.node.url,
      version: nodeInfo.version,
      tipNumber,
    }
    updateChainInfo(data.chainInfo)
  }

  const fetchAndUpdateBlock = async () => {
    const block = await core.rpc.getBlockByNumber(data.chainInfo.tipNumber)
    data.blocks = [
      [block.header.number, block.header.hash, block.transactions.length],
      ...data.blocks.slice(0, MAX_BLOCKS - 1),
    ]
    const { transactions: txs } = block
    if (txs.length) {
      const newTxs: Transaction[] = txs.map(tx => [
        tx.hash,
        JSON.stringify(tx.inputs.map(input => input.previousOutput)),
        JSON.stringify(tx.outputs.map(output => `${output.lock.args[0]}-${output.capacity}`)),
      ])
      data.transactions = [...newTxs, ...data.transactions].slice(0, MAX_TRANSACTIONS)
    }
    updateBlocks(data.blocks)
    updateTransactions(data.transactions)
  }

  const stop = () => {
    clearInterval(listener)
    MainScreen.destroy()
  }

  const start = () => {
    listener = setInterval(async () => {
      try {
        const currentTipNumber = data.chainInfo.tipNumber
        await fetchAndUpdateChainInfo()
        if (+data.chainInfo.tipNumber > +currentTipNumber) {
          fetchAndUpdateBlock()
        }
      } catch (err) {
        stop()
        console.error(err.message)
      }
    }, 500)
  }
  return {
    start,
    stop,
  }
}

export default dashboard
