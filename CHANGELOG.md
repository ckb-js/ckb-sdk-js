# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.102.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.101.0...v0.102.1) (2022-02-17)

**Note:** Version bump only for package ckb-sdk-js





# [0.102.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.101.0...v0.102.0) (2022-02-16)

**Note:** Version bump only for package ckb-sdk-js





# [0.101.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.43.0...v0.101.0) (2021-10-25)


### Features

* extends hash_type to 'data' | 'type' | 'data1' ([#555](https://github.com/nervosnetwork/ckb-sdk-js/issues/555)) ([30c49e8](https://github.com/nervosnetwork/ckb-sdk-js/commit/30c49e8960a704eb76dd0c5e0d8f370212a84a6d))
* **rpc:** a new field 'extension' is added to the block body ([285a829](https://github.com/nervosnetwork/ckb-sdk-js/commit/285a829e4e5af7a43779e7cb854394f75fa61ff6))
* **rpc:** add a new field 'hardforkFeatures' in response of getConsensus ([133fe26](https://github.com/nervosnetwork/ckb-sdk-js/commit/133fe26f92d49e2df2445d1530871923ef51892c))
* **rpc:** rename 'uncles_hash' to 'extra_hash' in block header ([58c055c](https://github.com/nervosnetwork/ckb-sdk-js/commit/58c055c4b25fbd1f7abf78c334ca27e6c2566623))


### BREAKING CHANGES

* **rpc:** Add a new field 'hardforkFeatures' in response of getConsensus

ref https://github.com/nervosnetwork/ckb/pull/2879
* **rpc:** A new field 'extension' is added to the block body

ref https://github.com/nervosnetwork/rfcs/pull/224
* **rpc:** The field 'uncles_hash' in block header is renamed to 'extra_hash'

ref: https://github.com/nervosnetwork/rfcs/pull/224





# [0.43.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.41.1...v0.43.0) (2021-06-29)

**Note:** Version bump only for package ckb-sdk-js





## [0.41.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.1) (2021-05-08)

**Note:** Version bump only for package ckb-sdk-js





# [0.41.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.0) (2021-05-06)

**Note:** Version bump only for package ckb-sdk-js





# [0.40.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.39.0...v0.40.0) (2021-03-08)


### Features

* **rpc:** remove indexer from RPC module ([b3ba942](https://github.com/nervosnetwork/ckb-sdk-js/commit/b3ba942f55af750559714194a9d91289469ea4c2))


### BREAKING CHANGES

* **rpc:** Remove the entire indexer from the RPC module





# [0.39.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.2...v0.39.0) (2021-01-13)


### Features

* **rpc:** add rpc#getRawTxPool, rpc#getConsensus and deprecate rpc#getCellbaseOutputCapacityDetails, rpc#getPeersState ([#528](https://github.com/nervosnetwork/ckb-sdk-js/pull/528))





## [0.38.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.1...v0.38.2) (2020-11-30)


### Bug Fixes

* **core:** fix the type declaration of changeLockScript ([23ad1db](https://github.com/nervosnetwork/ckb-sdk-js/commit/23ad1db7ca4fe9cc9011e5300a0a3efbfdb403ed))





## [0.38.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.0...v0.38.1) (2020-11-27)


### Features

* **core:** upgrade @ckb-lumos/indexer and add the example of sudt transaction ([c10ec0b](https://github.com/nervosnetwork/ckb-sdk-js/commit/c10ec0b95877e67599ee67306b1968934a5b55ca))
* **utils:** update acp lock script ([6d9a85f](https://github.com/nervosnetwork/ckb-sdk-js/commit/6d9a85f05f393216fc06650fd650f43049874a20))





# [0.38.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.37.0...v0.38.0) (2020-11-20)


### Bug Fixes

* **core:** use change lock script instead of change public key hash ([b16bfc8](https://github.com/nervosnetwork/ckb-sdk-js/commit/b16bfc8788c551730e42179b43d6b5625ee3ed7c))


### BREAKING CHANGES

* **core:** `changePublicKeyHash` in `generateRawTransaction` is replaced with
`changeLockScript`





# [0.37.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.37.0) (2020-10-25)


### Features

* **core:** prune cached cells according to data returned from lumos indexer ([5d09d61](https://github.com/nervosnetwork/ckb-sdk-js/commit/5d09d616cdf750c74eafa5728cba35a9dbd0e4dc))
* **rpc:** add rpc#pingPeers, rpc#getTransactionProof, rpc#verifyTransactionProof and rpc#clearBannedAddresses ([#506](https://github.com/nervosnetwork/ckb-sdk-js/issues/506)) ([61efe5e](https://github.com/nervosnetwork/ckb-sdk-js/commit/61efe5e7b7638c7a41163e3b3b05bc92261f711a))
* **rpc:** remove rpc#getCellsByLockHash ([#504](https://github.com/nervosnetwork/ckb-sdk-js/issues/504)) ([2071308](https://github.com/nervosnetwork/ckb-sdk-js/commit/20713087ede57289ecdc0c3188614d62f52f4f25))
* **utils:** remove support of blake2b-wasm@v2.1.0 ([b94d318](https://github.com/nervosnetwork/ckb-sdk-js/commit/b94d31886fe44f56812eedf5f035e41d9c0c9240))


### Performance Improvements

* bump deps ([43c71b8](https://github.com/nervosnetwork/ckb-sdk-js/commit/43c71b85e71ec2468b10efb5411ec27c8121cfd2))


### BREAKING CHANGES

* **utils:** Remove explicit support of blake2b-wasm@v2.1.0





## [0.36.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.36.2) (2020-10-20)


### Bug Fixes

* **core:** fix type declaration of RawTransactionParams ([f9ba7bf](https://github.com/nervosnetwork/ckb-sdk-js/commit/f9ba7bf7bafa399d4a259947a9ef42056c6d7594))





## [0.36.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.0...v0.36.1) (2020-09-26)


### Features

* **utils:** disable blake2b-wasm when the host is iOS 11 ([4c70554](https://github.com/nervosnetwork/ckb-sdk-js/commit/4c7055466aeb2b8cd2fda2ae927e88cb699d161b))
* **utils:** add a method to reconcile transactions ([1ae64cd](https://github.com/nervosnetwork/ckb-sdk-js/commit/1ae64cd258cacffcb77e664bb3853dd4c7ec9150))





# [0.36.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.35.0...v0.36.0) (2020-09-21)


### Code Refactoring

* **utils:** remove redundant default options in the address module ([d74caac](https://github.com/nervosnetwork/ckb-sdk-js/commit/d74caac7121c8d1fc81ca1e8479200a9897c1726))


### Features

* **core:** parse scripts from addresses on generating transactions ([#488](https://github.com/nervosnetwork/ckb-sdk-js/issues/488)) ([9536f08](https://github.com/nervosnetwork/ckb-sdk-js/commit/9536f0811c0531599e0ee56e01802878f9b1f165))
* **utils:** add system scripts ([567f15a](https://github.com/nervosnetwork/ckb-sdk-js/commit/567f15aea993ce5797bcecaadeeae27c3baf4aed))
* **utils:** add the utils#addressToScript ([a78340a](https://github.com/nervosnetwork/ckb-sdk-js/commit/a78340a496f37f0239f5115ef886e2dbd1a9974e))


### BREAKING CHANGES

* **utils:** Remove the utils#defaultAddressOptions





# [0.35.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.34.0...v0.35.0) (2020-08-24)


### Bug Fixes

* **rpc:** fix init parameter type of batch request ([2b80f59](https://github.com/nervosnetwork/ckb-sdk-js/commit/2b80f59b728831c6d084ef35359309a397c814c6))


### Features

* **rpc:** remove an RPC ([98eb935](https://github.com/nervosnetwork/ckb-sdk-js/commit/98eb935781715202207c4fd070bfc30cb0a65378))
* **rpc:** update RPCs ([#477](https://github.com/nervosnetwork/ckb-sdk-js/pull/477))
    - separate basic RPC by group
    - update teh API of rpc#localNodeInfo, rpc#txPoolInfo, and rpc#getPeers
    - add new RPCs: rpc#syncState, rpc#clearTxPool, rpc#setNetworkActive, rpc#addNode and rpc#removeNode
* **utils:** add epoch module ([8d6478a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8d6478a24e13650037e2a29001fdf9fd2f50d40c))
* **utils:** set the default address prefix 'ckb' ([3134eda](https://github.com/nervosnetwork/ckb-sdk-js/commit/3134edae7a7d6806c60c9f1679473701c07a4579))
* **utils:** use strict validation on address ([bb23ce9](https://github.com/nervosnetwork/ckb-sdk-js/commit/bb23ce9ad5f4ef4e692a96662d5f7b49ad296784))
* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize ([8fbc43a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8fbc43a00499eb1e3e1fd1adadd4392c509d9dca))
* **utils:** remove utils#toHexInLittleEndian which is deprecated ([a028887](https://github.com/nervosnetwork/ckb-sdk-js/commit/a028887ab2fd46679941cbc5fca940e3d1410e64))
* **utils:** remove methods related to utf8 string ([f9cf9cc](https://github.com/nervosnetwork/ckb-sdk-js/pull/480/commits/f9cf9cced7ea518727eb50f4e471dbe0cba63c12))


### BREAKING CHANGES

* **rpc:** remove rpc#getPeersState
* **rpc:** rpc#getPeers returns connectedDuration, lastPingDuration, protocols, syncState
* **rpc:** rpc#localNodeInfo returns active, connections, protocols
* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize
* **utils:** Set the default address prefix 'ckb' instead of 'ckt'
* **utils:** The arg field in params of utils#fullPayloadToAddress is renamed to args
* **utils:** Remove utils#toHexInLittleEndian which is deprecated
* **utils:** Remove methods related to utf8 string





# [0.34.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.33.0...v0.34.0) (2020-07-21)


### Bug Fixes

* **utils:** rename the arg field in params of utils#fullPayloadToAddress to args ([08dcc0d](https://github.com/nervosnetwork/ckb-sdk-js/commit/08dcc0d68dbcb26feaa3f1baa315c0974c6bd23d))


### Features

* **core:** combine core#loadSecp256k1Dep and core#loadDaoDep into core#loadDep ([762441e](https://github.com/nervosnetwork/ckb-sdk-js/commit/762441ed4b4e27fe377ef0662168a6bf7ae6c6a2))
* **core:** enhance ckb#loadCells to load cells from lumos collector ([3152a3c](https://github.com/nervosnetwork/ckb-sdk-js/commit/3152a3c30da40fead8a18aee43da2eca94cd1347))
* **core:** remove experimental rpc ([32c7a0c](https://github.com/nervosnetwork/ckb-sdk-js/commit/32c7a0c9867141e08f09ef53070ed3c30f642383))
* **rpc:** enable batch request ([#449](https://github.com/nervosnetwork/ckb-sdk-js/issues/449)) ([9517cae](https://github.com/nervosnetwork/ckb-sdk-js/commit/9517cae307ef3b44091e13090d459d68a1855597))
* **rpc:** remove the estimateFeeRate RPC method ([819d33f](https://github.com/nervosnetwork/ckb-sdk-js/commit/819d33f39197effb2905c9c03fe2ef0e5256f0c4))
* **utils:** add epoch module ([8d6478a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8d6478a24e13650037e2a29001fdf9fd2f50d40c))
* **utils:** set the default address prefix 'ckb' ([3134eda](https://github.com/nervosnetwork/ckb-sdk-js/commit/3134edae7a7d6806c60c9f1679473701c07a4579))
* **utils:** use strict validation on address ([bb23ce9](https://github.com/nervosnetwork/ckb-sdk-js/commit/bb23ce9ad5f4ef4e692a96662d5f7b49ad296784))
* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize ([8fbc43a](https://github.com/nervosnetwork/ckb-sdk-js/commit/8fbc43a00499eb1e3e1fd1adadd4392c509d9dca))


### BREAKING CHANGES

* **rpc:** Remove the estimateFeeRate RPC method
* **utils:** utils#calculateSerializedTxSizeInBlock is renamed to utils#getTransactionSize
* **utils:** Set the default address prefix 'ckb' instead of 'ckt'
* **core:** core#loadSecp256k1Dep and core#loadDaoDep are removed, use core#loadDeps instead
* **core:** computeTransactionHash and computeScriptHash are removed from the rpc list
* **utils:** The arg field in params of utils#fullPayloadToAddress is renamed to args





# [0.33.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.32.0...v0.33.0) (2020-06-22)

**Note:** Version bump only for package ckb-sdk-js





# [0.32.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.31.0...v0.32.0) (2020-05-26)


### Features

* **utils:** add convertors of uint-to-le ([16b6d80](https://github.com/nervosnetwork/ckb-sdk-js/commit/16b6d80f612a175aa6a72ad6324c89d5664fca94))
* use signature provider in signWitnesses & signWitnessGroup ([#434](https://github.com/nervosnetwork/ckb-sdk-js/issues/434)) ([34d62bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/34d62bb9c86b680e5887194131379c2a01b4f068))





# [0.31.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.30.0...v0.31.0) (2020-04-21)

**Note:** Version bump only for package ckb-sdk-js





# [0.30.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.29.1...v0.30.0) (2020-03-23)


### Features

* **rpc:** add a new field in the tx pool info ([c1cbac9](https://github.com/nervosnetwork/ckb-sdk-js/commit/c1cbac9aeb1799f611543696f7ee9b717cfb237d))
* **rpc:** add the new RPC getBlockEconomicState ([0c9e248](https://github.com/nervosnetwork/ckb-sdk-js/commit/0c9e248d810dcbe83953f262385b4a8efb5d4f84))





## [0.29.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.1) (2020-02-28)


### Bug Fixes

* **core:** fix the calculation of epoch locks in nervos dao operation ([d914007](https://github.com/nervosnetwork/ckb-sdk-js/commit/d914007fd14456217d4f4430ad4e868ca998f65d))





# [0.29.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.0) (2020-02-28)


### Features

* **rpc:** update the action of outputs validator when it is null ([4932c47](https://github.com/nervosnetwork/ckb-sdk-js/commit/4932c479141b6d7a109705c389290b66d67c83a2))


### BREAKING CHANGES

* **rpc:** null outputs validator is equivalent to the passthrough one





# [0.28.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.1...v0.28.0) (2020-02-07)

**Note:** Version bump only for package ckb-sdk-js





## [0.27.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.0...v0.27.1) (2020-02-01)


### Features

* **rpc:** add the second paramter outputsValidator in the sendTransaction RPC method ([0c7b7b1](https://github.com/nervosnetwork/ckb-sdk-js/commit/0c7b7b1c4b5aa6847c8061ca1a98adad9186e3a7))


### BREAKING CHANGES

* **rpc:** Default outputsValidator on sending transactions requires the lock of outputs to be
the default lock script





# [0.27.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.4...v0.27.0) (2020-01-11)

**Note:** Version bump only for package ckb-sdk-js





## [0.26.4](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.3...v0.26.4) (2020-01-02)


### Features

* **rpc:** add the new rpc method of get_capacity_by_lock_hash ([9628084](https://github.com/nervosnetwork/ckb-sdk-js/commit/9628084ba6111e2580d793a752992f45e142fcc5))





## [0.26.3](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.2...v0.26.3) (2019-12-23)

**Note:** Version bump only for package ckb-sdk-js





## [0.26.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.1...v0.26.2) (2019-12-16)

**Note:** Version bump only for package ckb-sdk-js





## [0.26.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.0...v0.26.1) (2019-12-16)

**Note:** Version bump only for package ckb-sdk-js





# [0.26.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0...v0.26.0) (2019-12-16)


### Bug Fixes

* **rpc:** add missing types in rpc type def ([8427341](https://github.com/nervosnetwork/ckb-sdk-js/commit/842734137f7129f94c397f8f12ca79eab7ad3cf9))
* **rpc:** fix the type def of ScriptHashType ([217a579](https://github.com/nervosnetwork/ckb-sdk-js/commit/217a5797d03423ce020d6dba9b23f778dea16632))


### Features

* enable JSBI for compatibility ([bfce1e5](https://github.com/nervosnetwork/ckb-sdk-js/commit/bfce1e57dc2008efd0697951614d0f94469375b8))
* **core:** support multiple private keys in generating and signing a… ([#403](https://github.com/nervosnetwork/ckb-sdk-js/issues/403)) ([8bac66b](https://github.com/nervosnetwork/ckb-sdk-js/commit/8bac66b087233d8d9fa237e449c0fde767d1d3f0))
* **type:** update the return type of rpc.getCellsByLockHash ([30aa494](https://github.com/nervosnetwork/ckb-sdk-js/commit/30aa494583c2bc8c71282b29058d6ffe6495a5ce))


### BREAKING CHANGES

* utils.toHexInLittleEndian will not accept parameters in number





# [0.25.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0) (2019-11-16)

**Note:** Version bump only for package ckb-sdk-js





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
* **rpc:** add an rpc method of calculateDaoMaximumWithdraw ([f4cd7e7](https://github.com/nervosnetwork/ckb-sdk-js/commit/f4cd7e7b53817908f8931463604ea630d1a2ec5a))
* **utils:** add address and address payload validators ([d44effb](https://github.com/nervosnetwork/ckb-sdk-js/commit/d44effb2542bfe251c85f23d933d92f8b1c880a2))
* **utils:** add assertToBeHexStringOrBigint method for validation ([6b16507](https://github.com/nervosnetwork/ckb-sdk-js/commit/6b165074db0a02a1263568dab6e2e543c6a225ab))
* **utils:** add parseEpoch method ([c29aca6](https://github.com/nervosnetwork/ckb-sdk-js/commit/c29aca606bf40f9b8cb3e98080c5ad36c0d5546a))





## [0.24.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.1...v0.24.2) (2019-11-08)


### Bug Fixes

* **core:** serialize the witnesses after it's signed ([6d4bcdc](https://github.com/nervosnetwork/ckb-sdk-js/commit/6d4bcdca2f5076449ea4f75611ec4f3bcd467662))





## [0.24.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.0...v0.24.1) (2019-11-07)


### Bug Fixes

* **utils:** fix the precision-lost in toHexInLittleEndian ([9658a76](https://github.com/nervosnetwork/ckb-sdk-js/commit/9658a769e34344617c64d832322d8c85b72daea7))





# [0.24.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.1...v0.24.0) (2019-11-02)


### Features

* **core:** include fee in generateTransaction method ([03153f6](https://github.com/nervosnetwork/ckb-sdk-js/commit/03153f6ee17f202e31ac0972318a10d8b71e76eb))
* **rpc:** add a rpc method ([928aaf9](https://github.com/nervosnetwork/ckb-sdk-js/commit/928aaf905bbc73165044f05c5c94c316665a773a))
* **core:** sign inputs in group ([294f59c](https://github.com/nervosnetwork/ckb-sdk-js/commit/294f59cb9505d90aa5e8faa00a63a39fab58fd0b))


### BREAKING CHANGES

* **core:** sign inputs in group





## [0.23.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.0...v0.23.1) (2019-10-22)


### Features

* **utils** add methods for calculating transaction fee ([1dd82a4](https://github.com/nervosnetwork/ckb-sdk-js/commit/1dd82a4afba22f547406953444aa59df7e3a86bd))
    1. add utils.serializeTransaction method to serialize a full transaction;
    2. add utils.calculateTrasnactionSize to get the size of a full transaction





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
* **cli:** deprive this repo of the ckb-cli ([2befcff](https://github.com/nervosnetwork/ckb-sdk-js/commit/2befcff))
* **core:** move the address module into the core module ([10dd017](https://github.com/nervosnetwork/ckb-sdk-js/commit/10dd017))
* **rpc:** update rpc signatures ([201901d](https://github.com/nervosnetwork/ckb-sdk-js/commit/201901d))
* **rpc:** use bigint instead of number in the interfaces of rpc methods ([c8d994b](https://github.com/nervosnetwork/ckb-sdk-js/commit/c8d994b))
* **type:** update the fields of BlockHeader ([55de626](https://github.com/nervosnetwork/ckb-sdk-js/commit/55de626))
* **type:** update the result of getCellsByLockHash method ([31eb97e](https://github.com/nervosnetwork/ckb-sdk-js/commit/31eb97e))
* **type:** update the structure of Epoch ([76770f4](https://github.com/nervosnetwork/ckb-sdk-js/commit/76770f4))
* **type:** update the type of args ([09d649a](https://github.com/nervosnetwork/ckb-sdk-js/commit/09d649a))
* **type:** update the type of witness ([71f53b0](https://github.com/nervosnetwork/ckb-sdk-js/commit/71f53b0))
* **utils:** update the interface of utils.parseAddress ([90feb91](https://github.com/nervosnetwork/ckb-sdk-js/commit/90feb91))


### BREAKING CHANGES

* **type:** replace difficulty with compactTarget in Epoch
* **type:** 
    1. remove unclesCount
    2. merge witnessesRoot and transactionRoot
    3. replace difficulty with compactTarget
* **type:** change the type of args from string[] to string
* **type:** change the type of witnes from { data: string[] } to string
* **rpc:** use bigint instead of number in the interfaces of rpc methods
* **utils:** remove the prefix from the parameter list of utils.parseAddress
* **core:** move the address module into the core module
* **type:** update the result of getCellsByLockHash method





## [0.21.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.0...v0.21.1) (2019-09-24)


### Bug Fixes

* **rpc:** add a parser for optional parameters ([274268e](https://github.com/nervosnetwork/ckb-sdk-js/commit/274268e))
* **rpc:** update the returned cell type of getLiveCell from cell to liveCell ([4a69d85](https://github.com/nervosnetwork/ckb-sdk-js/commit/4a69d85))





# [0.21.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.20.0...v0.21.0) (2019-09-21)


### Code Refactoring

* **address** rename public key identifier to publicKeyHash ([b33c096](https://github.com/nervosnetwork/ckb-sdk-js/commit/b33c096))


### Features

* **rpc:** format the outputs of the params formatter ([740b403](https://github.com/nervosnetwork/ckb-sdk-js/commit/740b403))
* **rpc:** update the interface of getLiveCell ([0280d7f](https://github.com/nervosnetwork/ckb-sdk-js/commit/0280d7f))
* **utils:** format the outputs of the utils module ([a30071c](https://github.com/nervosnetwork/ckb-sdk-js/commit/a30071c))


### BREAKING CHANGES

* **rpc:** update the interface of getLiveCell
* **address** rename public key identifier to publicKeyHash
* **rpc:** hexilize the outputs of the params formatter
* **utils:** hexilize the outputs of the utils module





# [0.20.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.1...v0.20.0) (2019-09-07)


### Features

* **utils:** add the serializeScript method in the utils module ([85dffcb](https://github.com/nervosnetwork/ckb-sdk-js/commit/85dffcb))
* **utils:** update the scriptToHash method in the utils module with a new serialization method ([abeabf4](https://github.com/nervosnetwork/ckb-sdk-js/commit/abeabf4))


### BREAKING CHANGES

* **utils:** update the scriptToHash method in the utils module with a new serialization method





## [0.19.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.0...v0.19.1) (2019-08-28)


### Features

* **rpc:** enable custom http agent and https agent ([34fca52](https://github.com/nervosnetwork/ckb-sdk-js/commit/34fca52))





# [0.19.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.18.0...v0.19.0) (2019-08-27)


### Features

* **core:** add the RPC of computeScriptHash ([705f51e](https://github.com/nervosnetwork/ckb-sdk-js/commit/705f51e))
* **core:** use secp256k1 dep group instead of secp256k1 cell ([578eb43](https://github.com/nervosnetwork/ckb-sdk-js/commit/578eb43))
* **core:** use the secp256k1 type script hash as the code hash of the secp256k1 dep ([617487e](https://github.com/nervosnetwork/ckb-sdk-js/commit/617487e))
* **type:** block header structure changes ([ce48faf](https://github.com/nervosnetwork/ckb-sdk-js/commit/ce48faf))
* **type:** CellOutput and Epoch structures change ([8346ae4](https://github.com/nervosnetwork/ckb-sdk-js/commit/8346ae4))
* **type:** Input structure changes ([ba16d1b](https://github.com/nervosnetwork/ckb-sdk-js/commit/ba16d1b))
* **type:** OutPoint structure changes ([38ba007](https://github.com/nervosnetwork/ckb-sdk-js/commit/38ba007))
* **type:** rename is_dep_group to dep_type ([06c324a](https://github.com/nervosnetwork/ckb-sdk-js/commit/06c324a))
* **type:** set the value of hash_type to "data" and "type" ([36a5512](https://github.com/nervosnetwork/ckb-sdk-js/commit/36a5512))
* **type:** Transaction structure changes ([30c84bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/30c84bb))
* **type:** Transaction structure changes ([71625fa](https://github.com/nervosnetwork/ckb-sdk-js/commit/71625fa))
* **type:** Transaction structure changes ([df65152](https://github.com/nervosnetwork/ckb-sdk-js/commit/df65152))
* **utils:** rename the method of lockScriptToHash to scriptToHash ([40cdbaa](https://github.com/nervosnetwork/ckb-sdk-js/commit/40cdbaa))


### BREAKING CHANGES

* **type:** set the value of hash_type to "data" and "type"
* **type:** rename is_dep_group to dep_type
* **type:** block header structure changes
* **utils:** rename the method of lockScriptToHash to scriptToHash
* **core:** use secp256k1 dep group instead of secp256k1 cell
* **type:** CellOutput and Epoch structures change
* **type:** Transaction structure chagnes
* **type:** OutPoint structure changes
* **type:** Input structure chagnes





# [0.18.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.1...v0.18.0) (2019-08-10)


### Features

* **rpc:** add get_cellbase_output_capacity_details rpc ([fa3aea3](https://github.com/nervosnetwork/ckb-sdk-js/commit/fa3aea3))
* **rpc:** add get_header rpc ([d2a6bbb](https://github.com/nervosnetwork/ckb-sdk-js/commit/d2a6bbb))
* **rpc:** add get_header_by_number rpc ([54f9d19](https://github.com/nervosnetwork/ckb-sdk-js/commit/54f9d19))
* **rpc:** add new rpc of set ban ([416e7fd](https://github.com/nervosnetwork/ckb-sdk-js/commit/416e7fd))
* **rpc:** add rpc of get banned addresses ([323b8ac](https://github.com/nervosnetwork/ckb-sdk-js/commit/323b8ac))





## [0.17.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.0...v0.17.1) (2019-07-29)


### Bug Fixes

* **types:** remove the hash_type field from the type of cell_out_point ([58c019f](https://github.com/nervosnetwork/ckb-sdk-js/commit/58c019f))


### BREAKING CHANGES

* **types:** the type of cell out point changes





# [0.17.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.16.0...v0.17.0) (2019-07-27)


### Features

* **types:** add a new field named 'hash_type' in types of script and cell output ([2692c0a](https://github.com/nervosnetwork/ckb-sdk-js/commit/2692c0a))
* **utils:** update the address format ([74a5ad8](https://github.com/nervosnetwork/ckb-sdk-js/commit/74a5ad8))


### BREAKING CHANGES

* **types:** types of script and cell output changed
* **utils:** update the address format





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package ckb-sdk-js





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)


### Bug Fixes

* **rpc:** fix the return type of get_transaction api ([a1a5cf4](https://github.com/nervosnetwork/ckb-sdk-js/commit/a1a5cf4))


### Features

* **utils:** remove toAddressIdentifier method ([ab1e356](https://github.com/nervosnetwork/ckb-sdk-js/commit/ab1e356))


### BREAKING CHANGES

* **utils:** remove toAddressIdentifier method





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Bug Fixes

* **rpc:** binding the node of method instances to the one of rpc instance. ([f0b486a](https://github.com/nervosnetwork/ckb-sdk-js/commit/f0b486a))


### Features

* **cli:** add dashboard mode of ckb-cli ([9accdeb](https://github.com/nervosnetwork/ckb-sdk-js/commit/9accdeb))
* **rpc:** add index related rpc ([cf8931b](https://github.com/nervosnetwork/ckb-sdk-js/commit/cf8931b))
* **rpc:** add index related rpc ([2a7d403](https://github.com/nervosnetwork/ckb-sdk-js/commit/2a7d403))
* **rpc:** update get blockchain info rpc ([7382458](https://github.com/nervosnetwork/ckb-sdk-js/commit/7382458))
* **rpc:** update the type of epoch ([509a79b](https://github.com/nervosnetwork/ckb-sdk-js/commit/509a79b))
* **utils:** add signRecoverable method to the ECPair class ([3c1f334](https://github.com/nervosnetwork/ckb-sdk-js/commit/3c1f334))


### BREAKING CHANGES

* **rpc:** update the type of epoch, remove block_reward, last_block_hash_in_previous_epoch,
remainder_reward fields, add epoch_reward field.
* **rpc:** replace warnings field with alerts field in the response of get blockchain info rpc
* **utils:** use signRecoverable instead of sign method to sign the transactions.





# [0.14.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.13.0...v0.14.0) (2019-06-15)


### Features

* **types:** remove the args field in cell input type ([d07f253](https://github.com/nervosnetwork/ckb-sdk-js/commit/d07f253))
* **core:** add signWitnesses and signTransaction methods in the core module ([c20d36c](https://github.com/nervosnetwork/ckb-sdk-js/commit/c20d36c))


### BREAKING CHANGES

* **types:** the type of cell input changes, its args field is removed.





# [0.13.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.12.0...v0.13.0) (2019-06-01)


### Features

* **address:** add blake160-ed public key as address identifier ([b7bee1c](https://github.com/nervosnetwork/ckb-sdk-js/commit/b7bee1c))
* **rpc:** add total_tx_cycles and total_tx_size in tx_pool_info ([5db06fa](https://github.com/nervosnetwork/ckb-sdk-js/commit/5db06fa))





# [0.12.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.11.0...v0.12.0) (2019-05-18)


### Bug Fixes

* **rpc:** fix get live cell rpc ([dffcc55](https://github.com/nervosnetwork/ckb-sdk-js/commit/dffcc55))
* **rpc:** fix the return type of getCellsByLockHash from cellByLockHash to cellIncludingOutPoint ([f648f56](https://github.com/nervosnetwork/ckb-sdk-js/commit/f648f56))


### Features

* **core:** add _compute_transaction_hash rpc ([9f81f28](https://github.com/nervosnetwork/ckb-sdk-js/commit/9f81f28))
* **core:** add address module into core module ([d5d75ec](https://github.com/nervosnetwork/ckb-sdk-js/commit/d5d75ec))
* **core:** add load system cell method ([94af040](https://github.com/nervosnetwork/ckb-sdk-js/commit/94af040))
* **core:** remove wallet module ([551f5a2](https://github.com/nervosnetwork/ckb-sdk-js/commit/551f5a2))
* **rpc:** add get epoch by number rpc ([d1141dd](https://github.com/nervosnetwork/ckb-sdk-js/commit/d1141dd))
* **rpc:** add get peers rpc ([f67eee6](https://github.com/nervosnetwork/ckb-sdk-js/commit/f67eee6))
* **rpc:** add get tx pool info rpc ([203dcde](https://github.com/nervosnetwork/ckb-sdk-js/commit/203dcde))
* **rpc:** add one new rpc and remove two rpc ([21c4ac4](https://github.com/nervosnetwork/ckb-sdk-js/commit/21c4ac4))
* **rpc:** add rpc of get blockchain info and get peers state ([9f7d20c](https://github.com/nervosnetwork/ckb-sdk-js/commit/9f7d20c))
* **rpc:** add rpc of getCurrentEpoch ([9e631db](https://github.com/nervosnetwork/ckb-sdk-js/commit/9e631db))
* **rpc:** export formatter as helpers in rpc module ([160aa1c](https://github.com/nervosnetwork/ckb-sdk-js/commit/160aa1c))
* **rpc:** generalize outpoint ([2a41797](https://github.com/nervosnetwork/ckb-sdk-js/commit/2a41797))
* **rpc:** update staging in tx pool info to proposed ([a4f4192](https://github.com/nervosnetwork/ckb-sdk-js/commit/a4f4192))
* **types:** rename the proposals_root field in block header to proposals_hash ([b2db527](https://github.com/nervosnetwork/ckb-sdk-js/commit/b2db527))


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


### BREAKING CHANGES

* **feat:** remove always success wallet
* **types:** update basic types according to ckb-types update



# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Bug Fixes

* **utils:** fix typo of seperator to separator ([b336968](https://github.com/nervosnetwork/ckb-sdk-js/commit/b336968))


### Features

* **types:** add field of validSince in cell input of a transaction ([54770fc](https://github.com/nervosnetwork/ckb-sdk-js/commit/54770fc))
* **types:** remove cellbase id from block header, remove cellbase from uncle block ([96a1f53](https://github.com/nervosnetwork/ckb-sdk-js/commit/96a1f53))
* **types:** update ckb-types ([e6af3b5](https://github.com/nervosnetwork/ckb-sdk-js/commit/e6af3b5))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([82121b3](https://github.com/nervosnetwork/ckb-sdk-js/commit/82121b3))
* **utils:** parseAddress returns bytes or hex string instead of words ([aaad9c9](https://github.com/nervosnetwork/ckb-sdk-js/commit/aaad9c9))


### BREAKING CHANGES

* **types:** replace type of u64 with type of string in ckb-types, remove version field from script interface
* **types:** rpc interface updated, add field of validSince in cell input of a transaction
* **types:** block header and uncle block in rpc updated





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)


### Bug Fixes

* **types:** set the type of arg in script to string ([7ea3ad2](https://github.com/nervosnetwork/ckb-sdk-js/commit/7ea3ad2))





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)


### Features

* **rpc:** add segrated witnesses ([bc8339f](https://github.com/nervosnetwork/ckb-sdk-js/commit/bc8339f))
* **types:** update types of script, cell input, cell output ([ee405bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/ee405bb))
* **types:** remove cellbase id from block header, remove cellbase from uncle block ([de9f50d](https://github.com/nervosnetwork/ckb-sdk-js/commit/de9f50d))
* **utils:** add blake160, bech32, blake160PubkeyToAddress, pubkeyToAddress ([79cb24f](https://github.com/nervosnetwork/ckb-sdk-js/commit/79cb24f))
* **utils:** parseAddress returns bytes or hex string instead of words ([2028a6c](https://github.com/nervosnetwork/ckb-sdk-js/commit/2028a6c))
* **wallet:** remove udt account ([7e3cf6d](https://github.com/nervosnetwork/ckb-sdk-js/commit/7e3cf6d))


### BREAKING CHANGES

* **types:** block header and uncle block in rpc updated
* **types:** script model updated





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)


### Features

* **account:** remove all udt scripts ([9b0f54b](https://github.com/nervosnetwork/ckb-sdk-js/commit/9b0f54b))
* **utils:** add type definition of blake2b-wasm ([f2cd199](https://github.com/nervosnetwork/ckb-sdk-js/commit/f2cd199))
* **utils:** repalce-sha3-with-blake2b ([93bddd1](https://github.com/nervosnetwork/ckb-sdk-js/commit/93bddd1))
* **utils:** update blake2b personal to 'ckb-default-hash' and add tests ([5c3bab3](https://github.com/nervosnetwork/ckb-sdk-js/commit/5c3bab3))
* **wallet:** remove unlock.rb, use c script instead ([3520208](https://github.com/nervosnetwork/ckb-sdk-js/commit/3520208))


### BREAKING CHANGES

* **utils:** update default signature method
