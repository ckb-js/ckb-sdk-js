import { serializeDynVec, serializeArray, serializeTable, serializeFixVec } from '.'
import { ArgumentRequired } from '../exceptions'

export const serializeCodeHash = (codeHash: CKBComponents.Hash256) => serializeArray(codeHash)

export const serializeHashType = (hashType: CKBComponents.ScriptHashType) => {
  if (hashType === 'data') return '0x00'
  if (hashType === 'type') return '0x01'
  throw new TypeError("Hash type must be either of 'data' or 'type'")
}

export const serializeArgs = (args: string[]) => serializeDynVec(args.map(arg => serializeFixVec(arg)))

export const serializeScript = (script: CKBComponents.Script) => {
  if (!script) throw new ArgumentRequired('Script')
  const { codeHash = '', hashType, args = [] } = script
  const serializedCodeHash = serializeCodeHash(codeHash)
  const serializedHashType = serializeHashType(hashType)
  const serializedArgs = serializeArgs(args)
  const table = new Map([['codeHash', serializedCodeHash], ['hashType', serializedHashType], ['args', serializedArgs]])
  return serializeTable(table)
}
