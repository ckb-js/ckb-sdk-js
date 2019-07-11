const ckbUtils = require('../lib')
const bech32Fixtures = require('./bech32-fixtures.json')

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

  /* eslint-disable max-len */
  it('utf8 to hex', () => {
    const utf8Str =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

    const byBuffer = Buffer.from(utf8Str, 'utf8').toString('hex')
    const byUtils = utf8ToHex(utf8Str)
    expect(byUtils).toBe(byBuffer)
  })

  it('hex to utf8', () => {
    const hexStr =
      '4c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e7365637465747572206164697069736963696e6720656c69742c2073656420646f20656975736d6f642074656d706f7220696e6369646964756e74207574206c61626f726520657420646f6c6f7265206d61676e6120616c697175612e20557420656e696d206164206d696e696d2076656e69616d2c2071756973206e6f737472756420657865726369746174696f6e20756c6c616d636f206c61626f726973206e69736920757420616c697175697020657820656120636f6d6d6f646f20636f6e7365717561742e2044756973206175746520697275726520646f6c6f7220696e20726570726568656e646572697420696e20766f6c7570746174652076656c697420657373652063696c6c756d20646f6c6f726520657520667567696174206e756c6c612070617269617475722e204578636570746575722073696e74206f6363616563617420637570696461746174206e6f6e2070726f6964656e742c2073756e7420696e2063756c706120717569206f666669636961206465736572756e74206d6f6c6c697420616e696d20696420657374206c61626f72756d2e'
    const byBuffer = Buffer.from(hexStr, 'hex').toString('utf8')
    const byUtils = hexToUtf8(hexStr)
    expect(byUtils).toBe(byBuffer)
  })
  /* eslint-enable max-len */
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
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: [[1]],
      },
      lockHash: 'dade0e507e27e2a5995cf39c8cf454b6e70fa80d03c1187db7a4cb2c9eab79da',
    }
    const lockHash = lockScriptToHash(fixture.script)
    expect(lockHash).toBe(fixture.lockHash)
  })
})

describe('address', () => {
  it('identifier to address payload', () => {
    const fixture = {
      identifier: '36c329ed630d6ce750712a477543672adab57f4c',
      payload: '015032504836c329ed630d6ce750712a477543672adab57f4c',
    }
    const payload = bytesToHex(toAddressPayload(fixture.identifier))
    expect(payload).toBe(fixture.payload)
  })

  it('identifier to address with prefix of ckt', () => {
    const fixture = {
      identifier: '36c329ed630d6ce750712a477543672adab57f4c',
      prefix: 'ckt',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = bech32Address(fixture.identifier, {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })

  it('identifier to address with prefix of ckb', () => {
    const fixture = {
      identifier: '36c329ed630d6ce750712a477543672adab57f4c',
      prefix: 'ckb',
      address: 'ckb1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6vqdd7em',
    }
    const address = bech32Address(fixture.identifier, {
      prefix: fixture.prefix,
    })
    expect(address).toBe(fixture.address)
  })

  it('bech32Address with empty options', () => {
    const fixture = {
      identifier: '36c329ed630d6ce750712a477543672adab57f4c',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = bech32Address(fixture.identifier, {})
    expect(address).toBe(fixture.address)
  })

  it('bech32Address with default options which should be prefix: ckb, type: binIndx, binIdx: P2PH', () => {
    const fixture = {
      identifier: '36c329ed630d6ce750712a477543672adab57f4c',
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    }
    const address = bech32Address(fixture.identifier)
    expect(address).toBe(fixture.address)
  })

  const pubkeyToAddressFixtures = {
    'with configuration of { prefix: ckt }': {
      pubkey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: {
        prefix: 'ckt',
      },
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    },
    'with empty configuration': {
      pubkey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: {},
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    },
    'with undefined configuration': {
      pubkey: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      config: undefined,
      address: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
    },
  }
  test.each(Object.keys(pubkeyToAddressFixtures))('%s', caseName => {
    const fixture = pubkeyToAddressFixtures[caseName]
    const address = pubkeyToAddress(hexToBytes(fixture.pubkey), fixture.config)
    expect(address).toBe(fixture.address)
  })

  it('parse address', () => {
    const fixture = {
      addr: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
      prefix: 'ckt',
      hrp: `01${Buffer.from('P2PH').toString('hex')}`,
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = parseAddress(fixture.addr, fixture.prefix, 'hex')
    expect(parsedHex).toBe(fixture.hrp + fixture.blake160Pubkey)
    const parsedBytes = parseAddress(fixture.addr, fixture.prefix)
    expect(bytesToHex(parsedBytes)).toBe(fixture.hrp + fixture.blake160Pubkey)
  })

  it('parse address with default options prefix: ckt, encode: binary', () => {
    const fixture = {
      addr: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
      prefix: 'ckt',
      hrp: `01${Buffer.from('P2PH').toString('hex')}`,
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = bytesToHex(parseAddress(fixture.addr))
    expect(parsedHex).toBe(fixture.hrp + fixture.blake160Pubkey)
    const parsedBytes = parseAddress(fixture.addr, fixture.prefix)
    expect(bytesToHex(parsedBytes)).toBe(fixture.hrp + fixture.blake160Pubkey)
  })

  it('parser incorrect address', () => {
    const fixture = {
      addr: 'ckt1q9gry5zgxmpjnmtrp4kww5r39frh2sm89tdt2l6v234ygf',
      incorrectPrefix: 'ckb',
    }
    expect(() => parseAddress(fixture.addr, fixture.incorrectPrefix)).toThrow('Prefix not matched')
  })
})
