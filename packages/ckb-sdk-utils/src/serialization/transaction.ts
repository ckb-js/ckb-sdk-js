import { serializeScript } from './script'
import { toHexInLittleEndian } from '..'
import { serializeArray, serializeStruct, serializeTable, serializeDynVec, serializeFixVec } from '.'

export const serializeVersion = (version: CKBComponents.Version) => {
  if (typeof version !== 'string') {
    throw new TypeError('The version to be serialized should be the type of string')
  }
  if (version.startsWith('0x') || Number.isNaN(+version)) {
    throw new Error('The value of the version should be the type of integer')
  }
  return toHexInLittleEndian(version)
}

export const serializeOutPoint = (outPoint: CKBComponents.OutPoint | null) => {
  if (!outPoint) return ''
  const struct = new Map<string, string>([['txHash', outPoint.txHash], ['index', toHexInLittleEndian(outPoint.index)]])
  return serializeStruct(struct)
}

export const serializeDepType = (type: CKBComponents.DepType) => {
  if (type === 'code') return '00'
  if (type === 'depGroup') return '01'
  throw new TypeError("Dep type must be either of 'code' or 'depGroup'")
}

export const serializeCellDep = (dep: CKBComponents.CellDep) => {
  const serializedOutPoint = serializeOutPoint(dep.outPoint)
  const serializedDepType = serializeDepType(dep.depType)
  const struct = new Map<string, string>([['outPoint', serializedOutPoint], ['depType', serializedDepType]])
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

// TODO: add tests
export const serializeInput = (input: CKBComponents.CellInput) => {
  const serializedOutPoint = serializeOutPoint(input.previousOutput)
  const serializedSince = toHexInLittleEndian(input.since, 8)
  const struct = new Map([['since', serializedSince], ['previousOutput', serializedOutPoint]])
  return serializeStruct(struct)
}

export const serializeInputs = (inputs: CKBComponents.CellInput[]) => {
  const serializedInputList = inputs.map(input => serializeInput(input))
  return serializeFixVec(serializedInputList)
}

export const serializeOutput = (output: CKBComponents.CellOutput) => {
  const serializedCapacity = toHexInLittleEndian(output.capacity, 8)
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

export const serializeRawTransaction = (rawTransaction: CKBComponents.RawTransaction) => {
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
