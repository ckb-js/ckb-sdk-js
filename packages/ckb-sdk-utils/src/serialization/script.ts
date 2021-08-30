import { serializeArray, serializeTable, serializeFixVec } from './basic'
import { ParameterRequiredException } from '../exceptions'

export const serializeCodeHash = (codeHash: CKBComponents.Hash256) => serializeArray(codeHash)

export const serializeHashType = (hashType: CKBComponents.ScriptHashType) => {
  if (hashType === 'data') return '0x00'
  if (hashType === 'type') return '0x01'
  if (hashType === 'data1') return '0x02'
  throw new TypeError("Hash type must be either of 'data' or 'type'")
}

export const serializeArgs = (args: string) => serializeFixVec(args)

export const serializeScript = (script: CKBComponents.Script) => {
  if (!script) throw new ParameterRequiredException('Script')
  const { codeHash = '', hashType, args = '' } = script
  const serializedCodeHash = serializeCodeHash(codeHash)
  const serializedHashType = serializeHashType(hashType)
  const serializedArgs = serializeArgs(args)
  const table = new Map([
    ['codeHash', serializedCodeHash],
    ['hashType', serializedHashType],
    ['args', serializedArgs],
  ])
  return serializeTable(table)
}
