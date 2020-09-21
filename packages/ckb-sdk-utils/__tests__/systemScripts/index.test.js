const { systemScripts } = require('../..')
const fixtures = require('./fixtures.json')

const getInfo = ({ codeHash, hashType, depType, mainnetOutPoint, testnetOutPoint }, isMain) => {
  const outPoint = isMain ? mainnetOutPoint : testnetOutPoint

  return { codeHash, hashType, depType, ...outPoint }
}

describe('Test System Scripts', () => {
  describe('Test secp256k1/blake160', () => {
    it('should has mainnet script', () => {
      expect(getInfo(systemScripts.SECP256K1_BLAKE160, true)).toEqual(fixtures.SECP256K1_BLAKE160.mainnet)
    })

    it('should has testnet script', () => {
      expect(getInfo(systemScripts.SECP256K1_BLAKE160, false)).toEqual(fixtures.SECP256K1_BLAKE160.testnet)
    })
  })

  describe('Test secp256k1/multisig', () => {
    it('should has mainnet script', () => {
      expect(getInfo(systemScripts.SECP256K1_MULTISIG, true)).toEqual(fixtures.SECP256K1_MULTISIG.mainnet)
    })

    it('should has testnet script', () => {
      expect(getInfo(systemScripts.SECP256K1_MULTISIG, false)).toEqual(fixtures.SECP256K1_MULTISIG.testnet)
    })
  })

  describe('Test anyone can pay', () => {
    it("shouldn't has mainnet script", () => {
      expect(systemScripts.ANYONE_CAN_PAY.mainnet).toBeUndefined()
    })

    it('should has testnet script', () => {
      expect(getInfo(systemScripts.ANYONE_CAN_PAY, false)).toEqual(fixtures.ANYONE_CAN_PAY.testnet)
    })
  })

  describe('Test nervos dao', () => {
    it('should has mainnet script', () => {
      expect(getInfo(systemScripts.NERVOS_DAO, true)).toEqual(fixtures.NERVOS_DAO.mainnet)
    })

    it('should has testnet script', () => {
      expect(getInfo(systemScripts.NERVOS_DAO, false)).toEqual(fixtures.NERVOS_DAO.testnet)
    })
  })

  describe('Test simple udt', () => {
    it("shouldn't has mainnet script", () => {
      expect(systemScripts.SIMPLE_UDT.mainnet).toBeUndefined()
    })

    it('should has testnet script', () => {
      expect(getInfo(systemScripts.SIMPLE_UDT, false)).toEqual(fixtures.SIMPLE_UDT.testnet)
    })
  })
})
