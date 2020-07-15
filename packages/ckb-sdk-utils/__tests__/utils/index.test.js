const ckbUtils = require('../../lib')
const exceptions = require('../../lib/exceptions')
const bech32Fixtures = require('./bech32.fixtures.json')
const blake2bFixtures = require('./blake2b.fixtures.json')
const rawTransactionToHashFixtures = require('./rawTransactionToHash.fixtures.json')
const transactionFeeFixtures = require('./transactionFee.fixtures.json')
const transactionSizeFixture = require('./transactionSize.fixture.json')

const {
  blake2b,
  blake160,
  bech32,
  bech32Address,
  toAddressPayload,
  privateKeyToPublicKey,
  privateKeyToAddress,
  pubkeyToAddress,
  parseAddress,
  parseEpoch,
  hexToBytes,
  bytesToHex,
  scriptToHash,
  rawTransactionToHash,
  PERSONAL,
  AddressType,
  fullPayloadToAddress,
  calculateTransactionFee,
  calculateSerializedTxSizeInBlock,
} = ckbUtils

const { ParameterRequiredException, HexStringWithout0xException } = exceptions

describe('parse epoch', () => {
  const fixture = {
    epoch: '0x1e00017000090',
    expected: {
      length: '0x1e0',
      index: '0x17',
      number: '0x90',
    },
  }

  expect(parseEpoch(fixture.epoch)).toEqual(fixture.expected)
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

  test.each(blake2bFixtures)('%s', ({ outlen, out, input, key, salt, personal }) => {
    if (+outlen < 16) {
      expect(() => {
        blake2b(
          outlen,
          key ? Buffer.from(key, 'hex') : null,
          salt ? Buffer.from(salt, 'hex') : null,
          personal ? Buffer.from(personal, 'hex') : null,
        )
      }).toThrowError(`Expect outlen to be at least 16, but ${outlen} received`)
    } else {
      const s = blake2b(
        outlen,
        key ? Buffer.from(key, 'hex') : null,
        salt ? Buffer.from(salt, 'hex') : null,
        personal ? Buffer.from(personal, 'hex') : null,
      )
      s.update(Buffer.from(input, 'hex'))
      const digest = s.digest('hex')
      expect(digest).toBe(out)
    }
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
      scriptHash: '0x77c93b0632b5b6c3ef922c5b7cea208fb0a7c427a13d50e13d3fefad17e0c590',
    },
    'Script with hash type of data': {
      script: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: ['0x01'],
        hashType: 'data',
      },
      scriptHash: '0x67951b34bce20cb71b7e235c1f8cda259628d99d94825bffe549c23b4dd2930f',
    },
    'Script with hash type of type': {
      script: {
        codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        args: ['0x01'],
        hashType: 'type',
      },
      scriptHash: '0xd39f84d4702f53cf8625da4411be1640b961715cb36816501798fedb70b6e0fb',
    },
  }
  test.each(Object.keys(fixtures))('%s', fixtureName => {
    const fixture = fixtures[fixtureName]
    const scriptHash = scriptToHash(fixture.script)
    expect(scriptHash).toBe(fixture.scriptHash)
  })

  it('empty input should throw an error', () => {
    expect(() => scriptToHash()).toThrow(new ParameterRequiredException('Script'))
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

describe('privateKeyToPublicKey', () => {
  const fixture = {
    privateKey: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    publicKey: '0x03a706ad8f73115f90500266f273f7571df9429a4cfb4bbfbcd825227202dabad1',
  }
  expect(privateKeyToPublicKey(fixture.privateKey)).toBe(fixture.publicKey)
})

describe('privateKeyToAddress', () => {
  const fixture = {
    privateKey: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    mainnetAddress: 'ckb1qyqw975zuu9svtyxgjuq44lv7mspte0n2tmqqm3w53',
    testnetAddress: 'ckt1qyqw975zuu9svtyxgjuq44lv7mspte0n2tmqa703cd',
  }
  expect(privateKeyToAddress(fixture.privateKey)).toBe(fixture.testnetAddress)
  expect(
    privateKeyToAddress(fixture.privateKey, {
      prefix: 'ckb',
    }),
  ).toBe(fixture.mainnetAddress)
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

  it('fullPayloadToAddress with hash type of Data', () => {
    const fixture = {
      params: {
        args: '0x36c329ed630d6ce750712a477543672adab57f4c',
        type: AddressType.DataCodeHash,
        prefix: 'ckt',
        codeHash: '0xa656f172b6b45c245307aeb5a7a37a176f002f6f22e92582c58bf7ba362e4176',
      },
      expected: 'ckt1q2n9dutjk669cfznq7httfar0gtk7qp0du3wjfvzck9l0w3k9eqhvdkr98kkxrtvuag8z2j8w4pkw2k6k4l5czshhac',
    }
    const address = fullPayloadToAddress(fixture.params)
    expect(address).toBe(fixture.expected)
  })

  it('fullPayloadToAddress with hash type of Type', () => {
    const fixture = {
      params: {
        args: '0x36c329ed630d6ce750712a477543672adab57f4c',
        type: AddressType.TypeCodeHash,
        prefix: 'ckt',
        codeHash: '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2',
      },
      expected: 'ckt1qsvf96jqmq4483ncl7yrzfzshwchu9jd0glq4yy5r2jcsw04d7xlydkr98kkxrtvuag8z2j8w4pkw2k6k4l5c02auef',
    }
    const address = fullPayloadToAddress(fixture.params)
    expect(address).toBe(fixture.expected)
  })

  it('fullPayloadToAddress with default params of type = AddressType.DataCodeHash and prefix = ckt', () => {
    const fixture = {
      params: {
        args: '0x36c329ed630d6ce750712a477543672adab57f4c',
        codeHash: '0xa656f172b6b45c245307aeb5a7a37a176f002f6f22e92582c58bf7ba362e4176',
      },
      expected: 'ckt1q2n9dutjk669cfznq7httfar0gtk7qp0du3wjfvzck9l0w3k9eqhvdkr98kkxrtvuag8z2j8w4pkw2k6k4l5czshhac',
    }
    const address = fullPayloadToAddress(fixture.params)
    expect(address).toBe(fixture.expected)
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
    expect(() => toAddressPayload(publicKeyHash)).toThrow(new HexStringWithout0xException(publicKeyHash))
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
      hrp: '0100',
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = parseAddress(fixture.addr, 'hex')
    expect(parsedHex).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
    const parsedBytes = parseAddress(fixture.addr, 'binary')
    expect(bytesToHex(parsedBytes)).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
  })

  it('parse address with default options encode: binary', () => {
    const fixture = {
      addr: 'ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83',
      hrp: '0100',
      blake160Pubkey: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const parsedHex = bytesToHex(parseAddress(fixture.addr))
    expect(parsedHex).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
    const parsedBytes = parseAddress(fixture.addr)
    expect(bytesToHex(parsedBytes)).toBe(`0x${fixture.hrp}${fixture.blake160Pubkey}`)
  })
})

describe('transaction fee', () => {
  const fixtureTable = Object.entries(
    transactionFeeFixtures,
  ).map(([title, { transactionSize, feeRate, expected, exception }]) => [
    title,
    typeof transactionSize === 'number' ? BigInt(transactionSize) : transactionSize,
    typeof feeRate === 'number' ? BigInt(feeRate) : feeRate,
    expected,
    exception,
  ])
  test.each(fixtureTable)('%s', (_title, transactionSize, feeRate, expected, exception) => {
    if (undefined !== expected) {
      expect(calculateTransactionFee(transactionSize, feeRate)).toBe(expected)
    }
    if (undefined !== exception) {
      expect(() => calculateTransactionFee(transactionSize, feeRate)).toThrowError(exception)
    }
  })
})

describe('transaction size', () => {
  const { transaction, expected } = transactionSizeFixture
  expect(calculateSerializedTxSizeInBlock(transaction)).toBe(expected)
})
