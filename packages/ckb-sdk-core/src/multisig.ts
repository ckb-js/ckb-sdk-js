import { blake2b, PERSONAL, hexToBytes, scriptToHash, systemScripts } from '@nervosnetwork/ckb-sdk-utils'

export type MultisigConfig = {
  r: number
  m: number
  n: number
  blake160s: string[]
}

export type Signatures = Record<CKBComponents.Hash, CKBComponents.Bytes[]>

export enum SignStatus {
  Signed = 'Signed',
  Unsigned = 'Unsigned',
  PartiallySigned = 'PartiallySigned'
}

const validateMultisigCount = (v: number) => {
  if (v < 0 || v > 255) {
    throw new Error('For multisig sign, signer should between 0 and 255')
  }
}

const toHex = (v: number) => {
  return v.toString(16).padStart(2, '0')
}

const validateMultisigConfig = (config: MultisigConfig) => {
  validateMultisigCount(config.r)
  validateMultisigCount(config.m)
  validateMultisigCount(config.n)
  if (config.m > config.n) throw new Error(`For m of n multisig sign, m shouldn't be greater than n`)
  if (config.r > config.n) throw new Error(`For m of n multisig sign, r shouldn't be greater than n`)
  if (config.n !== config.blake160s.length) throw new Error(`For m of n multisig sign, signer's length should equal with n`)
}

export const serizeMultisigConfig = (config: MultisigConfig) => {
  validateMultisigConfig(config)
  // default s is 00
  return `0x00${toHex(config.r)}${toHex(config.m)}${toHex(config.n)}${config.blake160s.reduce((pre, cur) => pre + cur.slice(2), '')}`
}

export const hashMultisig = (config: MultisigConfig) => {
  const blake2bHash = blake2b(32, null, null, PERSONAL)
  blake2bHash.update(hexToBytes(serizeMultisigConfig(config)))
  return `0x${blake2bHash.digest('hex')}`.slice(0, 42)
}

export const getMultisigScriptHash = (config: MultisigConfig) => {
  return scriptToHash({
    args: hashMultisig(config),
    codeHash: systemScripts.SECP256K1_MULTISIG.codeHash,
    hashType: systemScripts.SECP256K1_MULTISIG.hashType
  })
}

export const getMultisigStatus = (config: MultisigConfig, signatures: CKBComponents.Bytes[] = []) => {
  let signed = 0
  signatures.forEach(blake160 => {
    if (config.blake160s.includes(blake160)) {
      signed += 1
    }
  })
  if (signed === 0) {
    return SignStatus.Unsigned
  }
  if (signed < config.m) {
    return SignStatus.PartiallySigned
  }
  for (let i = 0; i < config.r; i++) {
    if (!signatures.includes(config.blake160s[i])) {
      return SignStatus.PartiallySigned
    }
  }
  return SignStatus.Signed
}