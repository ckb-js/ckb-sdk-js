/// <reference types="../types/global" />

import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction, { Cell, RawTransactionParamsBase } from './generateRawTransaction'

import loadCells from './loadCells'
import signWitnesses, { isMap } from './signWitnesses'


type Key = string | ECPair

interface RawTransactionParams extends RawTransactionParamsBase {
  fromAddress: string
  toAddress: string
  capacity: bigint | string
  cells?: Cell[]
}

interface ComplexRawTransactoinParams extends RawTransactionParamsBase {
  fromAddresses: string[]
  receivePairs: {address: string, capacity: bigint | string}[],
  cells: Map<string, CachedCell[]>
}

const hrpSize = 6


class Core {
  public cells: Map<string, CachedCell[]> = new Map()

  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

  public config: {
    secp256k1Dep?: DepCellInfo
    daoDep?: DepCellInfo
  } = {}

  constructor (nodeUrl: string) {
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

  public setNode (node: string | CKBComponents.Node): CKBComponents.Node {
    if (typeof node === 'string') {
      this._node.url = node
    } else {
      this._node = node
    }

    this.rpc.setNode(this._node)

    return this._node
  }

  public get node (): CKBComponents.Node {
    return this._node
  }

  public generateLockHash = (
    publicKeyHash: string,
    deps: Omit<DepCellInfo, 'outPoint'> | undefined = this.config.secp256k1Dep,
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
    const genesisBlock = await this.rpc.getBlockByNumber('0x0')

    /* eslint-disable prettier/prettier, no-undef */
    const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type
    /* eslint-enable prettier/prettier, no-undef */

    if (!secp256k1DepTxHash) {
      throw new Error('Cannot load the transaction which has the secp256k1 dep cell')
    }

    if (!typeScript) {
      throw new Error('Secp256k1 type script not found')
    }

    const secp256k1TypeHash = this.utils.scriptToHash(typeScript)

    this.config.secp256k1Dep = {
      hashType: 'type',
      codeHash: secp256k1TypeHash,
      outPoint: {
        txHash: secp256k1DepTxHash,
        index: '0x0',
      },
    }
    return this.config.secp256k1Dep
  }

  public loadDaoDep = async () => {
    const genesisBlock = await this.rpc.getBlockByNumber('0x0')

    /* eslint-disable prettier/prettier, no-undef */
    const daoDepTxHash = genesisBlock?.transactions[0].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[2]?.type
    const data = genesisBlock?.transactions[0]?.outputsData[2]
    /* eslint-enable prettier/prettier, no-undef */

    if (!daoDepTxHash) {
      throw new Error('Cannot load the transaction which has the dao dep cell')
    }

    if (!typeScript) {
      throw new Error('DAO type script not found')
    }

    if (!data) {
      throw new Error('DAO data not found')
    }

    const typeHash = this.utils.scriptToHash(typeScript)

    const s = utils.blake2b(32, null, null, utils.PERSONAL)
    s.update(utils.hexToBytes(data))
    const codeHash = `0x${s.digest('hex')}`

    this.config.daoDep = {
      hashType: 'type',
      codeHash,
      typeHash,
      outPoint: {
        txHash: daoDepTxHash,
        index: '0x2',
      },
    }
    return this.config.daoDep
  }

  public loadCells = async ({
    lockHash,
    start = BigInt(0),
    end,
    STEP = BigInt(100),
    save = false,
  }: {
    lockHash: string
    start?: string | bigint
    end?: string | bigint
    STEP?: bigint
    save?: boolean
  }) => {
    const cells = await loadCells({ lockHash, start, end, STEP, rpc: this.rpc })
    if (save) {
      this.cells.set(lockHash, cells)
    }
    return cells
  }

  public signWitnesses = signWitnesses

  public signTransaction = (
    key: Key | Map<string, Key>
  ) => (
    transaction: CKBComponents.RawTransactionToSign,
    cells: CachedCell[]
  ) => {
    if (!key) throw new ArgumentRequired('Private key or address object')
    if (!transaction) throw new ArgumentRequired('Transaction')
    if (!transaction.witnesses) throw new ArgumentRequired('Witnesses')
    if (!transaction.outputsData) throw new ArgumentRequired('OutputsData')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')

    const transactionHash = this.utils.rawTransactionToHash(transaction)

    const inputCells = isMap(key) ? transaction.inputs.map(input => {
      const outPoint = input.previousOutput
      /* eslint-disable prettier/prettier, no-undef */
      const cell = cells.find(c => c.outPoint?.txHash === outPoint?.txHash && c.outPoint?.index === outPoint?.index)
      /* eslint-enable prettier/prettier, no-undef */
      if (!cell) {
        throw new Error(`Cell of ${JSON.stringify(outPoint)} is not found`)
      }
      return cell
    }) : undefined

    const signedWitnesses = this.signWitnesses(key)({
      transactionHash,
      witnesses: transaction.witnesses,
      inputCells,
    })
    return {
      ...transaction,
      witnesses: signedWitnesses.map(witness =>
        typeof witness === 'string' ? witness : this.utils.serializeWitnessArgs(witness),
      ),
    }
  }

  public generateRawTransaction = ({
    fee,
    safeMode = true,
    deps,
    capacityThreshold,
    changeThreshold,
    ...params
  }: RawTransactionParams | ComplexRawTransactoinParams) => {
    if ('fromAddress' in params && 'toAddress' in params) {
      let availableCells = params.cells || []
      const [fromPublicKeyHash, toPublicKeyHash] = 
        [params.fromAddress, params.toAddress].map(this.extractPayloadFromAddress)
      if (!availableCells.length && deps) {
        const lockHash = this.utils.scriptToHash({
          codeHash: deps.codeHash,
          hashType: deps.hashType,
          args: toPublicKeyHash,
        })
        const cachedCells = this.cells.get(lockHash)
        if (cachedCells && cachedCells.length) {
          availableCells = cachedCells
        }
      }
      return generateRawTransaction({
        fromPublicKeyHash,
        toPublicKeyHash,
        capacity: params.capacity,
        fee,
        safeMode,
        cells: availableCells,
        deps,
        capacityThreshold,
        changeThreshold,
      })
    }

    if ('fromAddresses' in params && 'receivePairs' in params) {
      const fromPublicKeyHashes = params.fromAddresses.map(this.extractPayloadFromAddress)
      const receivePairs = params.receivePairs.map(pair => ({
        publicKeyHash: this.extractPayloadFromAddress(pair.address),
        capacity: pair.capacity,
      }))
      return generateRawTransaction({
        fromPublicKeyHashes,
        receivePairs,
        cells: params.cells || this.cells,
        fee,
        safeMode,
        deps,
        capacityThreshold,
        changeThreshold,
      })
    }
    throw new Error('Parameters of generateRawTransaction are invalid')
  }

  public generateDaoDepositTransaction = async ({
    fromAddress,
    capacity,
    fee,
    cells = [],
  }: {
    fromAddress: string
    capacity: bigint
    fee: bigint
    cells?: CachedCell[]
  }) => {
    if (!this.config.daoDep) {
      await this.loadDaoDep()
    }

    if (!this.config.secp256k1Dep) {
      await this.loadSecp256k1Dep()
    }

    const rawTx = await this.generateRawTransaction({
      fromAddress,
      toAddress: fromAddress,
      capacity,
      fee,
      safeMode: true,
      cells,
      deps: this.config.secp256k1Dep!,
    })

    rawTx.outputs[0].type = {
      codeHash: this.config.daoDep!.typeHash!,
      args: '0x',
      hashType: this.config.daoDep!.hashType,
    }

    rawTx.outputsData[0] = '0x0000000000000000'

    rawTx.cellDeps.push({
      outPoint: this.config.daoDep!.outPoint,
      depType: 'code',
    })
    rawTx.witnesses.unshift({ lock: '', inputType: '', outputType: '' })

    return rawTx
  }

  public generateDaoWithdrawStartTransaction = async ({
    outPoint,
    fee,
    cells = [],
  }: {
    outPoint: CKBComponents.OutPoint
    fee: bigint | string
    cells?: CachedCell[]
  }) => {
    if (!this.config.secp256k1Dep) {
      await this.loadSecp256k1Dep()
    }
    if (!this.config.daoDep) {
      await this.loadDaoDep()
    }

    const cellStatus = await this.rpc.getLiveCell(outPoint, false)
    if (cellStatus.status !== 'live') throw new Error('Cell is not live yet.')

    const tx = await this.rpc.getTransaction(outPoint.txHash)
    if (tx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')

    const depositBlockHeader = await this.rpc.getBlock(tx.txStatus.blockHash).then(b => b.header)
    const encodedBlockNumber = this.utils.toHexInLittleEndian(depositBlockHeader.number, 8)

    const fromAddress = this.utils.bech32Address(cellStatus.cell.output.lock.args)

    const rawTx = await this.generateRawTransaction({
      fromAddress,
      toAddress: fromAddress,
      capacity: '0x0',
      fee,
      safeMode: true,
      deps: this.config.secp256k1Dep!,
      capacityThreshold: BigInt(0),
      cells,
    })

    rawTx.outputs.splice(0, 1)
    rawTx.outputsData.splice(0, 1)

    rawTx.inputs.unshift({ previousOutput: outPoint, since: '0x0' })
    rawTx.outputs.unshift(tx.transaction.outputs[+outPoint.index])
    rawTx.cellDeps.push({ outPoint: this.config.daoDep!.outPoint, depType: 'code' })
    rawTx.headerDeps.push(depositBlockHeader.hash)
    rawTx.outputsData.unshift(encodedBlockNumber)
    rawTx.witnesses.unshift({
      lock: '',
      inputType: '',
      outputType: '',
    })
    return rawTx
  }

  public generateDaoWithdrawTransaction = async ({
    depositOutPoint,
    withdrawOutPoint,
    fee,
  }: {
    depositOutPoint: CKBComponents.OutPoint
    withdrawOutPoint: CKBComponents.OutPoint
    fee: bigint | string
  }): Promise<CKBComponents.RawTransactionToSign> => {
    if (!this.config.secp256k1Dep) {
      await this.loadSecp256k1Dep()
    }
    if (!this.config.daoDep) {
      await this.loadDaoDep()
    }

    const DAO_LOCK_PERIOD_EPOCHS = 180
    const cellStatus = await this.rpc.getLiveCell(withdrawOutPoint, true)
    if (cellStatus.status !== 'live') throw new Error('Cell is not live yet')

    const tx = await this.rpc.getTransaction(withdrawOutPoint.txHash)
    if (tx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')

    /* eslint-disable */
    const depositBlockNumber = this.utils.bytesToHex(
      this.utils.hexToBytes(cellStatus.cell.data?.content ?? '').reverse(),
    )
    /* eslint-enable */

    const depositBlockHeader = await this.rpc.getBlockByNumber(BigInt(depositBlockNumber)).then(block => block.header)
    const depositEpoch = this.utils.parseEpoch(depositBlockHeader.epoch)

    const withdrawBlockHeader = await this.rpc.getBlock(tx.txStatus.blockHash).then(block => block.header)
    const withdrawEpoch = this.utils.parseEpoch(withdrawBlockHeader.epoch)

    const withdrawFraction = BigInt(withdrawEpoch.index) * BigInt(depositEpoch.length)
    const depositFraction = BigInt(depositEpoch.index) * BigInt(withdrawEpoch.length)
    let depositedEpochs = BigInt(withdrawEpoch.number) - BigInt(depositEpoch.number)
    if (withdrawFraction > depositFraction) {
      depositedEpochs += BigInt(1)
    }
    const lockEpochs =
      ((depositedEpochs + BigInt(DAO_LOCK_PERIOD_EPOCHS - 1)) / BigInt(DAO_LOCK_PERIOD_EPOCHS)) *
      BigInt(DAO_LOCK_PERIOD_EPOCHS)
    const minimalSince = this.absoluteEpochSince({
      length: BigInt(depositEpoch.length),
      index: BigInt(depositEpoch.index),
      number: BigInt(BigInt(depositEpoch.number) + lockEpochs),
    })
    const outputCapacity = await this.rpc.calculateDaoMaximumWithdraw(depositOutPoint, withdrawBlockHeader.hash)
    const targetCapacity = BigInt(outputCapacity)
    const targetFee = BigInt(fee)
    if (targetCapacity < targetFee) {
      throw new Error(`The fee(${targetFee}) is too big that withdraw(${targetCapacity}) is not enough`)
    }

    const outputs: CKBComponents.CellOutput[] = [
      {
        capacity: `0x${(targetCapacity - targetFee).toString(16)}`,
        lock: tx.transaction.outputs[+withdrawOutPoint.index].lock,
      },
    ]

    const outputsData = ['0x']

    return {
      version: '0x0',
      cellDeps: [
        { outPoint: this.config.secp256k1Dep!.outPoint, depType: 'depGroup' },
        { outPoint: this.config.daoDep!.outPoint, depType: 'code' },
      ],
      headerDeps: [depositBlockHeader.hash, withdrawBlockHeader.hash],
      inputs: [
        {
          previousOutput: withdrawOutPoint,
          since: `0x${minimalSince.toString(16)}`,
        },
      ],
      outputs,
      outputsData,
      witnesses: [
        {
          lock: '',
          inputType: '0x0000000000000000',
          outputType: '',
        },
      ],
    }
  }

  private absoluteEpochSince = ({
    length,
    index,
    number,
  }: {
    length: bigint
    index: bigint
    number: bigint
  }): bigint => {
    const epochSince = (BigInt(0x20) << BigInt(56)) + (length << BigInt(40)) + (index << BigInt(24)) + number
    return epochSince
  }

  private extractPayloadFromAddress = (address: string) => {
    const addressPayload = this.utils.parseAddress(address, 'hex')
    return `0x${addressPayload.slice(hrpSize)}`
  }
}

export default Core
