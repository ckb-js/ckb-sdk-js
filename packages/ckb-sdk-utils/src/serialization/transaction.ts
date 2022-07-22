import { serializeScript } from './script'
import { toUint32Le, toUint64Le } from '../convertors'
import {
  serializeArray,
  serializeStruct,
  serializeTable,
  serializeDynVec,
  serializeFixVec,
  serializeOption,
} from './basic'

export const serializeVersion = (version: CKBComponents.Version) => toUint32Le(version)

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeOutPoint]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizeoutpoint}
 */
export const serializeOutPoint = (outPoint: CKBComponents.OutPoint | null) => {
  if (!outPoint) return ''
  const struct = new Map<string, string>([
    ['txHash', outPoint.txHash],
    ['index', toUint32Le(outPoint.index)],
  ])
  return serializeStruct(struct)
}

export const serializeDepType = (type: CKBComponents.DepType) => {
  if (type === 'code') return '0x00'
  if (type === 'depGroup') return '0x01'
  throw new TypeError("Dep type must be either of 'code' or 'depGroup'")
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeCellDep]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizecelldep}
 */
export const serializeCellDep = (dep: CKBComponents.CellDep) => {
  const serializedOutPoint = serializeOutPoint(dep.outPoint)
  const serializedDepType = serializeDepType(dep.depType)
  const struct = new Map<string, string>([
    ['outPoint', serializedOutPoint],
    ['depType', serializedDepType],
  ])
  return serializeStruct(struct)
}

export const serializeCellDeps = (cellDeps: CKBComponents.CellDep[]) => {
  const serializedCellDepList = cellDeps.map(dep => serializeCellDep(dep))
  return serializeFixVec(serializedCellDepList)
}

export const serializeHeaderDeps = (deps: CKBComponents.Hash256[]) => {
  const serializedHeaderDepList = deps.map(dep => serializeArray(dep))
  return serializeFixVec(serializedHeaderDepList)
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeCellInput]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizecellinput}
 */
export const serializeInput = (input: CKBComponents.CellInput) => {
  const serializedOutPoint = serializeOutPoint(input.previousOutput)
  const serializedSince = toUint64Le(input.since)
  const struct = new Map([
    ['since', serializedSince],
    ['previousOutput', serializedOutPoint],
  ])
  return serializeStruct(struct)
}

export const serializeInputs = (inputs: CKBComponents.CellInput[]) => {
  const serializedInputList = inputs.map(input => serializeInput(input))
  return serializeFixVec(serializedInputList)
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeCellOutput]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizecelloutput}
 */
export const serializeOutput = (output: CKBComponents.CellOutput) => {
  const serializedCapacity = toUint64Le(output.capacity)
  const serializedLockScript = serializeScript(output.lock)
  const serialiedTypeScript = output.type ? serializeScript(output.type) : ''
  const table = new Map([
    ['capacity', serializedCapacity],
    ['lock', serializedLockScript],
    ['type', serialiedTypeScript],
  ])
  return serializeTable(table)
}

export const serializeOutputs = (outputs: CKBComponents.CellOutput[]) => {
  const serializedOutputList = outputs.map(output => serializeOutput(output))
  return serializeDynVec(serializedOutputList)
}

export const serializeOutputsData = (outputsData: CKBComponents.Hash[]) => {
  const serializedOutputsDatumList = outputsData.map(datum => serializeFixVec(datum))
  return serializeDynVec(serializedOutputsDatumList)
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeWitnessArgs]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizewitnessargs}
 */
export const serializeWitnessArgs = (witnessArgs: CKBComponents.WitnessArgs) => {
  const [serializedLock, serializedInputType, serializedOutputType] = [
    witnessArgs.lock,
    witnessArgs.inputType,
    witnessArgs.outputType,
  ].map(args => {
    if (serializeOption(args) === '0x') {
      return '0x'
    }
    return serializeFixVec(args!)
  })

  const table = new Map([
    ['lock', serializedLock],
    ['inputType', serializedInputType],
    ['outputType', serializedOutputType],
  ])
  return serializeTable(table)
}

export const serializeWitnesses = (witnesses: CKBComponents.Witness[]) => {
  const serializedWitnessList = witnesses.map(witness => serializeFixVec(witness))
  return serializeDynVec(serializedWitnessList)
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeRawTransaction]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizerawtransaction}
 */
export const serializeRawTransaction = (
  rawTransaction: Pick<
    CKBComponents.RawTransaction,
    'version' | 'cellDeps' | 'headerDeps' | 'inputs' | 'outputs' | 'outputsData'
  >,
) => {
  const serializedVersion = serializeVersion(rawTransaction.version)
  const serializedCellDeps = serializeCellDeps(rawTransaction.cellDeps)
  const serializedHeaderDeps = serializeHeaderDeps(rawTransaction.headerDeps)
  const serializedInputs = serializeInputs(rawTransaction.inputs)
  const serializedOutputs = serializeOutputs(rawTransaction.outputs)
  const serializedOutputsData = serializeOutputsData(rawTransaction.outputsData)

  const table = new Map([
    ['version', serializedVersion],
    ['cellDeps', serializedCellDeps],
    ['headerDeps', serializedHeaderDeps],
    ['inputs', serializedInputs],
    ['outputs', serializedOutputs],
    ['outputsData', serializedOutputsData],
  ])

  return serializeTable(table)
}

/**
 * @deprecated please migrate to [@ckb-lumos/toolkit/normalizers.NormalizeTransaction]{@link https://lumos-website.vercel.app/api/modules/toolkit.normalizers.html#normalizetransaction}
 */
export const serializeTransaction = (rawTransaction: CKBComponents.RawTransaction) => {
  const serializedRawTransaction = serializeRawTransaction(rawTransaction)
  const serializedWitnesses = serializeWitnesses(rawTransaction.witnesses || [])

  const table = new Map([
    ['raw', serializedRawTransaction],
    ['witnesses', serializedWitnesses],
  ])
  return serializeTable(table)
}
