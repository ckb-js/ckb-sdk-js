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

/**
 * @deprecated please migrate to {@link  https://lumos-website.vercel.app/api/modules/codec.html#uint32le-2 @ckb-lumos/codec/Uint32LE} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeversion example}
 */
export const serializeVersion = (version: CKBComponents.Version) => toUint32Le(version)

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeoutpoint example}
 */
export const serializeOutPoint = (outPoint: CKBComponents.OutPoint | null) => {
  if (!outPoint) return ''
  const struct = new Map<string, string>([
    ['txHash', outPoint.txHash],
    ['index', toUint32Le(outPoint.index)],
  ])
  return serializeStruct(struct)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializedeptype example}
 */
export const serializeDepType = (type: CKBComponents.DepType) => {
  if (type === 'code') return '0x00'
  if (type === 'depGroup') return '0x01'
  throw new TypeError("Dep type must be either of 'code' or 'depGroup'")
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializecelldep example}
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

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializecelldeps example}
 */
export const serializeCellDeps = (cellDeps: CKBComponents.CellDep[]) => {
  const serializedCellDepList = cellDeps.map(dep => serializeCellDep(dep))
  return serializeFixVec(serializedCellDepList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeheaderdeps example}
 */
export const serializeHeaderDeps = (deps: CKBComponents.Hash256[]) => {
  const serializedHeaderDepList = deps.map(dep => serializeArray(dep))
  return serializeFixVec(serializedHeaderDepList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeinput example}
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

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeinputs example}
 */
export const serializeInputs = (inputs: CKBComponents.CellInput[]) => {
  const serializedInputList = inputs.map(input => serializeInput(input))
  return serializeFixVec(serializedInputList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeoutput example}
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

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeoutputs example}
 */
export const serializeOutputs = (outputs: CKBComponents.CellOutput[]) => {
  const serializedOutputList = outputs.map(output => serializeOutput(output))
  return serializeDynVec(serializedOutputList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializeoutputsdata example}
 */
export const serializeOutputsData = (outputsData: CKBComponents.Hash[]) => {
  const serializedOutputsDatumList = outputsData.map(datum => serializeFixVec(datum))
  return serializeDynVec(serializedOutputsDatumList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializewitnessargs example}
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

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializewitnesses example}
 */
export const serializeWitnesses = (witnesses: CKBComponents.Witness[]) => {
  const serializedWitnessList = witnesses.map(witness => serializeFixVec(witness))
  return serializeDynVec(serializedWitnessList)
}

/**
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializerawtransaction example}
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
 * @deprecated please migrate to {@link https://lumos-website.vercel.app/api/modules/base.html @ckb-lumos/base/blockchain} {@link https://lumos-website.vercel.app/migrations/migrate-form-ckb-sdk-utils#serializetransaction example}
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
