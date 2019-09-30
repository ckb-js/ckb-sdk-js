import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction from './generateRawTransaction'

import Address from './address'
import loadCells from './loadCells'

const hrpSize = 6

class Core {
  public cells: Map<string, CachedCell[]> = new Map()

  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

  public config: {
    secp256k1Dep?: DepCellInfo
  } = {}

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

    const computeScriptHashMethod = {
      name: 'computeScriptHash',
      method: '_compute_script_hash',
      paramsFormatters: [this.rpc.paramsFormatter.toScript],
    }

    /**
     * @method computeScriptHash
     * @description this RPC is used to calculate the hash of lock/type script
     * @deprecated this RPC method has been marked as deprecated in Nervos CKB Project
     */
    this.rpc.addMethod(computeScriptHashMethod)
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
    { prefix = utils.AddressPrefix.Testnet, type = utils.AddressType.HashIdx, codeHashOrCodeHashIndex = '0x00' } = {
      prefix: utils.AddressPrefix.Testnet,
      type: utils.AddressType.HashIdx,
      codeHashOrCodeHashIndex: '0x00',
    }
  ) =>
    new Address(privateKey, {
      prefix,
      type,
      codeHashOrCodeHashIndex,
    })

  public generateLockHash = (
    publicKeyHash: string,
    deps: Omit<DepCellInfo, 'outPoint'> | undefined = this.config.secp256k1Dep
  ) => {
    if (!deps) {
      throw new ArgumentRequired('deps')
    }

    return this.utils.scriptToHash({
      hashType: deps.hashType,
      codeHash: deps.codeHash,
      args: publicKeyHash,
    })
  }

  public loadSecp256k1Dep = async () => {
    /**
     * cell list
     * @link https://github.com/nervosnetwork/ckb/blob/dbadf484cea6bdba0329d58102726068be997a50/docs/hashes.toml
     */
    const block = await this.rpc.getBlockByNumber('0x0')
    if (!block) throw new Error('Cannot load the genesis block')
    const secp256k1CodeTx = block.transactions[0]
    if (!secp256k1CodeTx) throw new Error('Cannot load the transaction which has the secp256k1 code cell')
    if (!secp256k1CodeTx.outputs[1]) {
      throw new Error('Cannot load the secp256k1 cell because the specific output is not found')
    }
    if (!secp256k1CodeTx.outputs[1].type) {
      throw new Error('Secp256k1 type script not found in the cell')
    }

    const secp256k1TypeHash = this.utils.scriptToHash(secp256k1CodeTx.outputs[1].type)

    const secp256k1DepTx = block.transactions[1]
    if (!secp256k1DepTx) throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
    if (!secp256k1DepTx.outputs[0]) {
      throw new Error('Cannot load the secp256k1 dep because the specific output is not found')
    }

    this.config.secp256k1Dep = {
      hashType: 'type',
      codeHash: secp256k1TypeHash,
      outPoint: {
        txHash: secp256k1DepTx.hash,
        index: '0x0',
      },
    }
    return this.config.secp256k1Dep
  }

  public loadCells = async ({
    lockHash,
    start = 0,
    end,
    STEP = 100,
    save = false,
  }: {
    lockHash: string
    start?: string | number
    end?: string | number
    STEP?: number
    save?: boolean
  }) => {
    const cells = await loadCells({ lockHash, start, end, STEP, rpc: this.rpc })
    if (save) {
      this.cells.set(lockHash, cells)
    }
    return cells
  }

  public signWitnesses = (key: string | Address) => ({
    transactionHash,
    witnesses = [],
  }: {
    transactionHash: string
    witnesses: CKBComponents.Witness[]
  }) => {
    if (!key) throw new ArgumentRequired('Private key or address object')
    if (!transactionHash) throw new ArgumentRequired('Transaction hash')

    const addrObj = typeof key === 'string' ? this.generateAddress(key) : key
    const signedWitnesses = witnesses.map(witness => {
      const s = this.utils.blake2b(32, null, null, this.utils.PERSONAL)
      const witnessBytes = this.utils.hexToBytes(witness)
      s.update(this.utils.hexToBytes(transactionHash))
      s.update(witnessBytes)
      const message = `0x${s.digest('hex')}`
      const data = [...this.utils.hexToBytes(addrObj.signRecoverable(message)), ...witnessBytes]
      return this.utils.bytesToHex(new Uint8Array(data))
    })
    return signedWitnesses
  }

  public signTransaction = (key: string | Address) => (transaction: CKBComponents.RawTransaction) => {
    if (!key) throw new ArgumentRequired('Private key or address object')
    if (!transaction) throw new ArgumentRequired('Transaction')
    if (!transaction.witnesses) throw new ArgumentRequired('Witnesses')
    if (transaction.witnesses.length < transaction.inputs.length) throw new Error('Invalid count of witnesses')
    if (!transaction.outputsData) throw new ArgumentRequired('OutputsData')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')

    const transactionHash = this.utils.rawTransactionToHash(transaction)
    const signedWitnesses = this.signWitnesses(key)({
      transactionHash,
      witnesses: transaction.witnesses,
    })
    return {
      ...transaction,
      witnesses: signedWitnesses,
    }
  }

  public generateRawTransaction = async ({
    fromAddress,
    toAddress,
    capacity,
    safeMode = true,
    cells = [],
    deps = this.config.secp256k1Dep!,
  }: {
    fromAddress: string
    toAddress: string
    capacity: string | bigint
    safeMode: boolean
    cells: CachedCell[]
    deps: DepCellInfo
  }) => {
    const [fromPublicKeyHash, toPublicKeyHash] = [fromAddress, toAddress].map((addr: string) => {
      const addressPayload = this.utils.parseAddress(addr, 'hex')
      return `0x${addressPayload.slice(hrpSize)}`
    })

    let availableCells = cells
    if (!availableCells.length && deps) {
      const lockHash = this.utils.scriptToHash({
        codeHash: deps.codeHash,
        hashType: deps.hashType,
        args: fromPublicKeyHash,
      })
      const cachedCells = this.cells.get(lockHash)
      if (cachedCells && cachedCells.length) {
        availableCells = cachedCells
      } else {
        const fetchedCells = await this.loadCells({ lockHash, save: true })
        availableCells = fetchedCells
      }
    }

    return generateRawTransaction({
      fromPublicKeyHash,
      toPublicKeyHash,
      capacity,
      safeMode,
      cells: availableCells,
      deps,
    })
  }
}

export default Core
