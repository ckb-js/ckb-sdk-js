import utf8 from 'utf8'
// class Utils {
//   static hex2bin = () => {
//     // TODO:
//   }

//   static bin2hex = () => {
//     // TODO:
//   }

//   static bin2prefixHex = () => {
//     // TODO:
//   }

//   static extractPkBin = (pkBin: Uint8Array) => {
//     // TODO:
//   }

//   static jsonScriptToTypeHash = (script: string) => {
//     // TODO:
//   }
// }

export const hexToBytes = (hex: string | number) => {
  let _hex = hex.toString(16).replace(/^0x/i, '')
  _hex = _hex.length % 2 ? _hex : `0${_hex}`
  const bytes = []
  for (let c = 0; c < _hex.length; c += 2) {
    bytes.push(parseInt(_hex.substr(c, 2), 16))
  }
  return bytes
}

export const bytesToHex = (bytes: number[]): string => {
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
  let _str = utf8.encode(str)
  let hex = ''
  // remove \u0000 from ether side
  _str = _str.replace(/^(?:\u0000)*/, '')
  // _str = _str.replace(/(?:\u0000)$/,'')
  _str = [..._str]
    .reverse()
    .join('')
    .replace(/^(?:\u0000)*/, '')
  const charCodes = [..._str].reverse()
  charCodes.forEach(charCode => {
    const n = (+charCode).toString(16)
    hex += n.length < 2 ? `0${n}` : n
  })
  return hex
}

export const hexToUtf8 = (hex: string) => {
  let _hex = hex.replace(/^0x/i, '')
  let str = ''
  // remove 00 padding from either side
  _hex = _hex.replace(/^(?:00)*/, '')
  _hex = [..._hex].reverse().join('')
  _hex = _hex.replace(/^(?:00)*/, '')
  const charCodes = [..._hex].reverse()
  _hex = charCodes.join('')
  charCodes.forEach((_, i) => {
    const code = parseInt(_hex.substr(i, 2), 16)
    str += String.fromCharCode(code)
  })
  return utf8.decode(str)
}
// export const hex2bin = () => {}
// export const bin2hex = () => {}
// export const bin2prefixHex = () => {}
