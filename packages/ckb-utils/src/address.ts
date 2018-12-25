// const Buffer = require('safe-buffer').Buffer
const bech32 = require('bech32')
const bs58check = require('bs58check')

const fromBase58Check = (address: string) => {
  'use strict'

  const payload = bs58check.decode(address)
  if (payload.length !== 32) throw new Error('Invalid Address')
  const version = payload.readUint8(0)
  const hash = payload.slice(1)
  return {
    version,
    hash,
  }
}
