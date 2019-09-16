const ckbUtils = require('../../lib')
const exceptions = require('../../lib/exceptions')
const bech32Fixtures = require('./bech32.fixtures.json')
const rawTransactionToHashFixtures = require('./rawTransactionToHash.fixtures.json')
const transformerFixtures = require('./transformer.fixtures.json')
const { ArgumentRequired } = require('../../lib/exceptions')

const {
  blake2b,
  blake160,
  bech32,
  bech32Address,
  toAddressPayload,
  pubkeyToAddress,
  parseAddress,
  hexToBytes,
  bytesToHex,
  utf8ToHex,
  hexToUtf8,
  scriptToHash,
  rawTransactionToHash,
  PERSONAL,
  toHexInLittleEndian,
} = ckbUtils

const { HexStringShouldStartWith0x, InvalidHexString } = exceptions

describe('transformer', () => {
  describe('hex to bytes', () => {
    const fixtureTable = transformerFixtures.hexToBytes.map(({ hex, expected }) => [hex, expected])
    test.each(fixtureTable)('%s => %j', (hex, exptected) => {
      expect(hexToBytes(hex).join(',')).toBe(exptected.join(','))
    })

    it('hex string without 0x should throw an error', () => {
      expect(() => hexToBytes('abcd12')).toThrow(new HexStringShouldStartWith0x('abcd12'))
    })
  })

  describe('bytes to hex', () => {
    const fixtureTable = transformerFixtures.bytesToHex.map(({ bytes, expected }) => [bytes, expected])
    test.each(fixtureTable)('%j => %s', (bytes, expected) => {
      expect(bytesToHex(bytes)).toEqual(expected)
    })
  })

  describe('utf8 to hex', () => {
    const fixtureTable = transformerFixtures.utf8ToHex.map(({ utf8, expected }) => [utf8, expected])
    test.each(fixtureTable)('%s => %s', (utf8, expected) => {
      expect(utf8ToHex(utf8)).toBe(expected)
    })
  })

  describe('hex to utf8', () => {
    const fixtureTable = transformerFixtures.hexToUtf8.map(({ hex, expected }) => [hex, expected])
    test.each(fixtureTable)('%s => %s', (hex, expected) => {
      expect(hexToUtf8(hex)).toBe(expected)
    })

    it('hex string without 0x should throw an error', () => {
      expect(() => hexToBytes('abcd')).toThrow(new HexStringShouldStartWith0x('abcd'))
    })
  })

  describe('Test toHexInLittleEndian', () => {
    const fixtureTable = transformerFixtures.toHexInLittleEndian.map(({ value, expected }) => [value, expected])
    test.each(fixtureTable)('%s => %s', (value, expected) => {
      expect(toHexInLittleEndian(value)).toBe(expected)
    })
    it('hex string without 0x should throw an error', () => {
      expect(() => toHexInLittleEndian('123')).toThrow(new HexStringShouldStartWith0x('123'))
    })
    it('throw an error when received a input unable to be converted into a number', () => {
      expect(() => toHexInLittleEndian('invalid number')).toThrow(new InvalidHexString('invalid number'))
    })
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
  const fixtures = {
    'Empty script': {
      script: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: [],
        hashType: 'data',
      },
      scriptHash: '0xbd7e6000ffb8e983a6023809037e0c4cedbc983637c46d74621fd28e5f15fe4f',
    },
    'Script with hash type of data': {
      script: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: ['0x01'],
        hashType: 'data',
      },
      scriptHash: '0x5a2b913dfb1b79136fc72a575fd8e93ae080b504463c0066fea086482bfc3a94',
    },
    'Script with hash type of type': {
      script: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: ['0x01'],
        hashType: 'type',
      },
      scriptHash: '0x3d7e565f3831955f0f5cfecdadddeef7e0d106af84ceb0c2f4dbb6ddff88c9bc',
    },
  }
  test.each(Object.keys(fixtures))('%s', fixtureName => {
    const fixture = fixtures[fixtureName]
    const scriptHash = scriptToHash(fixture.script)
    expect(scriptHash).toBe(fixture.scriptHash)
  })

  it('empty input should throw an error', () => {
    expect(() => scriptToHash()).toThrow(new ArgumentRequired('Script'))
  })
})

describe('rawTransactionToHash', () => {
  const fixtureTable = rawTransactionToHashFixtures.rawTransactionToHash.map(({ rawTransaction, expected }) => [
    rawTransaction,
    expected,
  ])

  test.each(fixtureTable)('%j => %s', (rawTransaction, expected) => {
    expect(rawTransactionToHash(rawTransaction)).toBe(expected)
  })
  it('throw an error if the raw transaction is not missing', () => {
    expect(() => rawTransactionToHash(undefined)).toThrow(new Error('Raw transaction is required'))
  })
})

describe('address', () => {
  it('publicKeyHash to address payload', () => {
    const fixture = {
      publicKeyHash: '0x36c329ed630d6ce750712a477543672adab57f4c',
      payload: '0x010036c329ed630d6ce750712a477543672adab57f4c',
    }
    const payload = bytesToHex(toAddressPayload(fixture.publicKeyHash))
    expect(payload).toBe(fixture.payload)
  })

  it('publicKeyHash to address with prefix of ckt', () => {
    const fixture = {
      publicKeyHash: '0x36c329ed630d6ce750712a477543672adab57f4c',
      prefix: 'ckt',
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    }
    const address = bech32Address(fixture.publicKeyHash, {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })

  it('publicKeyHash to address with prefix of ckb', () => {
    const fixture = {
      publicKeyHash: '0x36c329ed630d6ce750712a477543672adab57f4c',
      prefix: 'ckb',
      address: 'ckb1qyqrdsefa43s6m882pcj53m4gdnj4k440axqdt9rtd',
    }
    const address = bech32Address(fixture.publicKeyHash, {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })

  it('publicKeyHash without 0x should throw an error', () => {
    const publicKeyHash = '36c329ed630d6ce750712a477543672adab57f4c'
    expect(() => toAddressPayload(publicKeyHash)).toThrow(new HexStringShouldStartWith0x(publicKeyHash))
  })

  it('bech32Address with empty options', () => {
    const fixture = {
      publicKeyHash: '0x36c329ed630d6ce750712a477543672adab57f4c',
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    }
    const address = bech32Address(fixture.publicKeyHash, {})
    expect(address).toBe(fixture.address)
  })

  it('bech32Address with default options which should be prefix: ckb, type: binIndx, code hash index: 0x00', () => {
    const fixture = {
      publicKeyHash: '0x36c329ed630d6ce750712a477543672adab57f4c',
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    }
    const address = bech32Address(fixture.publicKeyHash)
    expect(address).toBe(fixture.address)
  })

  const pubkeyToAddressFixtures = {
    'with configuration of { prefix: ckt }': {
      pubkey: '0x024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: {
        prefix: 'ckt',
      },
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    },
    'with empty configuration': {
      pubkey: '0x024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: {},
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    },
    'with undefined configuration': {
      pubkey: '0x024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: undefined,
      address: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
    },
  }
  test.each(Object.keys(pubkeyToAddressFixtures))('%s', caseName => {
    const fixture = pubkeyToAddressFixtures[caseName]
    const address = pubkeyToAddress(hexToBytes(fixture.pubkey), fixture.config)
    expect(address).toBe(fixture.address)
  })

  it('parse address', () => {
    const fixture = {
      addr: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
      prefix: 'ckt',
      hrp: '0100',
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = parseAddress(fixture.addr, fixture.prefix, 'hex')
    expect(parsedHex).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
    const parsedBytes = parseAddress(fixture.addr, fixture.prefix)
    expect(bytesToHex(parsedBytes)).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
  })

  it('parse address with default options prefix: ckt, encode: binary', () => {
    const fixture = {
      addr: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
      prefix: 'ckt',
      hrp: '0100',
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = bytesToHex(parseAddress(fixture.addr))
    expect(parsedHex).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
    const parsedBytes = parseAddress(fixture.addr, fixture.prefix)
    expect(bytesToHex(parsedBytes)).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
  })

  it('parser incorrect address', () => {
    const fixture = {
      addr: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
      incorrectPrefix: 'ckb',
    }
    expect(() => parseAddress(fixture.addr, fixture.incorrectPrefix)).toThrow('Prefix not matched')
  })
})
