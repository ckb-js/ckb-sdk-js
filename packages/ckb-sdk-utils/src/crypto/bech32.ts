const ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

const ALPHABET_MAP = new Map()

for (let i = 0; i < ALPHABET.length; i++) {
  const char = ALPHABET.charAt(i)
  if (ALPHABET_MAP.get(char) !== undefined) {
    throw new TypeError(`${char} is ambiguous`)
  }
  ALPHABET_MAP.set(char, i)
}

const polymodStep = (pre: any) => {
  const b = pre >> 25
  return (
    ((pre & 0x1ffffff) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
  )
}

const prefixChk = (prefix: string) => {
  let chk = 1
  for (let i = 0; i < prefix.length; ++i) {
    const c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`)

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (let i = 0; i < prefix.length; ++i) {
    const v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

export const encode = (_prefix: string, words: Uint8Array, LIMIT: number = 90) => {
  const prefix = _prefix.toLowerCase()

  if (prefix.length + 7 + words.length > LIMIT) throw new TypeError('Exceeds length limit')

  // determine chk mod
  let chk = prefixChk(prefix)
  let result = `${prefix}1`
  for (let i = 0; i < words.length; ++i) {
    const x = words[i]
    if (x >> 5 !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (let i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (let i = 0; i < 6; ++i) {
    const v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

/* eslint-disable no-continue */
export const decode = (_str: string, LIMIT: number = 90) => {
  // don't allow mixed case
  const lowered = _str.toLowerCase()
  const uppered = _str.toUpperCase()
  if (_str !== lowered && _str !== uppered) throw new Error(`Mixed-case string ${_str}`)
  const str = lowered

  if (str.length < 8) throw new TypeError(`${str} too short`)
  if (str.length > LIMIT) throw new TypeError('Exceeds length limit')

  const split = str.lastIndexOf('1')
  if (split === -1) throw new Error(`No separator character for ${str}`)
  if (split === 0) throw new Error(`Missing prefix for ${str}`)

  const prefix = str.slice(0, split)
  const wordChars = str.slice(split + 1)
  if (wordChars.length < 6) throw new Error('Data too short')

  let chk = prefixChk(prefix)
  const words = []
  for (let i = 0; i < wordChars.length; ++i) {
    const c = wordChars.charAt(i)
    const v = ALPHABET_MAP.get(c)
    if (v === undefined) throw new Error(`Unknown character ${c}`)
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }
  /* eslint-enable no-continue */

  if (chk !== 1) throw new Error(`Invalid checksum for ${str}`)
  return {
    prefix,
    words,
  }
}

const convert = (data: Uint8Array, inBits: any, outBits: any, pad: any): Uint8Array => {
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
