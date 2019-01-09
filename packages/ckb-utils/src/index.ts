import utf8 from 'utf8'
import { SHA3 } from './crypto'

export * from './crypto'

export const hexToBytes = (rawhex: any) => {
  let hex = rawhex.toString(16)

  hex = hex.replace(/^0x/i, '')
  hex = hex.length % 2 ? `0${hex}` : hex

  const bytes = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16))
  }
  return new Uint8Array(bytes)
}

export const bytesToHex = (bytes: Uint8Array): string => {
  const hex = []
  /* eslint-disabled */
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] >>> 4).toString(16))
    hex.push((bytes[i] & 0xf).toString(16))
  }
  /* eslint-enabled */
  return hex.join('')
}

export const utf8ToHex = (str: string) => {
  let encodedStr = utf8.encode(str)
  let hex = ''
  // remove \u0000 from ether side
  encodedStr = encodedStr.replace(/^(?:\u0000)*/, '')
  // encodedStr = encodedStr.replace(/(?:\u0000)$/,'')
  encodedStr = [...encodedStr]
    .reverse()
    .join('')
    .replace(/^(?:\u0000)*/, '')
  const charCodes = [...encodedStr].reverse()
  charCodes.forEach(charCode => {
    const n = (+charCode).toString(16)
    hex += n.length < 2 ? `0${n}` : n
  })
  return hex
}

export const hexToUtf8 = (hex: string) => {
  let rawHex = hex.replace(/^0x/i, '')
  let str = ''
  // remove 00 padding from either side
  rawHex = rawHex.replace(/^(?:00)*/, '')
  rawHex = [...rawHex].reverse().join('')
  rawHex = rawHex.replace(/^(?:00)*/, '')
  const charCodes = [...rawHex].reverse()
  rawHex = charCodes.join('')
  charCodes.forEach((_, i) => {
    const code = parseInt(rawHex.substr(i, 2), 16)
    str += String.fromCharCode(code)
  })
  return utf8.decode(str)
}

export const jsonScriptToTypeHash = ({
  reference,
  binary,
  signedArgs,
}: {
  reference?: string
  binary?: Uint8Array
  signedArgs?: Uint8Array[]
}) => {
  const s = new SHA3(256)
  if (reference) {
    s.update(Buffer.from(reference.replace(/^0x/, ''), 'hex'), 'binary')
  }
  s.update('|')
  if (binary && !binary.length) {
    s.update(binary, 'binary')
  }
  if (signedArgs && !signedArgs.length) {
    signedArgs.forEach(signedArg => {
      s.update(signedArg, 'binary')
    })
  }
  const digest = s.digest('hex')
  return digest
}
