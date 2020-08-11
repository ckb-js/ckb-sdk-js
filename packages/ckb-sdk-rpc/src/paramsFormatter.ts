import { JSBI } from '@nervosnetwork/ckb-sdk-utils'
import {
  PageSizeTooLargeException,
  PageSizeTooSmallException,
  OutputsValidatorTypeException,
  BigintOrHexStringTypeException,
  StringHashTypeException,
  HexStringWithout0xException,
} from './exceptions'

/* eslint-disable camelcase */
const formatter = {
  toOptional: (format?: Function) => (arg: any) => {
    if (!format || arg === undefined || arg === null) {
      return arg
    }
    return format(arg)
  },
  toHash: (hash: string): RPC.Hash256 => {
    if (typeof hash !== 'string') {
      throw new StringHashTypeException(hash)
    }
    return hash.startsWith('0x') ? hash : `0x${hash}`
  },
  toNumber: (number: CKBComponents.Number | bigint): RPC.Number => {
    if (typeof number === 'bigint') {
      // @ts-ignore
      return `0x${number.toString(16)}`
    }
    if (typeof number !== 'string') {
      throw new BigintOrHexStringTypeException(number)
    }
    if (!number.startsWith('0x')) {
      throw new HexStringWithout0xException(number)
    }
    return number
  },
  toScript: (script: CKBComponents.Script): RPC.Script => {
    const { codeHash, hashType: hash_type, ...rest } = script
    return {
      code_hash: formatter.toHash(codeHash),
      hash_type,
      ...rest,
    }
  },
  toOutPoint: (outPoint: CKBComponents.OutPoint | null): RPC.OutPoint | null => {
    if (!outPoint) return outPoint
    const { txHash, index, ...rest } = outPoint
    return {
      tx_hash: formatter.toHash(txHash),
      index: formatter.toNumber(index),
      ...rest,
    }
  },
  toInput: (input: CKBComponents.CellInput): RPC.CellInput => {
    if (!input) return input
    const { previousOutput, since, ...rest } = input
    return {
      previous_output: formatter.toOutPoint(previousOutput),
      since: formatter.toNumber(since),
      ...rest,
    }
  },
  toOutput: (output: CKBComponents.CellOutput): RPC.CellOutput => {
    if (!output) return output
    const { capacity, lock, type = null, ...rest } = output
    return {
      capacity: formatter.toNumber(capacity),
      lock: formatter.toScript(lock),
      type: type ? formatter.toScript(type) : type,
      ...rest,
    }
  },
  toDepType: (type: CKBComponents.DepType) => {
    if (type === 'depGroup') {
      return 'dep_group'
    }
    return type
  },
  toCellDep: (cellDep: CKBComponents.CellDep): RPC.CellDep => {
    if (!cellDep) return cellDep
    const { outPoint = null, depType = 'code', ...rest } = cellDep
    return {
      out_point: formatter.toOutPoint(outPoint),
      dep_type: formatter.toDepType(depType),
      ...rest,
    }
  },
  toRawTransaction: (transaction: CKBComponents.RawTransaction): RPC.RawTransaction => {
    if (!transaction) return transaction
    const {
      version,
      cellDeps = [],
      inputs = [],
      outputs = [],
      outputsData: outputs_data = [],
      headerDeps: header_deps = [],
      ...rest
    } = transaction
    const formattedInputs = inputs.map(input => formatter.toInput(input))
    const formattedOutputs = outputs.map(output => formatter.toOutput(output))
    const formattedCellDeps = cellDeps.map(cellDep => formatter.toCellDep(cellDep))
    const tx = {
      version: formatter.toNumber(version),
      cell_deps: formattedCellDeps,
      inputs: formattedInputs,
      outputs: formattedOutputs,
      outputs_data,
      header_deps,
      ...rest,
    }
    return tx
  },
  toPageNumber: (pageNo: string | bigint = '0x1') => formatter.toNumber(pageNo),
  toPageSize: (pageSize: string | bigint = '0x32') => {
    const size = JSBI.BigInt(`${pageSize}`)
    const MAX_SIZE = 50
    const MIN_SIZE = 0
    if (JSBI.greaterThan(size, JSBI.BigInt(MAX_SIZE))) throw new PageSizeTooLargeException(pageSize, MAX_SIZE)
    if (JSBI.lessThan(size, JSBI.BigInt(MIN_SIZE))) throw new PageSizeTooSmallException(pageSize, MIN_SIZE)
    return formatter.toNumber(`0x${size.toString(16)}`)
  },
  toReverseOrder: (reverse: boolean = false) => !!reverse,
  toOutputsValidator: (outputsValidator: CKBComponents.OutputsValidator) => {
    if (!outputsValidator) return undefined
    const VALIDATORS = ['default', 'passthrough']
    if (VALIDATORS.indexOf(outputsValidator) > -1) {
      return outputsValidator
    }
    throw new OutputsValidatorTypeException()
  },
  toBoolean: (value: boolean) => {
    return !!value
  },
}

export default formatter
/* eslint-enable camelcase */
