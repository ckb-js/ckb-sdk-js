const ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

const SEPARATOR = '1'

const alphabetMap = new Map<string, number>()

for (let i = 0; i < ALPHABET.length; i++) {
  const char = ALPHABET.charAt(i)

  if (alphabetMap.get(char) !== undefined) {
    throw new TypeError(`${char} is ambiguous`)
  }

  alphabetMap.set(char, i)
}

const polymodStep = (values: any) => {
  const b = values >> 25
  return (
    ((values & 0x1ffffff) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
  )
}

const prefixChecksum = (prefix: string) => {
  let checksum = 1

  for (let i = 0; i < prefix.length; ++i) {
    const c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`)
    checksum = polymodStep(checksum) ^ (c >> 5)
  }

  checksum = polymodStep(checksum)

  for (let i = 0; i < prefix.length; ++i) {
    const v = prefix.charCodeAt(i)
    checksum = polymodStep(checksum) ^ (v & 0x1f)
  }

  return checksum
}

export const encode = (prefix: string, words: Uint8Array) => {
  const formattedPrefix = prefix.toLowerCase()

  // determine checksum mod
  let checksum = prefixChecksum(formattedPrefix)

  let result = `${formattedPrefix}${SEPARATOR}`

  for (let i = 0; i < words.length; ++i) {
    const x = words[i]
    if (x >> 5 !== 0) throw new Error('Non 5-bit word')

    checksum = polymodStep(checksum) ^ x

    result += ALPHABET.charAt(x)
  }

  for (let i = 0; i < 6; ++i) {
    checksum = polymodStep(checksum)
  }

  checksum ^= 1

  for (let i = 0; i < 6; ++i) {
    const v = (checksum >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

export const decode = (encoded: string) => {
  const lowered = encoded.toLowerCase()

  const uppered = encoded.toUpperCase()

  if (encoded !== lowered && encoded !== uppered) throw new Error(`Mixed-case string ${encoded}`)

  const str = lowered

  if (str.length < 8) throw new TypeError(`${str} too short`)

  const split = str.lastIndexOf(SEPARATOR)

  if (split === -1) throw new Error(`No separator character for ${str}`)

  if (split === 0) throw new Error(`Missing prefix for ${str}`)

  const prefix = str.slice(0, split)

  const wordChars = str.slice(split + 1)

  if (wordChars.length < 6) throw new Error('Data too short')

  let checksum = prefixChecksum(prefix)

  const words: number[] = []

  wordChars.split('').forEach((_, i) => {
    const c = wordChars.charAt(i)
    const v = alphabetMap.get(c)
    if (v === undefined) throw new Error(`Unknown character ${c}`)
    checksum = polymodStep(checksum) ^ v
    if (i + 6 < wordChars.length) {
      words.push(v)
    }
  })

  if (checksum !== 1) throw new Error(`Invalid checksum for ${str}`)
  return {
    prefix,
    words,
  }
}

const convert = (data: Uint8Array, inBits: number, outBits: number, pad: boolean): Uint8Array => {
  let value = 0
  let bits = 0
  const maxV = (1 << outBits) - 1

  const result = []
  for (let i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) throw new Error('Excess padding')
    if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding')
  }

  return new Uint8Array(result)
}

export const toWords = (bytes: Uint8Array) => convert(bytes, 8, 5, true)

export const fromWords = (words: Uint8Array) => convert(words, 5, 8, false)

export default {
  decode,
  encode,
  toWords,
  fromWords,
}
