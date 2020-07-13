/// <reference types="../types/global" />

import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction, { Cell, RawTransactionParamsBase } from './generateRawTransaction'

import loadCells from './loadCells'
import signWitnesses, { isMap } from './signWitnesses'
import { calculateLockEpochs, absoluteEpochSince, filterCellsByInputs } from './utils'

type Key = string
type Address = string
type LockHash = string
type PublicKeyHash = string
type Capacity = bigint | string
type URL = string
type BlockNumber = bigint | string

interface RawTransactionParams extends RawTransactionParamsBase {
  fromAddress: Address
  toAddress: Address
  capacity: Capacity
  cells?: Cell[]
}

interface ComplexRawTransactoinParams extends RawTransactionParamsBase {
  fromAddresses: Address[]
  receivePairs: { address: Address; capacity: Capacity }[]
  cells: Map<LockHash, CachedCell[]>
}

class CKB {
  public cells: Map<LockHash, CachedCell[]> = new Map()

  public rpc: RPC

  public utils = utils

  private _node: CKBComponents.Node

  public config: {
    secp256k1Dep?: DepCellInfo
    daoDep?: DepCellInfo
  } = {}

  constructor(nodeUrl: URL = 'http://localhost:8114') {
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

  public setNode(node: URL | CKBComponents.Node): CKBComponents.Node {
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

  public generateLockHash = (
    publicKeyHash: PublicKeyHash,
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

    const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type

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

    const daoDepTxHash = genesisBlock?.transactions[0].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[2]?.type
    const data = genesisBlock?.transactions[0]?.outputsData[2]

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
    start = '0x0',
    end,
    STEP = '0x64',
    save = false,
  }: {
    lockHash: LockHash
    start?: BlockNumber
    end?: BlockNumber
    STEP?: bigint | string
    save?: boolean
  }) => {
    const cells = await loadCells({ lockHash, start, end, STEP, rpc: this.rpc })
    if (save) {
      this.cells.set(lockHash, cells)
    }
    return cells
  }

  public signWitnesses = signWitnesses

  public signTransaction = (key: Key | Map<LockHash, Key>) => (
    transaction: CKBComponents.RawTransactionToSign,
    cells: CachedCell[],
  ) => {
    if (!key) throw new ArgumentRequired('Private key or address object')
    this.#validateTransactionToSign(transaction)

    const transactionHash = this.utils.rawTransactionToHash(transaction)
    const inputCells = isMap(key) ? filterCellsByInputs(cells, transaction.inputs) : undefined

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
    if (this.#isSimpleTransaction(params)) {
      const [fromPublicKeyHash, toPublicKeyHash] = [params.fromAddress, params.toAddress].map(
        this.#extractPayloadFromAddress,
      )

      let availableCells = params.cells || []
      if (!availableCells.length && deps) {
        const lockHash = this.utils.scriptToHash({
          codeHash: deps.codeHash,
          hashType: deps.hashType,
          args: toPublicKeyHash,
        })
        availableCells = this.cells.get(lockHash) ?? availableCells
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

    if (this.#isComplexTransaction(params)) {
      const fromPublicKeyHashes = params.fromAddresses.map(this.#extractPayloadFromAddress)
      const receivePairs = params.receivePairs.map(pair => ({
        publicKeyHash: this.#extractPayloadFromAddress(pair.address),
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

  public generateDaoDepositTransaction = ({
    fromAddress,
    capacity,
    fee,
    cells = [],
  }: {
    fromAddress: Address
    capacity: Capacity
    fee: Capacity
    cells?: CachedCell[]
  }) => {
    this.#secp256k1DepsShouldBeReady()
    this.#DAODepsShouldBeReady()

    const rawTx = this.generateRawTransaction({
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
    fee: Capacity
    cells?: CachedCell[]
  }) => {
    this.#secp256k1DepsShouldBeReady()
    this.#DAODepsShouldBeReady()

    const cellStatus = await this.rpc.getLiveCell(outPoint, false)
    if (cellStatus.status !== 'live') throw new Error('Cell is not live yet.')

    const tx = await this.rpc.getTransaction(outPoint.txHash)
    if (tx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')

    const depositBlockHeader = await this.rpc.getBlock(tx.txStatus.blockHash).then(b => b.header)
    const encodedBlockNumber = this.utils.toUint64Le(depositBlockHeader.number)

    const fromAddress = this.utils.bech32Address(cellStatus.cell.output.lock.args)

    const rawTx = this.generateRawTransaction({
      fromAddress,
      toAddress: fromAddress,
      capacity: '0x0',
      fee,
      safeMode: true,
      deps: this.config.secp256k1Dep!,
      capacityThreshold: '0x0',
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
    fee: Capacity
  }): Promise<CKBComponents.RawTransactionToSign> => {
    this.#secp256k1DepsShouldBeReady()
    this.#DAODepsShouldBeReady()
    const { JSBI } = this.utils

    const DAO_LOCK_PERIOD_EPOCHS = 180
    const cellStatus = await this.rpc.getLiveCell(withdrawOutPoint, true)
    if (cellStatus.status !== 'live') throw new Error('Cell is not live yet')

    const tx = await this.rpc.getTransaction(withdrawOutPoint.txHash)
    if (tx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')

    const depositBlockNumber = this.utils.bytesToHex(
      this.utils.hexToBytes(cellStatus.cell.data?.content ?? '').reverse(),
    )

    const depositBlockHeader = await this.rpc.getBlockByNumber(BigInt(depositBlockNumber)).then(block => block.header)
    const depositEpoch = this.utils.parseEpoch(depositBlockHeader.epoch)

    const withdrawBlockHeader = await this.rpc.getBlock(tx.txStatus.blockHash).then(block => block.header)
    const withdrawEpoch = this.utils.parseEpoch(withdrawBlockHeader.epoch)

    const lockEpochs = calculateLockEpochs({ withdrawEpoch, depositEpoch, DAO_LOCK_PERIOD_EPOCHS })
    const minimalSince = absoluteEpochSince({
      length: `0x${JSBI.BigInt(depositEpoch.length).toString(16)}`,
      index: `0x${JSBI.BigInt(depositEpoch.index).toString(16)}`,
      number: `0x${JSBI.add(JSBI.BigInt(depositEpoch.number), lockEpochs).toString(16)}`,
    })
    const outputCapacity = await this.rpc.calculateDaoMaximumWithdraw(depositOutPoint, withdrawBlockHeader.hash)
    const targetCapacity = JSBI.BigInt(outputCapacity)
    const targetFee = JSBI.BigInt(`${fee}`)
    if (JSBI.lessThan(targetCapacity, targetFee)) {
      throw new Error(`The fee(${targetFee}) is too big that withdraw(${targetCapacity}) is not enough`)
    }

    const outputs: CKBComponents.CellOutput[] = [
      {
        capacity: `0x${JSBI.subtract(targetCapacity, targetFee).toString(16)}`,
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
          since: minimalSince,
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

  #extractPayloadFromAddress = (address: string) => {
    const HRP_SIZE = 6
    const addressPayload = this.utils.parseAddress(address, 'hex')
    return `0x${addressPayload.slice(HRP_SIZE)}`
  }

  #secp256k1DepsShouldBeReady = () => {
    if (!this.config.secp256k1Dep) {
      throw new ArgumentRequired('Secp256k1 dep')
    }
  }

  #DAODepsShouldBeReady = () => {
    if (!this.config.daoDep) {
      throw new ArgumentRequired('Dao dep')
    }
  }

  #validateTransactionToSign = (transaction: CKBComponents.RawTransactionToSign) => {
    if (!transaction) throw new ArgumentRequired('Transaction')
    if (!transaction.witnesses) throw new ArgumentRequired('Witnesses')
    if (!transaction.outputsData) throw new ArgumentRequired('OutputsData')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')
  }

  #isSimpleTransaction = (params: any): params is RawTransactionParams => {
    return 'fromAddress' in params && 'toAddress' in params
  }

  #isComplexTransaction = (params: any): params is ComplexRawTransactoinParams => {
    return 'fromAddresses' in params && 'receivePairs' in params
  }
}

export default CKB
