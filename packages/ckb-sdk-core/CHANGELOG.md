# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.41.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.1) (2021-05-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.41.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.0) (2021-05-06)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.40.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.39.0...v0.40.0) (2021-03-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.39.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.2...v0.39.0) (2021-01-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.38.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.1...v0.38.2) (2020-11-30)


### Bug Fixes

* **core:** fix the type declaration of changeLockScript ([23ad1db](https://github.com/nervosnetwork/ckb-sdk-js/commit/23ad1db7ca4fe9cc9011e5300a0a3efbfdb403ed))





## [0.38.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.0...v0.38.1) (2020-11-27)


### Features

* **core:** upgrade @ckb-lumos/indexer and add the example of sudt transaction ([c10ec0b](https://github.com/nervosnetwork/ckb-sdk-js/commit/c10ec0b95877e67599ee67306b1968934a5b55ca))





# [0.38.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.37.0...v0.38.0) (2020-11-20)


### Bug Fixes

* **core:** use change lock script instead of change public key hash ([b16bfc8](https://github.com/nervosnetwork/ckb-sdk-js/commit/b16bfc8788c551730e42179b43d6b5625ee3ed7c))


### BREAKING CHANGES

* **core:** `changePublicKeyHash` in `generateRawTransaction` is replaced with
`changeLockScript`





# [0.37.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.37.0) (2020-10-25)


### Features

* **core:** prune cached cells according to data returned from lumos indexer ([5d09d61](https://github.com/nervosnetwork/ckb-sdk-js/commit/5d09d616cdf750c74eafa5728cba35a9dbd0e4dc))
* **rpc:** remove rpc#getCellsByLockHash ([#504](https://github.com/nervosnetwork/ckb-sdk-js/issues/504)) ([2071308](https://github.com/nervosnetwork/ckb-sdk-js/commit/20713087ede57289ecdc0c3188614d62f52f4f25))





## [0.36.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.36.2) (2020-10-20)


### Bug Fixes

* **core:** fix type declaration of RawTransactionParams ([f9ba7bf](https://github.com/nervosnetwork/ckb-sdk-js/commit/f9ba7bf7bafa399d4a259947a9ef42056c6d7594))





## [0.36.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.0...v0.36.1) (2020-09-26)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.36.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.35.0...v0.36.0) (2020-09-21)


### Features

* **core:** parse scripts from addresses on generating transactions ([#488](https://github.com/nervosnetwork/ckb-sdk-js/issues/488)) ([9536f08](https://github.com/nervosnetwork/ckb-sdk-js/commit/9536f0811c0531599e0ee56e01802878f9b1f165))





# [0.35.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.34.0...v0.35.0) (2020-08-24)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.34.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.33.0...v0.34.0) (2020-07-21)


### Features

* **core:** combine core#loadSecp256k1Dep and core#loadDaoDep into core#loadDep ([762441e](https://github.com/nervosnetwork/ckb-sdk-js/commit/762441ed4b4e27fe377ef0662168a6bf7ae6c6a2))
* **core:** enhance ckb#loadCells to load cells from lumos collector ([3152a3c](https://github.com/nervosnetwork/ckb-sdk-js/commit/3152a3c30da40fead8a18aee43da2eca94cd1347))
* **core:** remove experimental rpc ([32c7a0c](https://github.com/nervosnetwork/ckb-sdk-js/commit/32c7a0c9867141e08f09ef53070ed3c30f642383))
* **rpc:** enable batch request ([#449](https://github.com/nervosnetwork/ckb-sdk-js/issues/449)) ([9517cae](https://github.com/nervosnetwork/ckb-sdk-js/commit/9517cae307ef3b44091e13090d459d68a1855597))
* **utils:** add epoch module ([8d6478a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8d6478a24e13650037e2a29001fdf9fd2f50d40c))


### BREAKING CHANGES

* **core:** core#loadSecp256k1Dep and core#loadDaoDep are removed, use core#loadDeps instead
* **core:** computeTransactionHash and computeScriptHash are removed from the rpc list





# [0.33.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.32.0...v0.33.0) (2020-06-22)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.32.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.31.0...v0.32.0) (2020-05-26)


### Features

* use signature provider in signWitnesses & signWitnessGroup ([#434](https://github.com/nervosnetwork/ckb-sdk-js/issues/434)) ([34d62bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/34d62bb9c86b680e5887194131379c2a01b4f068))





# [0.31.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.30.0...v0.31.0) (2020-04-21)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.30.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.29.1...v0.30.0) (2020-03-23)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.29.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.1) (2020-02-28)


### Bug Fixes

* **core:** fix the calculation of epoch locks in nervos dao operation ([d914007](https://github.com/nervosnetwork/ckb-sdk-js/commit/d914007fd14456217d4f4430ad4e868ca998f65d))





# [0.29.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.0) (2020-02-28)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.28.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.1...v0.28.0) (2020-02-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.27.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.0...v0.27.1) (2020-02-01)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.27.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.4...v0.27.0) (2020-01-11)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.26.4](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.3...v0.26.4) (2020-01-02)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.26.3](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.2...v0.26.3) (2019-12-23)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.26.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.1...v0.26.2) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.26.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.0...v0.26.1) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.26.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0...v0.26.0) (2019-12-16)


### Features

* enable JSBI for compatibility ([bfce1e5](https://github.com/nervosnetwork/ckb-sdk-js/commit/bfce1e57dc2008efd0697951614d0f94469375b8))
* **core:** support multiple private keys in generating and signing a… ([#403](https://github.com/nervosnetwork/ckb-sdk-js/issues/403)) ([8bac66b](https://github.com/nervosnetwork/ckb-sdk-js/commit/8bac66b087233d8d9fa237e449c0fde767d1d3f0))


### BREAKING CHANGES

* utils.toHexInLittleEndian will not accept parameters in number





# [0.25.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0) (2019-11-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.25.0-alpha.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0-alpha.1) (2019-11-13)


### Bug Fixes

* **core:** fix the minimal epoch composition in generateDaoWithdrawTx method ([c87fb6a](https://github.com/nervosnetwork/ckb-sdk-js/commit/c87fb6afe901f8b215f34c5d00117af429477596))





# [0.25.0-alpha.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.2...v0.25.0-alpha.0) (2019-11-12)


### Features

* **core:** add generateDaoDepositTx method ([27a31f6](https://github.com/nervosnetwork/ckb-sdk-js/commit/27a31f62bdbfcad60125f51e33b78f27582d0f0a))
* **core:** add the method of generateDaoWithdrawStartTx ([ff2163f](https://github.com/nervosnetwork/ckb-sdk-js/commit/ff2163fa0847148df7b07a6facb68fe91244ee21))
* **core:** add the method of generateDaoWithdrawTransaction ([a375abd](https://github.com/nervosnetwork/ckb-sdk-js/commit/a375abd8db7a7b87bcc7842296af39e831488b7e))
* **core:** add the method to load dao deps ([75e5ca7](https://github.com/nervosnetwork/ckb-sdk-js/commit/75e5ca7347a3b0f46ba26ef5316f6897c579a166))
* **core:** allow cell capacity threshold in generateRawTransaction method ([ebbe448](https://github.com/nervosnetwork/ckb-sdk-js/commit/ebbe448d1b033486b71772af6bba4421a25df08d))
* **utils:** add assertToBeHexStringOrBigint method for validation ([6b16507](https://github.com/nervosnetwork/ckb-sdk-js/commit/6b165074db0a02a1263568dab6e2e543c6a225ab))
* **utils:** add parseEpoch method ([c29aca6](https://github.com/nervosnetwork/ckb-sdk-js/commit/c29aca606bf40f9b8cb3e98080c5ad36c0d5546a))





## [0.24.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.1...v0.24.2) (2019-11-08)


### Bug Fixes

* **core:** serialize the witnesses after it's signed ([6d4bcdc](https://github.com/nervosnetwork/ckb-sdk-js/commit/6d4bcdca2f5076449ea4f75611ec4f3bcd467662))





## [0.24.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.0...v0.24.1) (2019-11-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.24.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.1...v0.24.0) (2019-11-02)


### Features

* **core:** include fee in generateTransaction method ([03153f6](https://github.com/nervosnetwork/ckb-sdk-js/commit/03153f6ee17f202e31ac0972318a10d8b71e76eb))
* **core:** sign inputs in group ([294f59c](https://github.com/nervosnetwork/ckb-sdk-js/commit/294f59cb9505d90aa5e8faa00a63a39fab58fd0b))


### BREAKING CHANGES

* **core:** sign inputs in group





## [0.23.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.0...v0.23.1) (2019-10-22)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.23.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.1...v0.23.0) (2019-10-19)


### Features

* **address:** add support to addresses in full version format ([a385821](https://github.com/nervosnetwork/ckb-sdk-js/commit/a385821))
* **core:** add transaction builder for signing transactions with multiple private keys ([d5d69c0](https://github.com/nervosnetwork/ckb-sdk-js/commit/d5d69c0))
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


### Bug Fixes

* **rpc:** update the signatures of rpc methods ([7eb6726](https://github.com/nervosnetwork/ckb-sdk-js/commit/7eb6726)), closes [#365](https://github.com/nervosnetwork/ckb-sdk-js/issues/365)


### BREAKING CHANGES

* **rpc:** use bigint instead of number in signatures of rpc methods





# [0.22.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.1...v0.22.0) (2019-10-05)


### Features

* **address:** enable address to load cells and generate signed transactions ([2e5803c](https://github.com/nervosnetwork/ckb-sdk-js/commit/2e5803c))
* **core:** move the address module into the core module ([10dd017](https://github.com/nervosnetwork/ckb-sdk-js/commit/10dd017))
* **type:** update the fields of BlockHeader ([55de626](https://github.com/nervosnetwork/ckb-sdk-js/commit/55de626))
* **type:** update the type of args ([09d649a](https://github.com/nervosnetwork/ckb-sdk-js/commit/09d649a))
* **type:** update the type of witness ([71f53b0](https://github.com/nervosnetwork/ckb-sdk-js/commit/71f53b0))
* **utils:** update the interface of utils.parseAddress ([90feb91](https://github.com/nervosnetwork/ckb-sdk-js/commit/90feb91))


### BREAKING CHANGES

* **type:** 1. remove unclesCount
2. merge witnessesRoot and transactionRoot
3. replace difficulty with compactTarget
* **type:** change the type of args from string[] to string
* **type:** change the type of witnes from { data: string[] } to string
* **utils:** remove the prefix from the parameter list of utils.parseAddress
* **core:** move the address module into the core module





## [0.21.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.0...v0.21.1) (2019-09-24)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.21.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.20.0...v0.21.0) (2019-09-21)


### Code Refactoring

* **address** rename public key identifier to publicKeyHash ([b33c096](https://github.com/nervosnetwork/ckb-sdk-js/commit/b33c096))


### BREAKING CHANGES

* **address** rename public key identifier to publicKeyHash





# [0.20.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.1...v0.20.0) (2019-09-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.19.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.0...v0.19.1) (2019-08-28)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.19.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.18.0...v0.19.0) (2019-08-27)


### Features

* **core:** add the RPC of computeScriptHash ([705f51e](https://github.com/nervosnetwork/ckb-sdk-js/commit/705f51e))
* **core:** use secp256k1 dep group instead of secp256k1 cell ([578eb43](https://github.com/nervosnetwork/ckb-sdk-js/commit/578eb43))
* **core:** use the secp256k1 type script hash as the code hash of the secp256k1 dep ([617487e](https://github.com/nervosnetwork/ckb-sdk-js/commit/617487e))
* **type:** CellOutput and Epoch structures change ([8346ae4](https://github.com/nervosnetwork/ckb-sdk-js/commit/8346ae4))
* **type:** rename is_dep_group to dep_type ([06c324a](https://github.com/nervosnetwork/ckb-sdk-js/commit/06c324a))
* **type:** set the value of hash_type to "data" and "type" ([36a5512](https://github.com/nervosnetwork/ckb-sdk-js/commit/36a5512))
* **type:** Transaction structure changes ([df65152](https://github.com/nervosnetwork/ckb-sdk-js/commit/df65152))


### BREAKING CHANGES

* **type:** set the value of hash_type to "data" and "type"
* **type:** rename is_dep_group to dep_type
* **core:** use secp256k1 dep group instead of secp256k1 cell
* **type:** CellOutput and Epoch structures change
* **type:** Transaction structure changes





# [0.18.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.1...v0.18.0) (2019-08-10)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.17.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.0...v0.17.1) (2019-07-29)


### Bug Fixes

* **types:** remove the hash_type field from the type of cell_out_point ([58c019f](https://github.com/nervosnetwork/ckb-sdk-js/commit/58c019f))


### BREAKING CHANGES

* **types:** the type of cell out point changes





# [0.17.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.16.0...v0.17.0) (2019-07-27)


### Features

* **utils:** update the address format ([74a5ad8](https://github.com/nervosnetwork/ckb-sdk-js/commit/74a5ad8))


### BREAKING CHANGES

* **utils:** update the address format





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Bug Fixes

* **rpc:** binding the node of method instances to the one of rpc instance. ([f0b486a](https://github.com/nervosnetwork/ckb-sdk-js/commit/f0b486a))


### Features

* **utils:** add signRecoverable method to the ECPair class ([3c1f334](https://github.com/nervosnetwork/ckb-sdk-js/commit/3c1f334))


### BREAKING CHANGES

* **utils:** use signRecoverable instead of sign method to sign the transactions.





# [0.14.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.13.0...v0.14.0) (2019-06-15)

* **core:** add signWitnesses and signTransaction methods in the core module ([c20d36c](https://github.com/nervosnetwork/ckb-sdk-js/commit/c20d36c))





# [0.13.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.12.0...v0.13.0) (2019-06-01)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.12.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.11.0...v0.12.0) (2019-05-18)


### Features

* **core:** add _compute_transaction_hash rpc ([9f81f28](https://github.com/nervosnetwork/ckb-sdk-js/commit/9f81f28))
* **core:** add address module into core module ([d5d75ec](https://github.com/nervosnetwork/ckb-sdk-js/commit/d5d75ec))
* **core:** remove wallet module ([551f5a2](https://github.com/nervosnetwork/ckb-sdk-js/commit/551f5a2))
* **core:** add load system cell method ([94af040](https://github.com/nervosnetwork/ckb-sdk-js/commit/94af040))


### BREAKING CHANGES

* **types:** update type of outpoint
* **types:** rename the proposals_root field in block header to proposals_hash
* **wallet:** remove wallet module





# [0.11.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.10.0...v0.11.0) (2019-05-14)


### Features

* **types:** update basic types in CKB ([71d4e5](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/71d4e5))
* **types:** add shannon as a new capacity unit ([910cc5](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/910cc5))
* **feat:** remove always success wallet ([febb5d](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/febb5d))
* **rpc:** update rpc interface formatter according to new api ([c0a631](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/c0a631))
* **feat:** add address module ([c5b532](https://github.com/nervosnetwork/ckb-sdk-js/commit/c5b532))





# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-core
