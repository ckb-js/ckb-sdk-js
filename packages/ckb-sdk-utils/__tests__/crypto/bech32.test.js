const { bech32 } = require('../..')
const fixtures = require('./bech32.fixtures.json')

describe('bech32', () => {
  fixtures.bech32.valid.forEach(f => {
    it(`fromWords/toWords ${f.hex}`, () => {
      if (f.hex) {
        const words = bech32.toWords(Buffer.from(f.hex, 'hex'))
        const bytes = Buffer.from(bech32.fromWords(f.words))
        expect(words.join('')).toEqual(f.words.join(''))
        expect(bytes.toString('hex')).toBe(f.hex)
      }
    })

    it(`encode ${f.prefix}`, () => {
      const encoded = bech32.encode(f.prefix, f.words, f.limit)
      expect(encoded).toBe(f.string.toLowerCase())
    })

    it(`decode ${f.string}`, () => {
      const decoded = bech32.decode(f.string, f.limit)
      expect(decoded.prefix).toBe(f.prefix.toLowerCase())
      expect(decoded.words.join('')).toBe(f.words.join(''))
    })

    it(`fails for ${f.string} with 1 bit flipped`, () => {
      const buf = Buffer.from(f.string, 'utf8')
      buf[f.string.lastIndexOf('1') + 1] ^= 0x1
      const str = buf.toString('utf8')
      expect(() => {
        bech32.decode(str, f.limit)
      }).toThrow()
    })
  })
})
