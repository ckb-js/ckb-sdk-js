# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
