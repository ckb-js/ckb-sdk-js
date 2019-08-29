import { hexToBytes, bytesToHex, toHexInLittleEndian } from '..'

const offsetSize = 4 // 4 bytes
const fullLengthSize = 4 // 4 bytes

const getOffsets = (elmLengths: number[]) => {
  const headerLength = fullLengthSize + offsetSize * elmLengths.length
  const offsets = [headerLength]
  elmLengths.forEach((_, idx: number) => {
    if (idx) {
      offsets.push(offsets[offsets.length - 1] + elmLengths[idx - 1])
    }
  })
  return offsets
}

export const serializeHash = (arg: CKBComponents.Hash) => {
  const bytes = hexToBytes(arg)
  const header = toHexInLittleEndian(bytes.length)
  const body = bytesToHex(bytes)
  return `${header}${body}`
}

export const serializeCodeHash = (codeHash: CKBComponents.Hash256) => {
  const bytes = hexToBytes(codeHash)
  const body = bytesToHex(bytes)
  return body
}

export const serializeArg = (arg: CKBComponents.Hash) => serializeHash(arg)

export const serializeHashType = (hashType: CKBComponents.ScriptHashType) => {
  if (hashType === 'data') return '00'
  if (hashType === 'type') return '01'
  throw new TypeError("Hash type must be either of 'data' or 'type'")
}

export const serializeArgs = (args: string[]) => {
  if (!args.length) return '04000000'
  const serializedArgs = args.map(serializeArg)
  const headerLength = fullLengthSize + offsetSize * serializedArgs.length
  const fullLength = toHexInLittleEndian(headerLength + serializedArgs.join('').length / 2)
  const offsets = getOffsets(serializedArgs.map(arg => arg.length / 2)).map(offset => toHexInLittleEndian(offset))
  return [fullLength, ...offsets, ...serializedArgs].join('')
}

export const serializeScript = (script: CKBComponents.Script) => {
  if (!script) throw new Error('Script is required')
  const { codeHash = '', hashType, args = [] } = script
  const serializedCodeHash = serializeCodeHash(codeHash)
  const serializedHashType = serializeHashType(hashType)
  const serializedArgs = serializeArgs(args)
  const elms = [serializedCodeHash, serializedHashType, serializedArgs]
  const fullLength = toHexInLittleEndian(
    fullLengthSize +
      offsetSize * 3 +
      (serializedCodeHash.length + serializedHashType.length + serializedArgs.length) / 2
  )

  const offsets = getOffsets(elms.map(elm => elm.length / 2)).map(offset => toHexInLittleEndian(offset))
  return [fullLength, ...offsets, ...elms].join('')
}

export default {
  serializeHash,
  serializeCodeHash,
  serializeArg,
  serializeArgs,
  serializeHashType,
  serializeScript,
}
