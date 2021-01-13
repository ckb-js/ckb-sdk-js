# `ckb-sdk-utils`

`@nervosnetwork/ckb-sdk-utils` is the utils module of `@nervosnetwork/ckb-sdk-core`, which provides necessary methods for the sdk, including encryption, key-pair generation, address generation and so on.

See [Full Doc](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/README.md)

## Most Used Utilities

- [Address](#address)

  - `utils.AddressPrefix`
  - `utils.AddressType`
  - `utils.privateKeyToAddress`: get address from private key
  - `utils.pubkeyToAddress`: get address from public key
  - `utils.bech32Address`: args to short/full version address
  - `utils.fullPayloadToAddress`: script to full version address
  - `utils.parseAddress`: get address payload
  - `utils.addressToScript`: get lock script from address

- [Utils](#utils)

  - `utils.blake160`
  - `utils.bytesToHex`
  - `utils.hexToBytes`
  - `utils.toUint16Le`
  - `utils.toUint32Le`
  - `utils.toUint64Le`

- [System Scripts](#system-scripts)

### Address

```js
/**
 * @description address prefix
 * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#wrap-to-address
 */
utils.AddressPrefix
// {
//   Mainnet: 'ckb', // mainnet prefix
//   Testnet: 'ckt', // testnet prefix
// }
```

```js
/**
 * @description address payload format types
 * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md#payload-format-types
 */
utils.AddressType
// {
//   HashIdx: '0x01',      // short version address
//   DataCodeHash: '0x02', // full version address with hash type = 'data'
//   TypeCodeHash: '0x04', // full version address with hash type = 'type'
// }
```

```js
/**
 * @description get short version address by private key
 */
utils.privateKeyToAddress('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', {
  prefix: utils.AddressPrefix.Mainnet, // prefix is optional, default to 'ckb'
})
// ckb1qyqw975zuu9svtyxgjuq44lv7mspte0n2tmqqm3w53
```

```js
/**
 * @description get short version address by public key
 */
utils.pubkeyToAddress('0x024a501efd328e062c8675f2365970728c859c592beeefd6be8ead3d901330bc01', {
  prefix: utils.AddressPrefix.Testnet,
})
// ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83
```

```js
/**
 * @description get short/full version address from args
 */
utils.bech32Address('0x36c329ed630d6ce750712a477543672adab57f4c', {
  prefix: utils.AddressPrefix.Mainnet,
  type: utils.AddressType.HashIdx,
  codeHashOrCodeHashIndex: '0x00',
})
// ckb1qyqrdsefa43s6m882pcj53m4gdnj4k440axqdt9rtd
```

```js
/**
 * @description get full version address by a lock script
 * @params args - lock.args
 * @params type - utils.AddressType.DataCodeHash if lock.hash_type = 'data'
 *                otherwise utils.AddressType.TypeCodeHash
 * @params prefix - utils.AddressPrefix.Mainnet or utils.AddressPrefix.Testnet
 * @params codeHash - lock.code_hash
 */
utils.fullPayloadToAddress({
  args: '0x36c329ed630d6ce750712a477543672adab57f4c',
  type: utils.AddressType.DataCodeHash,
  prefix: utils.AddressPrefix.Testnet,
  codeHash: '0xa656f172b6b45c245307aeb5a7a37a176f002f6f22e92582c58bf7ba362e4176',
})
// ckt1q2n9dutjk669cfznq7httfar0gtk7qp0du3wjfvzck9l0w3k9eqhvdkr98kkxrtvuag8z2j8w4pkw2k6k4l5czshhac
```

```js
/**
 * @description parse short version address
 *              the returned value is `type | index | args`,
 *              in this case `01 | 00 | 36...4c`
 */
utils.parseAddress('ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83', 'hex')
// 0x010036c329ed630d6ce750712a477543672adab57f4c

/**
 * @description parse full version address
 *              the returned value is ` type | code hash | args`
 *              in this case `02 | 9b...e8 | b3...64`
 */
utils.parseAddress(
  'ckb1q2da0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xw3vumhs9nvu786dj9p0q5elx66t24n3kxgdwd2q8',
  'hex',
)
// 0x029bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8b39bbc0b3673c7d36450bc14cfcdad2d559c6c64
```

```js
/**
 * @description restore lock script from a short version address
 */
utils.addressToScript('ckt1qyqrdsefa43s6m882pcj53m4gdnj4k440axqswmu83')
// {
//   codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
//   hashType: 'type',
//   args: '0x36c329ed630d6ce750712a477543672adab57f4c'
// }

/**
 * @description restore lock script from a full version address
 */
utils.addressToScript('ckb1qsvf96jqmq4483ncl7yrzfzshwchu9jd0glq4yy5r2jcsw04d7xlydkr98kkxrtvuag8z2j8w4pkw2k6k4l5czfy37k')
// {
//   codeHash: '0x1892ea40d82b53c678ff88312450bbb17e164d7a3e0a90941aa58839f56f8df2',
//   hashType: 'type',
//   args: '0x36c329ed630d6ce750712a477543672adab57f4c'
// }
```

### Utils

```plain
/**
 * @description get the blake160 digest of a message
 */
utils.blake160(
  new Uint8Array([ 2, 74, 80, 30, 253, 50, 142, 6, 44, 134, 117, 242, 54, 89, 112, 114, 140, 133, 156, 89, 43, 238, 239, 214, 190, 142, 173, 61, 144, 19, 48, 188, 1]),
  'hex',
)
// 36c329ed630d6ce750712a477543672adab57f4c
```

```js
utils.bytesToHex(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]))
// 0x48656c6c6f20576f726c64
utils.hexToBytes('0x48656c6c6f20576f726c64')
// Uint8Array [ 72, 101, 108, 108, 111,  32, 87, 111, 114, 108, 100 ]
utils.toUint16Le('0xbcd')
// 0xcd0b
utils.toUint32Le('0x123456')
// 0x56341200
utils.toUint64Le('0x1234567890abcdef')
// 0xefcdab9078563412
```

```js
utils.parseEpoch('0x2003e80010000200')
// { length: '0x3e8', index: '0x10', number: '0x200' }
utils.serializeEpoch({ length: '0x3e8', index: '0x10', number: '0x200' })
// 0x2003e80010000200
```

```js
utils.rawTransactionToHash(rawTx)
// tx hash
```

```js
/**
 * @description get hash of a script
 */
utils.scriptToHash({
  codeHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  args: '0x01',
  hashType: 'type',
})
// 0xd39f84d4702f53cf8625da4411be1640b961715cb36816501798fedb70b6e0fb
```

### System Scripts

[System Scripts](https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-utils/src/systemScripts.ts)
