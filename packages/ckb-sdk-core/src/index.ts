/// <reference types="../types/global" />

import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { ParameterRequiredException, HexStringWithout0xException } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction from './generateRawTransaction'

import loadCellsFromIndexer from './loadCellsFromIndexer'
import signWitnesses, { isMap } from './signWitnesses'
import { filterCellsByInputs } from './utils'

type Key = string
type Address = string
type LockHash = string
type Capacity = bigint | string
type URL = string

interface RawTransactionParams extends RawTransactionParams.Base {
  fromAddress: Address
  toAddress: Address
  capacity: Capacity
  cells?: RawTransactionParams.Cell[]
}

interface ComplexRawTransactoinParams extends RawTransactionParams.Base {
  fromAddresses: Address[]
  receivePairs: { address: Address; capacity: Capacity; type?: CKBComponents.Script | null }[]
  cells: Map<LockHash, RawTransactionParams.Cell[]>
}

class CKB {
  public cells: Map<LockHash, RawTransactionParams.Cell[]> = new Map()

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
    args: string,
    dep: Omit<CKBComponents.Script, 'args'> | undefined = this.config.secp256k1Dep,
  ) => {
    if (!dep) {
      throw new ParameterRequiredException('deps')
    }

    return this.utils.scriptToHash({ ...dep, args })
  }

  public loadDeps = async () => {
    const genesisBlock = await this.rpc.getBlockByNumber('0x0')
    if (!genesisBlock) {
      throw new Error('Fail to load the genesis block')
    }
    this.#setDaoDep(genesisBlock)
    this.#setSecp256k1Dep(genesisBlock)
    return this.config
  }

  /**
   * @memberof Core
   * @description The method used to load cells from lumos indexer as shown in the tutorial
   * @tutorial https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransactionWithLumosCollector.js
   */
  public loadCells = async (
    params: LoadCellsParams.FromIndexer & {
      save?: boolean
    },
  ) => {
    const lockHash = this.utils.scriptToHash(params.lock)
    const cells = await loadCellsFromIndexer(params)
    if (params.save) {
      this.cells.set(lockHash, cells)
    }
    return cells
  }

  public signWitnesses = signWitnesses

  public signTransaction = (key: Key | Map<LockHash, Key>) => (
    transaction: CKBComponents.RawTransactionToSign,
    cells: Array<{ outPoint: CKBComponents.OutPoint; lock: CKBComponents.Script }> = [],
  ) => {
    if (!key) throw new ParameterRequiredException('Private key or address object')
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

  /**
   * @description Generate a raw transaction object to sign
   * @param {object} txObject, 1-1 tx or m-n tx
   * @returns rawTxToSign
   * @example 1-1 tx
   *```
   *          {
   *            fromAddress:          Address, specify the address of inputs
   *            toAddress:            Address, specify the address included in outputs
   *            capacity:             Capacity, specify the value to transfer in this tx
   * 
   *            cells?:               Array<RawTransactionParams.Cell>, provide
   *                                  live cells to generate input cells in this tx
   * 
   *            fee?:                 Fee, specify the fee or fee reconciler
   *                                  along with this tx, fee reconciler allows
   *                                  fee calculation on the fly
   * 
   *            safeMode:             boolean, specify whether to skip cell
   *                                  containing data or type script or not,
   *                                  default to be true
   * 
   *            deps:                 DepCellInfo | Array<DepCellInfo>
   *                                  specify deps included in this tx, filling
   *                                  in the `cellDeps` field of a raw tx
   * 
   *            capacityThreshold?:   Capacity, specify the minimal capacity of
   *                                  each outputs, default to be 6_100_000_000
   *                                  shannon(61 CKB) for a bare cell
   * 
   *            changeThreshold?:     Capacity, specify the minimal capacity of
   *                                  the change cell, default to be 6_100_000_000
   *                                  shannon(61 CKB) for a bare cell, useful on
   *                                  sending a tx without change by setting it 0
   * 
   *            changeLockScript?:    CKBComponents.Script, specify the change
   *                                  receiver of this tx, default to be the owner
   *                                  of the first input
   * 
   *            witnesses?:           Array<CKBComponents.WitnessArgs | CKBComponents.Witness>
   *                                  specify the witness list of this tx
   * 
   *            outputsData?:         Array<string>, specify the output data list
   *                                  of this tx
   *          }
   * ```
   * @example m-n tx
   * ```
   *          {
   *            fromAddresses:        Address[], specify the address of inputs
   * 
   *            receivePairs:         Array<{ 
   *                                    address: Address;
   *                                    capacity: Capacity;
   *                                    type?: CKBComponents.Script | null
   *                                  }>
   *                                  specify address, capacity and type lock 
   *                                  of outputs
   * 
   *            cells:                Map<LockHash, RawTransactionParams.Cell[]>
   *                                  provide live cells to generate input cells
   *                                  in this tx
   * 
   *            fee?:                 same as that in 1-1 tx
   *            safeMode:             same as that in 1-1 tx
   *            deps:                 same as that in 1-1 tx
   *            capacityThreshold?:   same as that in 1-1 tx
   *            changeThreshold?:     same as that in 1-1 tx
   *            changeLockScript?:    same as that in 1-1 tx
   *            witnesses?:           same as that in 1-1 tx
   *            outputsData?:         same as that in 1-1 tx
   *          }
   * ```
   */
  public generateRawTransaction = ({
    fee,
    safeMode = true,
    deps,
    capacityThreshold,
    changeThreshold,
    witnesses,
    outputsData,
    ...params
  }: RawTransactionParams | ComplexRawTransactoinParams) => {
    if (this.#isSimpleTransaction(params)) {
      const [inputScript, outputScript] = [params.fromAddress, params.toAddress].map(this.utils.addressToScript)

      let availableCells = params.cells || []
      if (!availableCells.length) {
        availableCells = this.cells.get(this.utils.scriptToHash(inputScript)) ?? availableCells
      }
      return generateRawTransaction({
        inputScript,
        outputScript,
        capacity: params.capacity,
        fee,
        safeMode,
        cells: availableCells,
        deps,
        capacityThreshold,
        changeThreshold,
        witnesses,
        outputsData,
      })
    }

    if (this.#isComplexTransaction(params)) {
      const inputScripts = params.fromAddresses.map(this.utils.addressToScript)
      const outputs = params.receivePairs.map(pair => ({
        lock: this.utils.addressToScript(pair.address),
        capacity: pair.capacity,
        type: pair.type,
      }))

      return generateRawTransaction({
        inputScripts,
        outputs,
        cells: params.cells || this.cells,
        fee,
        safeMode,
        deps,
        capacityThreshold,
        changeThreshold,
        witnesses,
        outputsData,
      })
    }
    throw new Error('Parameters of generateRawTransaction are invalid')
  }

  /**
   * @memberof Core
   * @description Generate a transaction to deposit capacity
   * @tutorial https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md#deposit
   */
  public generateDaoDepositTransaction = ({
    fromAddress,
    capacity,
    fee,
    cells = [],
  }: {
    fromAddress: Address
    capacity: Capacity
    fee: Capacity
    cells?: RawTransactionParams.Cell[]
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
      deps: [this.config.secp256k1Dep!, this.config.daoDep!],
    })

    rawTx.outputs[0].type = {
      codeHash: this.config.daoDep!.typeHash!,
      args: '0x',
      hashType: this.config.daoDep!.hashType,
    }

    rawTx.outputsData[0] = '0x0000000000000000'

    return rawTx
  }

  /**
   * @memberof Core
   * @description Generate a transaction to start a withdraw
   * @tutorial https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md#withdraw-phase-1
   */
  public generateDaoWithdrawStartTransaction = async ({
    outPoint,
    fee,
    cells = [],
  }: {
    outPoint: CKBComponents.OutPoint
    fee: Capacity
    cells?: RawTransactionParams.Cell[]
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
      deps: [this.config.secp256k1Dep!, this.config.daoDep!],
      capacityThreshold: '0x0',
      cells,
    })

    rawTx.outputs[0] = tx.transaction.outputs[+outPoint.index]
    rawTx.outputsData[0] = encodedBlockNumber

    rawTx.inputs.unshift({ previousOutput: outPoint, since: '0x0' })
    rawTx.headerDeps.push(depositBlockHeader.hash)
    return rawTx
  }

  /**
   * @memberof Core
   * @description Generate a transaction to finish a withdraw
   * @tutorial https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0023-dao-deposit-withdraw/0023-dao-deposit-withdraw.md#withdraw-phase-2
   */
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

    const cellStatus = await this.rpc.getLiveCell(withdrawOutPoint, true)
    if (cellStatus.status !== 'live') throw new Error('Cell is not live yet')

    const tx = await this.rpc.getTransaction(withdrawOutPoint.txHash)
    if (tx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')

    const depositBlockNumber = this.utils.bytesToHex(
      this.utils.hexToBytes(cellStatus.cell.data?.content ?? '').reverse(),
    )

    const depositBlockHeader = await this.rpc.getBlockByNumber(BigInt(depositBlockNumber)).then(block => block.header)
    const withdrawStartBlockHeader = await this.rpc.getBlock(tx.txStatus.blockHash).then(block => block.header)

    const withdrawEndEpoch = this.utils.getWithdrawEpoch(depositBlockHeader.epoch, withdrawStartBlockHeader.epoch)
    const outputCapacity = await this.rpc.calculateDaoMaximumWithdraw(depositOutPoint, withdrawStartBlockHeader.hash)
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
        { outPoint: this.config.secp256k1Dep!.outPoint, depType: this.config.secp256k1Dep!.depType },
        { outPoint: this.config.daoDep!.outPoint, depType: this.config.daoDep!.depType },
      ],
      headerDeps: [depositBlockHeader.hash, withdrawStartBlockHeader.hash],
      inputs: [
        {
          previousOutput: withdrawOutPoint,
          since: withdrawEndEpoch,
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

  public calculateDaoMaximumWithdraw = async (
      outPoint: CKBComponents.OutPoint,
      withdrawBlockHash: string
  ): Promise<string> => {
    const depositTx = await this.rpc.getTransaction(outPoint.txHash)
    if (depositTx.txStatus.status !== 'committed') throw new Error('Transaction is not committed yet')
    const depositCell = depositTx.transaction.outputs[+outPoint.index]
    const depositBlockHash = depositTx.txStatus.blockHash
    const depositHeader = await this.rpc.getHeader(depositBlockHash)
    const depositAr = this.#extracDaoData(depositHeader.dao).ar
    const withDrawHeader = await this.rpc.getHeader(withdrawBlockHash)
    const withdrawAr = this.#extracDaoData(withDrawHeader.dao).ar
    const { JSBI } = this.utils
    const occupiedCapacity = JSBI.asUintN(64, JSBI.BigInt(10200000000));
    return JSBI.add(
      JSBI.divide(
        JSBI.multiply(
          JSBI.subtract(
            JSBI.asUintN(64, JSBI.BigInt(depositCell.capacity)),
            occupiedCapacity
          ),
          JSBI.asUintN(64, JSBI.BigInt(withdrawAr))
        ),
        JSBI.asUintN(64, JSBI.BigInt(depositAr))
      ),
      occupiedCapacity
    ).toString()
  }

  #extracDaoData = (dao: CKBComponents.DAO) => {
    if (!dao.startsWith('0x')) {
      throw new HexStringWithout0xException(dao)
    }
    const value = dao.replace('0x', '');
    const toBigEndian = utils.toBigEndian;
    return {
      c: toBigEndian(`0x${value.slice(0, 8)}`),
      ar: toBigEndian(`0x${value.slice(16, 32)}`),
      s: toBigEndian(`0x${value.slice(32, 48)}`),
      u: toBigEndian(`0x${value.slice(48, 64)}`)
    }
  }

  #secp256k1DepsShouldBeReady = () => {
    if (!this.config.secp256k1Dep) {
      throw new ParameterRequiredException('Secp256k1 dep')
    }
  }

  #DAODepsShouldBeReady = () => {
    if (!this.config.daoDep) {
      throw new ParameterRequiredException('Dao dep')
    }
  }

  #validateTransactionToSign = (transaction: CKBComponents.RawTransactionToSign) => {
    if (!transaction) throw new ParameterRequiredException('Transaction')
    if (!transaction.witnesses) throw new ParameterRequiredException('Witnesses')
    if (!transaction.outputsData) throw new ParameterRequiredException('OutputsData')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')
  }

  #isSimpleTransaction = (params: any): params is RawTransactionParams => {
    return 'fromAddress' in params && 'toAddress' in params
  }

  #isComplexTransaction = (params: any): params is ComplexRawTransactoinParams => {
    return 'fromAddresses' in params && 'receivePairs' in params
  }

  #setSecp256k1Dep = async (genesisBlock: CKBComponents.Block) => {
    const secp256k1DepTxHash = genesisBlock?.transactions[1].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[1]?.type!

    const secp256k1TypeHash = this.utils.scriptToHash(typeScript)

    this.config.secp256k1Dep = {
      hashType: 'type',
      codeHash: secp256k1TypeHash,
      outPoint: {
        txHash: secp256k1DepTxHash,
        index: '0x0',
      },
      depType: 'depGroup',
    }
  }

  #setDaoDep = (genesisBlock: CKBComponents.Block) => {
    const daoDepTxHash = genesisBlock?.transactions[0].hash
    const typeScript = genesisBlock?.transactions[0]?.outputs[2]?.type!
    const data = genesisBlock?.transactions[0]?.outputsData[2]

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
      depType: 'code',
    }
  }
}

export default CKB
