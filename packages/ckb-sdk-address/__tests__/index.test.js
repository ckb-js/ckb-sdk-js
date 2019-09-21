const { default: Address } = require('../lib')
const { generateAddress: generateAddressFixtures } = require('./fixtures.json')

describe('ckb-sdk-address', () => {
  describe('generate address', () => {
    const fixtureTable = Object.entries(generateAddressFixtures).map(
      ([title, { privateKey, expected, exception, ...config }]) => [title, privateKey, config, expected, exception]
    )

    test.each(fixtureTable)('%s', (_title, privateKey, config, expected, exception) => {
      const option = Object.keys(config).length ? config : undefined
      if (undefined !== expected) {
        const address = new Address(privateKey, option)
        expect(address.publicKeyHash).toBe(expected.publicKeyHash)
        expect(address.value).toBe(expected.address)
      }
      if (undefined !== exception) {
        expect(() => new Address(privateKey, option)).toThrow(new Error(exception))
      }
    })
  })
})
