# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.41.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.1) (2021-05-08)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.41.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.40.0...v0.41.0) (2021-05-06)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.40.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.39.0...v0.40.0) (2021-03-08)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.39.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.2...v0.39.0) (2021-01-13)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.38.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.1...v0.38.2) (2020-11-30)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.38.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.38.0...v0.38.1) (2020-11-27)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.38.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.37.0...v0.38.0) (2020-11-20)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.37.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.37.0) (2020-10-25)


### Features

* **rpc:** add rpc#pingPeers, rpc#getTransactionProof, rpc#verifyTransactionProof and rpc#clearBannedAddresses ([#506](https://github.com/nervosnetwork/ckb-sdk-js/issues/506)) ([61efe5e](https://github.com/nervosnetwork/ckb-sdk-js/commit/61efe5e7b7638c7a41163e3b3b05bc92261f711a))





## [0.36.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.1...v0.36.2) (2020-10-20)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.36.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.36.0...v0.36.1) (2020-09-26)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.36.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.35.0...v0.36.0) (2020-09-21)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.35.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.34.0...v0.35.0) (2020-08-24)

### Features

* **rpc:** update RPCs ([#477](https://github.com/nervosnetwork/ckb-sdk-js/pull/477))
    - separate basic RPC by group
    - update teh API of rpc#localNodeInfo, rpc#txPoolInfo, and rpc#getPeers
    - add new RPCs: rpc#syncState, rpc#clearTxPool, rpc#setNetworkActive, rpc#addNode and rpc#removeNode


### BREAKING CHANGES

* **rpc:** rpc#getPeers returns connectedDuration, lastPingDuration, protocols, syncState
* **rpc:** rpc#localNodeInfo returns active, connections, protocols





# [0.34.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.33.0...v0.34.0) (2020-07-21)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.33.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.32.0...v0.33.0) (2020-06-22)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.32.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.31.0...v0.32.0) (2020-05-26)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.31.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.30.0...v0.31.0) (2020-04-21)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.30.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.29.1...v0.30.0) (2020-03-23)


### Features

* **rpc:** add a new field in the tx pool info ([c1cbac9](https://github.com/nervosnetwork/ckb-sdk-js/commit/c1cbac9aeb1799f611543696f7ee9b717cfb237d))
* **rpc:** add the new RPC getBlockEconomicState ([0c9e248](https://github.com/nervosnetwork/ckb-sdk-js/commit/0c9e248d810dcbe83953f262385b4a8efb5d4f84))





## [0.29.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.1) (2020-02-28)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.29.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.28.0...v0.29.0) (2020-02-28)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.28.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.1...v0.28.0) (2020-02-07)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.27.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.27.0...v0.27.1) (2020-02-01)


### Features

* **rpc:** add the second paramter outputsValidator in the sendTransaction RPC method ([0c7b7b1](https://github.com/nervosnetwork/ckb-sdk-js/commit/0c7b7b1c4b5aa6847c8061ca1a98adad9186e3a7))


### BREAKING CHANGES

* **rpc:** Default outputsValidator on sending transactions requires the lock of outputs to be
the default lock script





# [0.27.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.4...v0.27.0) (2020-01-11)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.26.4](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.3...v0.26.4) (2020-01-02)


### Features

* **rpc:** add the new rpc method of get_capacity_by_lock_hash ([9628084](https://github.com/nervosnetwork/ckb-sdk-js/commit/9628084ba6111e2580d793a752992f45e142fcc5))





## [0.26.3](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.2...v0.26.3) (2019-12-23)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.26.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.1...v0.26.2) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.26.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.0...v0.26.1) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.26.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0...v0.26.0) (2019-12-16)


### Features

* **type:** update the return type of rpc.getCellsByLockHash ([30aa494](https://github.com/nervosnetwork/ckb-sdk-js/commit/30aa494583c2bc8c71282b29058d6ffe6495a5ce))





# [0.25.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0) (2019-11-16)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.25.0-alpha.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0-alpha.1) (2019-11-13)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.25.0-alpha.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.2...v0.25.0-alpha.0) (2019-11-12)


### Features

* **utils:** add parseEpoch method ([c29aca6](https://github.com/nervosnetwork/ckb-sdk-js/commit/c29aca606bf40f9b8cb3e98080c5ad36c0d5546a))





## [0.24.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.1...v0.24.2) (2019-11-08)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.24.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.0...v0.24.1) (2019-11-07)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.24.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.1...v0.24.0) (2019-11-02)


### Features

* **rpc:** add a rpc method ([928aaf9](https://github.com/nervosnetwork/ckb-sdk-js/commit/928aaf905bbc73165044f05c5c94c316665a773a))





## [0.23.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.0...v0.23.1) (2019-10-22)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.23.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.1...v0.23.0) (2019-10-19)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.22.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.0...v0.22.1) (2019-10-12)

**Note:** Version bump only for package @nervosnetwork/ckb-types





# [0.22.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.1...v0.22.0) (2019-10-05)


### Features

* **type:** update the fields of BlockHeader ([55de626](https://github.com/nervosnetwork/ckb-sdk-js/commit/55de626))
* **type:** update the result of getCellsByLockHash method ([31eb97e](https://github.com/nervosnetwork/ckb-sdk-js/commit/31eb97e))
* **type:** update the structure of Epoch ([76770f4](https://github.com/nervosnetwork/ckb-sdk-js/commit/76770f4))
* **type:** update the type of args ([09d649a](https://github.com/nervosnetwork/ckb-sdk-js/commit/09d649a))
* **type:** update the type of witness ([71f53b0](https://github.com/nervosnetwork/ckb-sdk-js/commit/71f53b0))


### BREAKING CHANGES

* **type:** replace difficulty with compactTarget in Epoch
* **type:** 1. remove unclesCount
2. merge witnessesRoot and transactionRoot
3. replace difficulty with compactTarget
* **type:** change the type of args from string[] to string
* **type:** change the type of witnes from { data: string[] } to string
* **type:** update the result of getCellsByLockHash method





## [0.21.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.0...v0.21.1) (2019-09-24)


### Bug Fixes

* **rpc:** update the returned cell type of getLiveCell from cell to liveCell ([4a69d85](https://github.com/nervosnetwork/ckb-sdk-js/commit/4a69d85))





# [0.21.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.20.0...v0.21.0) (2019-09-21)


### Features

* **rpc:** format the outputs of the params formatter ([740b403](https://github.com/nervosnetwork/ckb-sdk-js/commit/740b403))
* **rpc:** update the interface of getLiveCell ([0280d7f](https://github.com/nervosnetwork/ckb-sdk-js/commit/0280d7f))


### BREAKING CHANGES

* **rpc:** update the interface of getLiveCell
* **rpc:** hexilize the outputs of the params formatter





# [0.20.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.1...v0.20.0) (2019-09-07)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.19.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.0...v0.19.1) (2019-08-28)


### Features

* **rpc:** enable custom http agent and https agent ([34fca52](https://github.com/nervosnetwork/ckb-sdk-js/commit/34fca52))





# [0.19.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.18.0...v0.19.0) (2019-08-27)


### Features

* **type:** block header structure changes ([ce48faf](https://github.com/nervosnetwork/ckb-sdk-js/commit/ce48faf))
* **type:** CellOutput and Epoch structures change ([8346ae4](https://github.com/nervosnetwork/ckb-sdk-js/commit/8346ae4))
* **type:** Input structure changes ([ba16d1b](https://github.com/nervosnetwork/ckb-sdk-js/commit/ba16d1b))
* **type:** OutPoint structure changes ([38ba007](https://github.com/nervosnetwork/ckb-sdk-js/commit/38ba007))
* **type:** rename is_dep_group to dep_type ([06c324a](https://github.com/nervosnetwork/ckb-sdk-js/commit/06c324a))
* **type:** set the value of hash_type to "data" and "type" ([36a5512](https://github.com/nervosnetwork/ckb-sdk-js/commit/36a5512))
* **type:** Transaction structure changes ([30c84bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/30c84bb))
* **type:** Transaction structure changes ([71625fa](https://github.com/nervosnetwork/ckb-sdk-js/commit/71625fa))
* **type:** Transaction structure changes ([df65152](https://github.com/nervosnetwork/ckb-sdk-js/commit/df65152))


### BREAKING CHANGES

* **type:** set the value of hash_type to "data" and "type"
* **type:** rename is_dep_group to dep_type
* **type:** block header structure changes
* **type:** CellOutput and Epoch structures change
* **type:** Transaction structure chagnes
* **type:** OutPoint structure changes
* **type:** Input structure chagnes





# [0.18.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.1...v0.18.0) (2019-08-10)


### Features

* **rpc:** add get_cellbase_output_capacity_details rpc ([fa3aea3](https://github.com/nervosnetwork/ckb-sdk-js/commit/fa3aea3))
* **rpc:** add get_header rpc ([d2a6bbb](https://github.com/nervosnetwork/ckb-sdk-js/commit/d2a6bbb))
* **rpc:** add rpc of get banned addresses ([323b8ac](https://github.com/nervosnetwork/ckb-sdk-js/commit/323b8ac))





## [0.17.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.17.0...v0.17.1) (2019-07-29)


### Bug Fixes

* **types:** remove the hash_type field from the type of cell_out_point ([58c019f](https://github.com/nervosnetwork/ckb-sdk-js/commit/58c019f))


### BREAKING CHANGES

* **types:** the type of cell out point changes





# [0.17.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.16.0...v0.17.0) (2019-07-27)


### Features

* **types:** add a new field named 'hash_type' in types of script and cell output ([2692c0a](https://github.com/nervosnetwork/ckb-sdk-js/commit/2692c0a))


### BREAKING CHANGES

* **types:** types of script and cell output changed





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package @nervosnetwork/ckb-types





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)


### Bug Fixes

* **rpc:** fix the return type of get_transaction api ([a1a5cf4](https://github.com/nervosnetwork/ckb-sdk-js/commit/a1a5cf4))





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Features

* **rpc:** add index related rpc ([2a7d403](https://github.com/nervosnetwork/ckb-sdk-js/commit/2a7d403))
* **rpc:** update get blockchain info rpc ([7382458](https://github.com/nervosnetwork/ckb-sdk-js/commit/7382458))
* **rpc:** update the type of epoch ([509a79b](https://github.com/nervosnetwork/ckb-sdk-js/commit/509a79b))


### BREAKING CHANGES

* **rpc:** update the type of epoch, remove block_reward, last_block_hash_in_previous_epoch,
remainder_reward fields, add epoch_reward field.
* **rpc:** replace warnings field with alerts field in the response of get blockchain info rpc





# [0.14.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.13.0...v0.14.0) (2019-06-15)


### Features

* **types:** remove the args field in cell input type ([d07f253](https://github.com/nervosnetwork/ckb-sdk-js/commit/d07f253))


### BREAKING CHANGES

* **types:** the type of cell input changes, its args field is removed.





# [0.13.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.12.0...v0.13.0) (2019-06-01)


### Features

* **rpc:** add total_tx_cycles and total_tx_size in tx_pool_info ([5db06fa](https://github.com/nervosnetwork/ckb-sdk-js/commit/5db06fa))





# [0.12.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.11.0...v0.12.0) (2019-05-18)


### Features

* **types:** generalize outpoint ([2a41797](https://github.com/nervosnetwork/ckb-sdk-js/commit/2a41797))
* **types:** rename the proposals_root field in block header to proposals_hash ([b2db527](https://github.com/nervosnetwork/ckb-sdk-js/commit/b2db527))


### BREAKING CHANGES

* **types:** update type of outpoint
* **types:** rename the proposals_root field in block header to proposals_hash





# [0.11.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.10.0...v0.11.0) (2019-05-14)


### Features

* **types:** update basic types in CKB ([71d4e5](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/71d4e5))
* **types:** set the type of arg in script to string ([2aaa75](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/2aaa75))
* **types:** add shannon as a new capacity unit ([910cc5](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/910cc5))


### BREAKING CHANGES

* **types:** update basic types according to ckb-types update






# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Features

* **types:** add field of validSince in cell input of a transaction ([54770fc](https://github.com/nervosnetwork/ckb-sdk-js/commit/54770fc))
* **types:** update ckb-types ([e6af3b5](https://github.com/nervosnetwork/ckb-sdk-js/commit/e6af3b5))


### BREAKING CHANGES

* **types:** replace type of u64 with type of string in ckb-types, remove version field from script interface
* **types:** rpc interface updated, add field of validSince in cell input of a transaction





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)


### Bug Fixes

* **types:** set the type of arg in script to string ([7ea3ad2](https://github.com/nervosnetwork/ckb-sdk-js/commit/7ea3ad2))





# [0.9.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.8.0...v0.9.0) (2019-04-22)


### Features

* **rpc:** add segrated witnesses ([bc8339f](https://github.com/nervosnetwork/ckb-sdk-js/commit/bc8339f))
* **types:** update types of script, cell input, cell output ([ee405bb](https://github.com/nervosnetwork/ckb-sdk-js/commit/ee405bb))
* **types:** remove cellbase id from block header, remove cellbase from uncle block ([de9f50d](https://github.com/nervosnetwork/ckb-sdk-js/commit/de9f50d))


### BREAKING CHANGES

* **types:** block header and uncle block in rpc updated
* **types:** script model updated





# [0.8.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.7.0...v0.8.0) (2019-04-08)


# [0.7.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.0.1-alpha.3...v0.7.0) (2019-03-25)

**Note:** Version bump only for package @nervosnetwork/ckb-types
