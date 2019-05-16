import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Address from '@nervosnetwork/ckb-sdk-address'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

class Core {
  public rpc: RPC

  private _node: CKBComponents.Node

  public _utils = utils

  public config = {
    systemCellInfo: {
      codeHash: '',
      outPoint: {
        blockHash: '',
        cell: {
          txHash: '',
          index: '0',
        },
      },
    },
  }

  constructor(nodeUrl: string) {
    this._node = {
      url: nodeUrl,
    }
    this.rpc = new RPC(nodeUrl)
  }

  public setNode(node: string | CKBComponents.Node): CKBComponents.Node {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this.rpc.setNode(this._node)

    return this._node
  }

  public get node(): CKBComponents.Node {
    return this._node
  }

  public get utils() {
    return this._utils
  }

  public generateAddress = (privateKey: string) =>
    new Address(privateKey, {
      prefix: utils.AddressPrefix.Mainnet,
      type: utils.AddressType.BinIdx,
      binIdx: utils.AddressBinIdx.P2PH,
    })

  public loadSystemCell = async () => {
    const block = await this.rpc.getBlockByNumber('0')
    if (!block) throw new Error('Cannot load the genesis block')
    const cellTx = block.transactions[0]
    if (!cellTx) throw new Error('Cannot load the transaction which has the system cell')
    const cell = cellTx.outputs[1]
    if (!cell) throw new Error('Cannot load the system cell')

    const s = this.utils.blake2b(32, null, null, this.utils.PERSONAL)
    s.update(this.utils.hexToBytes(cell.data.replace(/^0x/, '')))
    const codeHash = s.digest('hex')
    const outPoint = {
      blockHash: block.header.hash.replace(/^0x/, ''),
      cell: {
        txHash: cellTx.hash.replace(/^0x/, ''),
        index: '1',
      },
    }
    this.config.systemCellInfo = {
      codeHash,
      outPoint,
    }
    return this.config.systemCellInfo
  }
}

export default Core
