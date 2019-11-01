import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import * as utils from '@nervosnetwork/ckb-sdk-utils'

import generateRawTransaction from './generateRawTransaction'

import loadCells from './loadCells'
import signWitnessGroup from './signWitnessGroup'

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
    const block = await this.rpc.getBlockByNumber('0x0')

    /* eslint-disable */
    const secp256k1DepTxHash = block?.transactions[1].hash
    const typeScript = block?.transactions[0]?.outputs[1]?.type
    /* eslint-enable */

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

  public signWitnesses = (key: string | ECPair) => ({
    transactionHash,
    witnesses = [],
  }: {
    transactionHash: string
    witnesses: (CKBComponents.WitnessArgs | CKBComponents.Witness)[]
  }) => {
    // CAUTIONS: Now we consider witnesses as a single group
    if (!key) throw new ArgumentRequired('Private key or address object')
    if (!transactionHash) throw new ArgumentRequired('Transaction hash')

    const keyPair = typeof key === 'string' ? new ECPair(key) : key
    const signedWitnesses = signWitnessGroup(keyPair, transactionHash, witnesses)
    return signedWitnesses
  }

  public signTransaction = (key: string | ECPair) => (
    transaction: CKBComponents.RawTransactionToSign,
  ) => {
    if (!key) throw new ArgumentRequired('Private key or address object')
    if (!transaction) throw new ArgumentRequired('Transaction')
    if (!transaction.witnesses) throw new ArgumentRequired('Witnesses')
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
    fee,
    safeMode = true,
    cells = [],
    deps = this.config.secp256k1Dep!,
  }: {
    fromAddress: string
    toAddress: string
    capacity: string | bigint
    fee: string | bigint
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
      fee,
      safeMode,
      cells: availableCells,
      deps,
    })
  }
}

export default Core
