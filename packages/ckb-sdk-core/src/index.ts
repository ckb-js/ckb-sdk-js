import RPC from '@nervosnetwork/ckb-sdk-rpc'
import Address from '@nervosnetwork/ckb-sdk-address'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

class Core {
  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

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

    const computeTransactionHashMethod = {
      name: 'computeTransactionHash',
      method: '_compute_transaction_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toRawTransaction],
    }

    /**
     * @method computeTransactionHash
     * @description this RPC is used to calculate the hash of a raw transaction
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeTransactionHashMethod)
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

  public generateAddress = (
    privateKey: string,
    { prefix = utils.AddressPrefix.Testnet, type = utils.AddressType.HashIdx, codeHashIndex = '0x00' } = {
      prefix: utils.AddressPrefix.Testnet,
      type: utils.AddressType.HashIdx,
      codeHashIndex: '0x00',
    }
  ) =>
    new Address(privateKey, {
      prefix,
      type,
      codeHashIndex,
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

  public signWitnesses = (key: string | Address) => ({
    transactionHash,
    witnesses = [],
  }: {
    transactionHash: string
    witnesses: CKBComponents.Witness[]
  }) => {
    if (!key) throw new Error('Private key or address object is required')
    if (!transactionHash) throw new Error('Transaction hash is required')

    const addrObj = typeof key === 'string' ? this.generateAddress(key) : key
    const signedWitnesses = witnesses.map(witness => {
      const oldData = witness.data || []
      const s = this.utils.blake2b(32, null, null, this.utils.PERSONAL)
      s.update(this.utils.hexToBytes(transactionHash.replace(/^0x/, '')))
      oldData.forEach(datum => {
        s.update(this.utils.hexToBytes(datum))
      })
      const message = s.digest('hex')
      const data = [`0x${addrObj.signRecoverable(message)}`, ...oldData]
      return {
        data,
      }
    })
    return signedWitnesses
  }

  public signTransaction = (key: string | Address) => async (transaction: CKBComponents.RawTransaction) => {
    if (!key) throw new Error('Private key or address object is required')
    if (!transaction) throw new Error('Transaction is required')
    if (!transaction.witnesses) throw new Error('Witnesses is required')
    if (transaction.witnesses.length < transaction.inputs.length) throw new Error('Invalid count of witnesses')
    if (!transaction.outputsData) throw new Error('OutputsData is required')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')

    const transactionHash = await (this.rpc as RPC & { computeTransactionHash: Function }).computeTransactionHash(
      transaction
    )
    const signedWitnesses = await this.signWitnesses(key)({
      transactionHash,
      witnesses: transaction.witnesses,
    })
    return {
      ...transaction,
      witnesses: signedWitnesses,
    }
  }
}

export default Core
