const ckbUtils = require('../..')
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
  privateKeyToPublicKey,
  privateKeyToAddress,
  scriptToHash,
  rawTransactionToHash,
  PERSONAL,
  calculateTransactionFee,
  calculateSerializedTxSizeInBlock,
} = ckbUtils

const { ParameterRequiredException } = exceptions

describe('blake', () => {
  it('blake2b([]) with personal', () => {
    const fixture = {
      message: new Uint8Array(),
      digest: '44f4c69744d5f8c55d642062949dcae49bc4e7ef43d388c5a12f42b5633d163e',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(fixture.message)
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  it('blake2b(Buffer.from("The quick brown fox jumps over the lazy dog")) with personal', () => {
    const fixture = {
      message: 'The quick brown fox jumps over the lazy dog',
      digest: 'abfa2c08d62f6f567d088d6ba41d3bbbb9a45c241a8e3789ef39700060b5cee2',
    }
    const s = blake2b(32, null, null, PERSONAL)
    s.update(new Uint8Array(Buffer.from(fixture.message, 'utf8')))
    const digest = s.digest('hex')
    expect(digest).toBe(fixture.digest)
  })

  test.each(blake2bFixtures)('%s', ({ outlen, out, input, key, salt, personal }) => {
    if (+outlen < 16) {
      expect(() => {
        blake2b(
          outlen,
          key ? new Uint8Array(Buffer.from(key, 'hex')) : null,
          salt ? new Uint8Array(Buffer.from(salt, 'hex')) : null,
          personal ? new Uint8Array(Buffer.from(personal, 'hex')) : null,
        )
      }).toThrowError(`Expect outlen to be at least 16, but ${outlen} received`)
    } else {
      const s = blake2b(
        outlen,
        key ? new Uint8Array(Buffer.from(key, 'hex')) : null,
        salt ? new Uint8Array(Buffer.from(salt, 'hex')) : null,
        personal ? new Uint8Array(Buffer.from(personal, 'hex')) : null,
      )
      s.update(new Uint8Array(Buffer.from(input, 'hex')))
      const digest = s.digest('hex')
      expect(digest).toBe(out)
    }
  })

  it('blake160', () => {
    const fixture = {
      message: '024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01',
      digest: '36c329ed630d6ce750712a477543672adab57f4c',
    }
    const digest = blake160(new Uint8Array(Buffer.from(fixture.message, 'hex')), 'hex')
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
