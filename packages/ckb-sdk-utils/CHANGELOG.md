# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.41.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.1) (2021-05-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.41.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.0) (2021-05-06)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.40.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.39.0...v0.40.0) (2021-03-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.39.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.2...v0.39.0) (2021-01-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.38.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.1...v0.38.2) (2020-11-30)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.38.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.0...v0.38.1) (2020-11-27)


### Features

* **utils:** update acp lock script ([6d9a85f](https://github.com/nervosnetwork/ckb-sdk-js/commit/6d9a85f05f393216fc06650fd650f43049874a20))





# [0.38.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.37.0...v0.38.0) (2020-11-20)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.37.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.37.0) (2020-10-25)


### Features

* **rpc:** add rpc#pingPeers, rpc#getTransactionProof, rpc#verifyTransactionProof and rpc#clearBannedAddresses ([#506](https://github.com/nervosnetwork/ckb-sdk-js/issues/506)) ([61efe5e](https://github.com/nervosnetwork/ckb-sdk-js/commit/61efe5e7b7638c7a41163e3b3b05bc92261f711a))
* **utils:** remove support of blake2b-wasm@v2.1.0 ([b94d318](https://github.com/nervosnetwork/ckb-sdk-js/commit/b94d31886fe44f56812eedf5f035e41d9c0c9240))





## [0.36.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.36.2) (2020-10-20)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils


### BREAKING CHANGES

* **utils:** Remove explicit support of blake2b-wasm@v2.1.0





## [0.36.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.0...v0.36.1) (2020-09-26)


### Features

* **utils:** disable blake2b-wasm when the host is iOS 11 ([4c70554](https://github.com/nervosnetwork/ckb-sdk-js/commit/4c7055466aeb2b8cd2fda2ae927e88cb699d161b))
* **utils:** add a method to reconcile transactions ([1ae64cd](https://github.com/nervosnetwork/ckb-sdk-js/commit/1ae64cd258cacffcb77e664bb3853dd4c7ec9150))





# [0.36.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.35.0...v0.36.0) (2020-09-21)


### Code Refactoring

* **utils:** remove redundant default options in the address module ([d74caac](https://github.com/nervosnetwork/ckb-sdk-js/commit/d74caac7121c8d1fc81ca1e8479200a9897c1726))


### Features

* **utils:** add system scripts ([567f15a](https://github.com/nervosnetwork/ckb-sdk-js/commit/567f15aea993ce5797bcecaadeeae27c3baf4aed))
* **utils:** add the utils#addressToScript ([a78340a](https://github.com/nervosnetwork/ckb-sdk-js/commit/a78340a496f37f0239f5115ef886e2dbd1a9974e))


### BREAKING CHANGES

* **utils:** Remove the utils#defaultAddressOptions





# [0.35.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.34.0...v0.35.0) (2020-08-24)


### Features

* **utils:** remove utils#toHexInLittleEndian which is deprecated ([a028887](https://github.com/nervosnetwork/ckb-sdk-js/commit/a028887ab2fd46679941cbc5fca940e3d1410e64))


### BREAKING CHANGES

* **utils:** Remove utils#toHexInLittleEndian which is deprecated





# [0.34.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.33.0...v0.34.0) (2020-07-21)


### Bug Fixes

* **utils:** rename the arg field in params of utils#fullPayloadToAddress to args ([08dcc0d](https://github.com/nervosnetwork/ckb-sdk-js/commit/08dcc0d68dbcb26feaa3f1baa315c0974c6bd23d))


### Features

* **utils:** add epoch module ([8d6478a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8d6478a24e13650037e2a29001fdf9fd2f50d40c))
* **utils:** set the default address prefix 'ckb' ([3134eda](https://github.com/nervosnetwork/ckb-sdk-js/commit/3134edae7a7d6806c60c9f1679473701c07a4579))
* **utils:** use strict validation on address ([bb23ce9](https://github.com/nervosnetwork/ckb-sdk-js/commit/bb23ce9ad5f4ef4e692a96662d5f7b49ad296784))
* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize ([8fbc43a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8fbc43a00499eb1e3e1fd1adadd4392c509d9dca))
* **utils:** remove utils#toHexInLittleEndian which is deprecated ([a028887](https://github.com/nervosnetwork/ckb-sdk-js/commit/a028887ab2fd46679941cbc5fca940e3d1410e64))
* **utils:** remove methods related to utf8 string ([f9cf9cc](https://github.com/nervosnetwork/ckb-sdk-js/pull/480/commits/f9cf9cced7ea518727eb50f4e471dbe0cba63c12))


### BREAKING CHANGES

* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize
* **utils:** Set the default address prefix 'ckb' instead of 'ckt'
* **utils:** The arg field in params of utils#fullPayloadToAddress is renamed to args
* **utils:** Remove utils#toHexInLittleEndian which is deprecated
* **utils:** Remove methods related to utf8 string





# [0.33.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.32.0...v0.33.0) (2020-06-22)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.32.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.31.0...v0.32.0) (2020-05-26)


### Features

* **utils:** add convertors of uint-to-le ([16b6d80](https://github.com/nervosnetwork/ckb-sdk-js/commit/16b6d80f612a175aa6a72ad6324c89d5664fca94))





# [0.31.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.30.0...v0.31.0) (2020-04-21)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.30.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.29.1...v0.30.0) (2020-03-23)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.29.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.1) (2020-02-28)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.29.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.0) (2020-02-28)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.28.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.1...v0.28.0) (2020-02-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.27.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.0...v0.27.1) (2020-02-01)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.27.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.4...v0.27.0) (2020-01-11)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.26.4](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.3...v0.26.4) (2020-01-02)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.26.3](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.2...v0.26.3) (2019-12-23)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.26.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.1...v0.26.2) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.26.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.0...v0.26.1) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.26.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0...v0.26.0) (2019-12-16)


### Features

* enable JSBI for compatibility ([bfce1e5](https://github.com/nervosnetwork/ckb-sdk-js/commit/bfce1e57dc2008efd0697951614d0f94469375b8))


### BREAKING CHANGES

* utils.toHexInLittleEndian will not accept parameters in number





# [0.25.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0) (2019-11-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.25.0-alpha.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0-alpha.1) (2019-11-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.25.0-alpha.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.2...v0.25.0-alpha.0) (2019-11-12)


### Features

* **utils:** add address and address payload validators ([d44effb](https://github.com/nervosnetwork/ckb-sdk-js/commit/d44effb2542bfe251c85f23d933d92f8b1c880a2))
* **utils:** add assertToBeHexStringOrBigint method for validation ([6b16507](https://github.com/nervosnetwork/ckb-sdk-js/commit/6b165074db0a02a1263568dab6e2e543c6a225ab))
* **utils:** add parseEpoch method ([c29aca6](https://github.com/nervosnetwork/ckb-sdk-js/commit/c29aca606bf40f9b8cb3e98080c5ad36c0d5546a))





## [0.24.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.1...v0.24.2) (2019-11-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.24.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.0...v0.24.1) (2019-11-07)


### Bug Fixes

* **utils:** fix the precision-lost in toHexInLittleEndian ([9658a76](https://github.com/nervosnetwork/ckb-sdk-js/commit/9658a769e34344617c64d832322d8c85b72daea7))





# [0.24.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.1...v0.24.0) (2019-11-02)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.23.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.0...v0.23.1) (2019-10-22)


### Features

* **utils** add methods for calculating transaction fee ([1dd82a4](https://github.com/nervosnetwork/ckb-sdk-js/commit/1dd82a4afba22f547406953444aa59df7e3a86bd))
    1. add utils.serializeTransaction method to serialize a full transaction;
    2. add utils.calculateTrasnactionSize to get the size of a full transaction






# [0.23.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.1...v0.23.0) (2019-10-19)


### Features

* **address:** add support to addresses in full version format ([a385821](https://github.com/nervosnetwork/ckb-sdk-js/commit/a385821))
* **core:** remove address module ([#369](https://github.com/nervosnetwork/ckb-sdk-js/issues/369)) ([e467427](https://github.com/nervosnetwork/ckb-sdk-js/commit/e467427))


### BREAKING CHANGES

* **core:** remove address module and add key pair module
    * ci: add codecov config for a tolerant threshold
    * feat(utils): add some util methods for getting public keys and addresses from private keys
        * add a method of core.utils.privateKeytoPublicKey
        * add a method of core.utils.privateKeyToAddress

* **core:** KeyPair from the core module
    * fix(core): fix the lock script in the sending transactions example
    
* **address:** rename an parameter in bech32Address method from codeHash to codeHashOrCodeHashIndex





## [0.22.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.0...v0.22.1) (2019-10-12)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.22.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.1...v0.22.0) (2019-10-05)


### Features

* **core:** move the address module into the core module ([10dd017](https://github.com/nervosnetwork/ckb-sdk-js/commit/10dd017))
* **type:** update the type of args ([09d649a](https://github.com/nervosnetwork/ckb-sdk-js/commit/09d649a))
* **type:** update the type of witness ([71f53b0](https://github.com/nervosnetwork/ckb-sdk-js/commit/71f53b0))
* **utils:** update the interface of utils.parseAddress ([90feb91](https://github.com/nervosnetwork/ckb-sdk-js/commit/90feb91))


### BREAKING CHANGES

* **type:** change the type of args from string[] to string
* **type:** change the type of witnes from { data: string[] } to string
* **utils:** remove the prefix from the parameter list of utils.parseAddress
* **core:** move the address module into the core module





## [0.21.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.0...v0.21.1) (2019-09-24)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.21.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.20.0...v0.21.0) (2019-09-21)


### Code Refactoring

* **address** rename public key identifier to publicKeyHash ([b33c096](https://github.com/nervosnetwork/ckb-sdk-js/commit/b33c096))


### Features

* **utils:** format the outputs of the utils module ([a30071c](https://github.com/nervosnetwork/ckb-sdk-js/commit/a30071c))


### BREAKING CHANGES

* **address** rename public key identifier to publicKeyHash
* **utils:** hexilize the outputs of the utils module





# [0.20.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.1...v0.20.0) (2019-09-07)


### Features

* **utils:** add the serializeScript method in the utils module ([85dffcb](https://github.com/nervosnetwork/ckb-sdk-js/commit/85dffcb))
* **utils:** update the scriptToHash method in the utils module with a new serialization method ([abeabf4](https://github.com/nervosnetwork/ckb-sdk-js/commit/abeabf4))


### BREAKING CHANGES

* **utils:** update the scriptToHash method in the utils module with a new serialization method





## [0.19.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.0...v0.19.1) (2019-08-28)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.19.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.18.0...v0.19.0) (2019-08-27)


### Features

* **type:** set the value of hash_type to "data" and "type" ([36a5512](https://github.com/nervosnetwork/ckb-sdk-js/commit/36a5512))
* **utils:** rename the method of lockScriptToHash to scriptToHash ([40cdbaa](https://github.com/nervosnetwork/ckb-sdk-js/commit/40cdbaa))


### BREAKING CHANGES

* **type:** set the value of hash_type to "data" and "type"
* **utils:** rename the method of lockScriptToHash to scriptToHash





# [0.18.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.1...v0.18.0) (2019-08-10)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.17.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.0...v0.17.1) (2019-07-29)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.17.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.16.0...v0.17.0) (2019-07-27)


### Features

* **types:** add a new field named 'hash_type' in types of script and cell output ([2692c0a](https://github.com/nervosnetwork/ckb-sdk-js/commit/2692c0a))
* **utils:** update the address format ([74a5ad8](https://github.com/nervosnetwork/ckb-sdk-js/commit/74a5ad8))


### BREAKING CHANGES

* **types:** types of script and cell output changed
* **utils:** update the address format





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)


### Features

* **utils:** remove toAddressIdentifier method ([ab1e356](https://github.com/nervosnetwork/ckb-sdk-js/commit/ab1e356))


### BREAKING CHANGES

* **utils:** remove toAddressIdentifier method





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Features

* **utils:** add signRecoverable method to the ECPair class ([3c1f334](https://github.com/nervosnetwork/ckb-sdk-js/commit/3c1f334))


### BREAKING CHANGES

* **utils:** use signRecoverable instead of sign method to sign the transactions.





# [0.14.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.13.0...v0.14.0) (2019-06-15)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.13.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.12.0...v0.13.0) (2019-06-01)


### Features

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.12.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.11.0...v0.12.0) (2019-05-18)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-utils





# [0.11.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.10.0...v0.11.0) (2019-05-14)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-wallet





# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([b336968](https://github.com/nervosnetwork/ckb-sdk-js/commit/b336968))


### Features

* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([82121b3](https://github.com/nervosnetwork/ckb-sdk-js/commit/82121b3))
* **utils:** parseAddress returns bytes or hex string instead of words ([aaad9c9](https://github.com/nervosnetwork/ckb-sdk-js/commit/aaad9c9))





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)


### Bug Fixes

* **types:** set the type of arg in script to string ([7ea3ad2](https://github.com/nervosnetwork/ckb-sdk-js/commit/7ea3ad2))





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([fd2616c](https://github.com/nervosnetwork/ckb-sdk-js/commit/fd2616c))


### Features

* **types:** update types of script, cell input, cell output ([ee405bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/ee405bb))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([79cb24f](https://github.com/nervosnetwork/ckb-sdk-js/commit/79cb24f))
* **utils:** parseAddress returns bytes or hex string instead of words ([2028a6c](https://github.com/nervosnetwork/ckb-sdk-js/commit/2028a6c))


### BREAKING CHANGES

* **types:** script model updated





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)

### Features

- **utils:** add type definition of blake2b-wasm ([f2cd199](https://github.com/nervosnetwork/ckb-sdk-js/commit/f2cd199))
- **utils:** repalce-sha3-with-blake2b ([93bddd1](https://github.com/nervosnetwork/ckb-sdk-js/commit/93bddd1))
- **utils:** update blake2b personal to 'ckb-default-hash' and add tests ([5c3bab3](https://github.com/nervosnetwork/ckb-sdk-js/commit/5c3bab3))

### BREAKING CHANGES

- **utils:** update default signature method
