const { privateKeyToPublicKey, privateKeyToAddress, scriptToHash, rawTransactionToHash, calculateMaximumWithdraw, extractDAOData } = require('../..')
const exceptions = require('../../lib/exceptions')
const rawTransactionToHashFixtures = require('./rawTransactionToHash.fixtures.json')

const { ParameterRequiredException } = exceptions

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
  expect(privateKeyToAddress(fixture.privateKey)).toBe(fixture.mainnetAddress)
  expect(
    privateKeyToAddress(fixture.privateKey, {
      prefix: 'ckb',
    }),
  ).toBe(fixture.mainnetAddress)
  expect(
    privateKeyToAddress(fixture.privateKey, {
      prefix: 'ckt',
    }),
  ).toBe(fixture.testnetAddress)
})

describe('calculate-maximum-withdraw', () => {
  const outputCell = {
    "capacity":"0xe8d4a51000",
    "lock":{
        "args":"0xf601cac75568afec3b9c9af1e1ff730062007685",
        "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hashType":"type"
    },
    "type":{
        "args":"0x",
        "codeHash":"0x82d76d1b75fe2fd9a27dfbaa65a039221a380d76c926f378d3f81cf3e7e13f2e",
        "hashType":"type"
    }
  }
  expect(
    calculateMaximumWithdraw(
    outputCell,
    '0x0000000000000000',
    '0x1aaf2ca6847c223c3ef9e8c069c9250020212a6311e2d30200609349396eb407',
    '0x9bafffa73e432e3c94c6f9db34cb25009f9e4efe4b5fd60200ea63c6d4ffb407'
  )).toBe('0xe8df95141e')
})

describe('extract header dao', () => {
  const DAOData = extractDAOData('0x1aaf2ca6847c223c3ef9e8c069c9250020212a6311e2d30200609349396eb407')
  expect(DAOData.c).toBe('0x3c227c84a62caf1a')
  expect(DAOData.ar).toBe('0x0025c969c0e8f93e')
  expect(DAOData.s).toBe('0x02d3e211632a2120')
  expect(DAOData.u).toBe('0x07b46e3949936000')
})