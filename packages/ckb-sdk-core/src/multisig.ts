import { blake2b, PERSONAL, hexToBytes } from '@nervosnetwork/ckb-sdk-utils'

export type MultisigConfig = {
  r: number
  m: number
  n: number
  blake160s: string[]
}

export function isMultisigConfig(config: any): config is MultisigConfig {
  return config
    && typeof config.r === 'number'
    && typeof config.m === 'number'
    && typeof config.n === 'number'
    && Array.isArray(config.blake160s)
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
  if (config.r > config.m) throw new Error(`For m of n multisig sign, r shouldn't be greater than m`)
  if (config.n !== config.blake160s.length) throw new Error(`For m of n multisig sign, signer's length should equal with n`)
}

export const serializeMultisigConfig = (config: MultisigConfig) => {
  validateMultisigConfig(config)
  // default s is 00
  return `0x00${toHex(config.r)}${toHex(config.m)}${toHex(config.n)}${config.blake160s.reduce((pre, cur) => pre + cur.slice(2), '')}`
}

export const hashMultisig = (config: MultisigConfig) => {
  const blake2bHash = blake2b(32, null, null, PERSONAL)
  blake2bHash.update(hexToBytes(serializeMultisigConfig(config)))
  return `0x${blake2bHash.digest('hex')}`.slice(0, 42)
}

export const getMultisigStatus = (config: MultisigConfig, signatures: CKBComponents.Bytes[] = []) => {
  let signedForM = 0
  let signedForR = 0
  for (let i = 0; i < config.n; i++) {
    if (signatures.includes(config.blake160s[i])) {
      if (i < config.r) {
        signedForR += 1
      } else {
        signedForM += 1
      }
    }
  }
  if (signedForM + signedForR === 0) {
    return SignStatus.Unsigned
  }
  if (signedForM > config.m - config.r) {
    throw new Error('More signature for multisig')
  }
  if (signedForM + signedForR < config.m) {
    return SignStatus.PartiallySigned
  }
  return SignStatus.Signed
}
