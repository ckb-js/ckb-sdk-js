import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import RPC from '@nervosnetwork/ckb-sdk-rpc'
import { AddressOptions } from '@nervosnetwork/ckb-sdk-utils/lib/address'

import {
  blake160,
  rawTransactionToHash,
  scriptToHash,
  pubkeyToAddress,
  AddressPrefix,
  AddressType,
} from '@nervosnetwork/ckb-sdk-utils'

import loadCells, { Cell } from './loadCells'
import signWitnesses from './signWitnesses'

interface Deps {
  hashType: CKBComponents.ScriptHashType
  codeHash: CKBComponents.Hash256
  outPoint: CKBComponents.OutPoint
}

const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

class Address extends ECPair {
  public rpc: RPC | undefined = undefined

  public cells: Cell[] = []

  public value = ''

  public publicKeyHash = ''

  public deps: Deps | undefined = undefined

  public constructor(
    sk: Uint8Array | string,
    {
      addressAlgorithm = pubkeyToAddress,
      prefix = AddressPrefix.Testnet,
      type = AddressType.HashIdx,
      codeHashIndex = '0x00',
    }: Partial<
      {
        addressAlgorithm: Function
      } & AddressOptions
    > = {
      addressAlgorithm: pubkeyToAddress,
      prefix: AddressPrefix.Testnet,
      type: AddressType.HashIdx,
      codeHashIndex: '0x00',
    },
    rpc?: RPC,
    deps?: Deps
  ) {
    super(sk)
    this.value = addressAlgorithm(this.publicKey, {
      prefix,
      type,
      codeHashIndex,
    })
    this.publicKeyHash = `0x${blake160(this.publicKey as string, 'hex')}`
    if (rpc) {
      this.rpc = rpc
    }
    if (deps) {
      this.deps = deps
    }
  }

  public loadCells = async (
    {
      start = 0,
      end,
      STEP = 100,
      save = true,
    }: {
      start?: string | number
      end?: string | number
      STEP?: number
      save?: boolean
    } = {
      start: 0,
      STEP: 100,
      save: true,
    }
  ) => {
    if (!this.rpc) {
      throw new Error('The rpc is not initialized')
    }

    if (!this.deps) {
      throw new Error('The deps is not loaded')
    }

    const lockScript: CKBComponents.Script = {
      codeHash: this.deps.codeHash,
      hashType: this.deps.hashType,
      args: [this.publicKeyHash],
    }
    const lockHash = scriptToHash(lockScript)
    const cells = await loadCells({ lockHash, start, end, STEP, rpc: this.rpc })

    if (save) {
      this.cells = cells
    }
    return cells
  }

  public generateRawTransaction = async ({
    toPublicKeyHash,
    capacity = '600000',
    safeMode = true,
    cells: unspentCells = this.cells,
  }: {
    fromPublicKeyHash: string
    toPublicKeyHash: string
    capacity: bigint | string
    safeMode: boolean
    cells: Cell[]
  }) => {
    if (!this.deps) {
      throw new Error('The deps is not loaded')
    }
    const targetCapacity = typeof capacity !== 'bigint' ? BigInt(capacity) : capacity

    const lockScript = {
      codeHash: this.deps.codeHash,
      hashType: this.deps.hashType,
      args: [this.publicKeyHash],
    }

    /**
     * the new cell for next owner
     */
    const toOutput = {
      capacity: targetCapacity,
      lock: {
        hashType: this.deps.hashType,
        codeHash: this.deps.codeHash,
        args: [toPublicKeyHash],
      },
    }

    /**
     * the new cell as a change
     */
    const changeOutput = {
      capacity: BigInt(0),
      lock: lockScript,
    }

    if (!unspentCells.length) {
      await this.loadCells()
    }
    if (!unspentCells.length) {
      throw new Error('No available cells found in the cell map, please make sure the loadCells method is called')
    }
    const inputs = []
    let inputCapacity = BigInt(0)
    /**
     * pick inputs
     */
    for (let i = 0; i < unspentCells.length; i++) {
      const unspentCell = unspentCells[i]
      if (!safeMode || unspentCell.dataHash === EMPTY_DATA_HASH) {
        inputs.push({
          previousOutput: unspentCell.outPoint,
          since: '0x0',
        })
        inputCapacity += BigInt(unspentCells[i].capacity)
        if (inputCapacity >= targetCapacity) {
          break
        }
      }
    }
    if (inputCapacity < targetCapacity) {
      throw new Error('Input capacity is not enough')
    }
    if (inputCapacity > targetCapacity) {
      changeOutput.capacity = inputCapacity - targetCapacity
    }

    /**
     * compose the raw transaction which has an empty witnesses
     */

    const outputs = [{ ...toOutput, capacity: `0x${toOutput.capacity.toString(16)}` }]

    if (changeOutput.capacity > BigInt(0)) {
      outputs.push({ ...changeOutput, capacity: `0x${changeOutput.capacity.toString(16)}` })
    }

    const outputsData = outputs.map(() => '0x')

    const tx = {
      version: '0x0',
      cellDeps: [
        {
          outPoint: this.deps.outPoint,
          depType: 'depGroup',
        },
      ],
      headerDeps: [],
      inputs,
      outputs,
      witnesses: [
        {
          data: [],
        },
      ],
      outputsData,
    }
    return tx
  }

  public signWitnesses = ({
    transactionHash,
    witnesses = [],
  }: {
    transactionHash: string
    witnesses: CKBComponents.Witness[]
  }) => {
    if (!transactionHash) throw new Error('Transaction hash is required')
    const signedWitnesses = signWitnesses({
      transactionHash,
      witnesses,
      signRecoverable: this.signRecoverable,
    })
    return signedWitnesses
  }

  public signTransaction = (transaction: CKBComponents.RawTransaction) => {
    if (!transaction) throw new Error('Transaction is required')
    if (!transaction.witnesses) throw new Error('Witnesses is required')
    if (transaction.witnesses.length < transaction.inputs.length) throw new Error('Invalid count of witnesses')
    if (!transaction.outputsData) throw new Error('OutputsData is required')
    if (transaction.outputsData.length < transaction.outputs.length) throw new Error('Invalid count of outputsData')

    const transactionHash = rawTransactionToHash(transaction)
    const signedWitnesses = this.signWitnesses({
      transactionHash,
      witnesses: transaction.witnesses,
    })
    return {
      ...transaction,
      witnesses: signedWitnesses,
    }
  }
}

export default Address
