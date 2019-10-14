import { rawTransactionToHash } from '@nervosnetwork/ckb-sdk-utils'
import { ArgumentRequired } from '@nervosnetwork/ckb-sdk-utils/lib/exceptions'
import signWitness from './signWitness'
import KeyPair from './keyPair'

class TransactionBuilder {
  public hash: CKBComponents.Hash256 = ''

  public rawTransaction: CKBComponents.RawTransaction = {
    version: '0x0',
    cellDeps: [],
    headerDeps: [],
    inputs: [],
    outputs: [],
    witnesses: [],
    outputsData: [],
  }

  constructor({ inputs = [], outputs = [], ...rest }: TransactionBuilderInitParams = { inputs: [], outputs: [] }) {
    this.rawTransaction = {
      ...this.rawTransaction,
      ...rest,
      inputs,
      outputs,
    }
  }

  public addInput = (input: CKBComponents.CellInput) => this.rawTransaction.inputs.push(input)

  public addOutput = (output: CKBComponents.CellOutput) => this.rawTransaction.outputs.push(output)

  public removeInput = (index: number) => this.rawTransaction.inputs.splice(index, 1)

  public removeOutput = (index: number) => this.rawTransaction.outputs.splice(index, 1)

  public updateOptions = (options: Omit<CKBComponents.RawTransaction, 'inputs' | 'outputs'>) => {
    this.rawTransaction = {
      ...this.rawTransaction,
      ...options,
    }
  }

  public updateTransactionHash = () => {
    this.hash = rawTransactionToHash(this.rawTransaction)
    return this.hash
  }

  public signInput = (index: number, key: string | KeyPair) => {
    if (undefined === index) {
      throw new ArgumentRequired('Index of input')
    }
    if (undefined === key) {
      throw new ArgumentRequired('Private key or address object')
    }
    if (!this.hash) {
      this.updateTransactionHash()
    }

    const keyPair = typeof key === 'string' ? new KeyPair(key) : key
    this.rawTransaction.witnesses[index] = signWitness(keyPair, this.hash, this.rawTransaction.witnesses[index])
  }
}

export default TransactionBuilder
