import { hexToBytes, bytesToHex, toUint32Le } from '../convertors'

export type FieldType = 'array' | 'struct' | 'fixvec' | 'dynvec' | 'table' | 'option' | 'union'

export type Schema = Map<string, FieldType>

export const offsetSize = 4 // 4 bytes

export const fullLengthSize = 4 // 4 bytes

export const getOffsets = (elmLengths: number[]) => {
  const headerLength = fullLengthSize + offsetSize * elmLengths.length
  const offsets = [headerLength]
  elmLengths.forEach((_, idx: number) => {
    if (idx) {
      offsets.push(offsets[offsets.length - 1] + elmLengths[idx - 1])
    }
  })
  return offsets
}

/**
 * @name serializeArray
 * @description The array is a fixed-size type: it has a fixed-size type and a fixed length.
 *              The size of an array is the size of inner type times the length.
 *              Serialize an array only need to serialize all items in it. No extra cost for array itself.
 */
export const serializeArray = (array: string | Uint8Array) => {
  if (typeof array !== 'string' && !Array.isArray(array)) {
    throw new TypeError('The array to be serialized should by type of string or bytes')
  }
  const bytes = typeof array === 'string' ? hexToBytes(array) : array
  return bytesToHex(bytes)
}

/**
 * @name serializeStruct
 * @type Struct is a fixed-size type: all fields in struct is fixed-size,
 *              and it has a fixed quantity of fields.
 * @description The size of a struct is the sum of all fields' size.
 *              Serialize a struct only need to serialize all fields in it.
 *              No extra cost for struct itself.
 *              Fields in a struct are stored in the order they are declared.
 */
export const serializeStruct = (struct: Map<string, string | Uint8Array>) => {
  let res = ''
  struct.forEach(value => {
    res += serializeArray(value).slice(2)
  })
  return `0x${res}`
}

/**
 * @name serializeFixVec
 * @type FixVec, a fixed-size vector is a vector whose items have a fixed size
 * @tutorial There are two steps of serializing a serializeFixVec
 *           1. Serialize the length as a 32 bit unsigned integer in little-endian
 *           2. Serialize all items in it
 */
export const serializeFixVec = (fixVec: string | (string | Uint8Array)[]) => {
  if (typeof fixVec !== 'string' && !Array.isArray(fixVec)) {
    throw new TypeError('The fixed vector to be serialized should be a string or an array of bytes')
  }
  const vec = typeof fixVec === 'string' ? [...hexToBytes(fixVec)].map(b => `0x${b.toString(16)}`) : fixVec
  const serializedItemVec = vec.map(item => serializeArray(item).slice(2))
  const header = toUint32Le(`0x${serializedItemVec.length.toString(16)}`).slice(2)
  return `0x${header}${serializedItemVec.join('')}`
}

/**
 * @name serializeDynVec
 * @type DynVec, a dynamic-size vector is a vector whose items have a dynamic size
 * @tutorial There are three steps of serializing a dynvec
 *           1. Serialize the full size in bytes as a 32 bit unsigned integer in little-endian
 *           2. Serialize all offset of the items as 32 bit unsigned integer in little-endian
 *           3. Serialize all items in it
 */
export const serializeDynVec = (dynVec: (string | Uint8Array)[]) => {
  if (!Array.isArray(dynVec)) {
    throw new TypeError('The dynamic vector to be serialized should be an array of bytes')
  }
  const serializedItemVec = dynVec.map(item => serializeArray(item).slice(2))
  const body = serializedItemVec.join('')
  let offsets = ''
  if (serializedItemVec.length) {
    offsets = getOffsets(serializedItemVec.map(item => item.length / 2))
      .map(offset => toUint32Le(`0x${offset.toString(16)}`).slice(2))
      .join('')
  }
  const headerLength = fullLengthSize + offsetSize * serializedItemVec.length
  const fullLength = toUint32Le(`0x${(headerLength + body.length / 2).toString(16)}`).slice(2)
  return `0x${fullLength}${offsets}${body}`
}

// TODO: add tests
/**
 * @name serializeTable
 * @type Table, the table is a dynamic-size type, It can be considered as a dynvec but the length is fixed.
 */
export const serializeTable = (table: Map<string, string | Uint8Array>) => {
  const bodyElms: string[] = []
  table.forEach(value => {
    bodyElms.push(serializeArray(value).slice(2))
  })
  const body = bodyElms.join('')
  const headerLength = fullLengthSize + offsetSize * table.size
  const fullLength = toUint32Le(`0x${(headerLength + body.length / 2).toString(16)}`).slice(2)
  const offsets = getOffsets(bodyElms.map(arg => arg.length / 2))
    .map(offset => toUint32Le(`0x${offset.toString(16)}`).slice(2))
    .join('')
  return `0x${fullLength}${offsets}${body}`
}

/**
 * @name serializeOption
 * @type Option is a dynamic-size type
 * @tutorial Serialize an option depends on whether it is empty or not
 *           1. if it's empty, there is zero bytes(the size is 0)
 *           2. if it's not empty, just serialize the inner item(the size is same as the inner item's size)
 */
export const serializeOption = (innerItem?: string) => (!innerItem ? '0x' : innerItem)
// TODO: serialize union

// TODO: serialize with schema
