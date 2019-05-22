# `ckb-sdk-address`

`@nervosnetwork/ckb-sdk-address` is the address module of `@nervosnetwork/ckb-sdk-core`.

Its current responsibility is just to generate an address object, the algorithm will be introduced in an RFC in the near future.

In a nutshell, the address format is similar to [BIP-0173](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)

1. this module takes a private key and then calculates the corresponding public key with secp256k1 algorithm;
2. use blake160 algorithm to hash the public key and get a blake160-ed string;
3. bech32 the blake160-ed string with three options(prefix, type, binIndex) to get a bech32-formatted address.

Detailed methods could be found in `@nervosnetwork/ckb-sdk-utils`

## Address options

> The meanings of the options will be explained in the RFC.

1. Prefix

   - 'ckb' for the mainnet
   - 'ckt' for the testnet

2. type

   - '0x00' for wallet build-in binary_hash ref id
   - '0x01' for binary_hash

3. binIndex

   - 'P2PH'

## Installation

Install the package with [yarn](https://yarnpkg.com/):

```sh
$ yarn add @nervosnetwork/ckb-sdk-address
```

Or install the package with [npm](https://npmjs.com):

```sh
$ npm install --save @nervosnetwork/ckb-sdk-address
```

## Usage

```javascript
const Address = require('@nervosnetwork/ckb-sdk-address').default

const privateKey = 'your private key'

const address = new Address(privateKey, { compressed: true, prefix: 'ckt' })
console.log(address.value)
```
