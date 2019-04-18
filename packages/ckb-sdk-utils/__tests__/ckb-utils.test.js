const ckbUtils = require('../lib')
const bech32Fixtures = require('./bech32-fixtures.json')

const {
  blake2b,
  blake160,
  bech32,
  blake160PubkeyToAddress,
  pubkeyToAddress,
  hexToBytes,
  bytesToHex,
  lockScriptToHash,
  PERSONAL,
} = ckbUtils

describe('format', () => {
  it('hex to bytes', () => {
    const fixture = {
      hex: 'abcd12',
      bytes: [171, 205, 18],
    }
    const bytes = hexToBytes(fixture.hex)
    expect(bytes.join(',')).toBe(fixture.bytes.join(','))
  })

  it('bytes to hex', () => {
    const fixture = {
      bytes: [171, 205, 18],
      hex: 'abcd12',
    }
    const hex = bytesToHex(fixture.bytes)
    expect(hex).toBe(fixture.hex)
  })
})

describe('blake', () => {
  it('blake2b("") with personal', () => {
    const fixture = {
      str: '',
      digest: '44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(Buffer.from(fixture.str, 'utf8'))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  it('blake2b("The quick brown fox jumps over the lazy dog") with personal', () => {
    const fixture = {
      str: 'The quick brown fox jumps over the lazy dog',
      digest: 'abfa2c08d62f6f567d088d6ba41d3bbbb9a45c241a8e3789ef39700060b5cee2',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(Buffer.from(fixture.str, 'utf8'))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  it('blake160', () => {
    const fixture = {
      str: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      digest: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const digest = blake160(Buffer.from(fixture.str, 'hex'), 'hex')
    expect(digest).toBe(fixture.digest)
  })
})

describe('bech32', () => {
  bech32Fixtures.bech32.valid.forEach(f => {
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

describe('scriptToHash', () => {
  it('scriptToHash(basic script)', () => {
    const fixture = {
      script: {
        version: 0,
        binaryHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: [[1]],
      },
      lockHash: 'dade0e507e27e2a5995cf39c8cf454b6e70fa80d03c1187db7a4cb2c9eab79da',
    }
    const lockHash = lockScriptToHash(fixture.script)
    expect(lockHash).toBe(fixture.lockHash)
  })
})

describe('address', () => {
  it('pubkey blake160 to address', () => {
    const fixture = {
      str: '36c329ed630d6ce750712a477543672adab57f4c',
      prefix: 'ckt',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = blake160PubkeyToAddress(fixture.str, {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })

  it('pubkey to address', () => {
    const fixture = {
      pubkey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      prefix: 'ckt',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = pubkeyToAddress(hexToBytes(fixture.pubkey), {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })
})
