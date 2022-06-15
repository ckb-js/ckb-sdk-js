const signWitnessGroup = require('../../lib/signWitnessGroup').default
const fixtures = require('./fixtures.json')

describe('test sign witness group', () => {
  const fixtureTable = Object.entries(
    fixtures,
  ).map(([title, { privateKey, transactionHash, witnesses, multisigConfig, expected, exception }]) => [
    title,
    privateKey,
    transactionHash,
    witnesses,
    multisigConfig,
    exception,
    expected,
  ])

  test.each(fixtureTable)('%s', (_title, privateKey, transactionHash, witnesses, multisigConfig, exception, expected) => {
    expect.assertions(1)
    if (exception !== undefined) {
      expect(() => signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)).toThrowError(exception)
    } else if (privateKey !== undefined) {
      const signedWitnessGroup = signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)
      expect(signedWitnessGroup).toEqual(expected)
    }
  })


  describe('sk is function', () => {
    const transactionHash = '0x4a4bcfef1b7448e27edf533df2f1de9f56be05eba645fb83f42d55816797ad2a'
    const witnesses =  [
      {
        "lock": "",
        "inputType": "",
        "outputType": ""
      },
      {
        "lock": "",
        "inputType": "",
        "outputType": ""
      }
    ]
    const multisigConfig = {
      r: 1,
      m: 1,
      n: 2,
      blake160s: ["0x7c021957a27000e794f25828270f187c791443e3", "0xd93b3564ef1b2dcf7bca781f968b3c7d2db85fd1"]
    }
    it('sk is sync', () => {
      const privateKey = v => v
      const signedWitnessGroup = signWitnessGroup(privateKey, transactionHash, witnesses)
      expect(signedWitnessGroup).toEqual([
        '0x34000000100000003400000034000000200000007739c6307c4e3698a8a8ebfdb3908a29a7cb5a382040c89806cace1ddc538b0e',
        {
          "lock": "",
          "inputType": "",
          "outputType": ""
        }
      ])
    })
    it('sk is sync with multisigConfig', () => {
      const privateKey = v => v
      const signedWitnessGroup = signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)
      expect(signedWitnessGroup).toEqual([
        {
          "lock": "0x040db42399af0c6e32cb68160079cc40c4e8d207052fec335c52b76e3442a8a3",
          "inputType": "",
          "outputType": ""
        },
        {
          "lock": "",
          "inputType": "",
          "outputType": ""
        }
      ])
    })

    it('sk result is promise', async () => {
      const privateKey = (v) => Promise.resolve(v)
      const signedWitnessGroup = await signWitnessGroup(privateKey, transactionHash, witnesses)
      expect(signedWitnessGroup).toEqual([
        '0x34000000100000003400000034000000200000007739c6307c4e3698a8a8ebfdb3908a29a7cb5a382040c89806cace1ddc538b0e',
        {
          "lock": "",
          "inputType": "",
          "outputType": ""
        }
      ])
    })

    it('sk result is promise with multisigConfig', async () => {
      const privateKey = (v) => Promise.resolve(v)
      const signedWitnessGroup = await signWitnessGroup(privateKey, transactionHash, witnesses, multisigConfig)
      expect(signedWitnessGroup).toEqual([
        {
          "lock": "0x040db42399af0c6e32cb68160079cc40c4e8d207052fec335c52b76e3442a8a3",
          "inputType": "",
          "outputType": ""
        },
        {
          "lock": "",
          "inputType": "",
          "outputType": ""
        }
      ])
    })
  })
})
