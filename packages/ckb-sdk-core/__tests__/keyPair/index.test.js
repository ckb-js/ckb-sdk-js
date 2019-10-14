const { default: KeyPair } = require('../../lib/keyPair')
const { generateKeyPair: generateKeyPairFixtures } = require('./fixtures.json')

describe('key pair', () => {
  describe('generate key pair', () => {
    const fixtureTable = Object.entries(generateKeyPairFixtures).map(
      ([title, { privateKey, expected, exception, ...config }]) => [title, privateKey, config, expected, exception]
    )

    test.each(fixtureTable)('%s', (_title, privateKey, config, expected, exception) => {
      const option = Object.keys(config).length ? config : undefined
      if (undefined !== expected) {
        const keyPair = new KeyPair(privateKey, option)
        expect(keyPair.publicKeyHash).toBe(expected.publicKeyHash)
        expect(keyPair.testnetAddress).toBe(expected.testnetAddress)
        expect(keyPair.mainnetAddress).toBe(expected.mainnetAddress)
      }
      if (undefined !== exception) {
        expect(() => new KeyPair(privateKey, option)).toThrowError(exception)
      }
    })
  })
})
