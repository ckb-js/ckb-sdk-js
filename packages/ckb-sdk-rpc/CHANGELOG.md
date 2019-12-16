# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.26.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.1...v0.26.2) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





## [0.26.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.26.0...v0.26.1) (2019-12-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





# [0.26.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0...v0.26.0) (2019-12-16)


### Bug Fixes

* **rpc:** add missing types in rpc type def ([8427341](https://github.com/nervosnetwork/ckb-sdk-js/commit/842734137f7129f94c397f8f12ca79eab7ad3cf9))
* **rpc:** fix the type def of ScriptHashType ([217a579](https://github.com/nervosnetwork/ckb-sdk-js/commit/217a5797d03423ce020d6dba9b23f778dea16632))


### Features

* enable JSBI for compatibility ([bfce1e5](https://github.com/nervosnetwork/ckb-sdk-js/commit/bfce1e57dc2008efd0697951614d0f94469375b8))
* **type:** update the return type of rpc.getCellsByLockHash ([30aa494](https://github.com/nervosnetwork/ckb-sdk-js/commit/30aa494583c2bc8c71282b29058d6ffe6495a5ce))


### BREAKING CHANGES

* utils.toHexInLittleEndian will not accept parameters in number





# [0.25.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0) (2019-11-16)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





# [0.25.0-alpha.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.25.0-alpha.0...v0.25.0-alpha.1) (2019-11-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





# [0.25.0-alpha.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.2...v0.25.0-alpha.0) (2019-11-12)


### Features

* **rpc:** add an rpc method of calculateDaoMaximumWithdraw ([f4cd7e7](https://github.com/nervosnetwork/ckb-sdk-js/commit/f4cd7e7b53817908f8931463604ea630d1a2ec5a))
* **utils:** add parseEpoch method ([c29aca6](https://github.com/nervosnetwork/ckb-sdk-js/commit/c29aca606bf40f9b8cb3e98080c5ad36c0d5546a))





## [0.24.2](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.1...v0.24.2) (2019-11-08)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





## [0.24.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.24.0...v0.24.1) (2019-11-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





# [0.24.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.1...v0.24.0) (2019-11-02)


### Features

* **rpc:** add a rpc method ([928aaf9](https://github.com/nervosnetwork/ckb-sdk-js/commit/928aaf905bbc73165044f05c5c94c316665a773a))





## [0.23.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.23.0...v0.23.1) (2019-10-22)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





# [0.23.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.1...v0.23.0) (2019-10-19)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





## [0.22.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.22.0...v0.22.1) (2019-10-12)


### Bug Fixes

* **rpc:** update the signatures of rpc methods ([7eb6726](https://github.com/nervosnetwork/ckb-sdk-js/commit/7eb6726)), closes [#365](https://github.com/nervosnetwork/ckb-sdk-js/issues/365)


### BREAKING CHANGES

* **rpc:** use bigint instead of number in signatures of rpc methods





# [0.22.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.1...v0.22.0) (2019-10-05)


### Features

* **rpc:** update rpc signatures ([201901d](https://github.com/nervosnetwork/ckb-sdk-js/commit/201901d))
* **rpc:** use bigint instead of number in the interfaces of rpc methods ([c8d994b](https://github.com/nervosnetwork/ckb-sdk-js/commit/c8d994b))
* **type:** update the fields of BlockHeader ([55de626](https://github.com/nervosnetwork/ckb-sdk-js/commit/55de626))
* **type:** update the result of getCellsByLockHash method ([31eb97e](https://github.com/nervosnetwork/ckb-sdk-js/commit/31eb97e))
* **type:** update the structure of Epoch ([76770f4](https://github.com/nervosnetwork/ckb-sdk-js/commit/76770f4))
* **type:** update the type of args ([09d649a](https://github.com/nervosnetwork/ckb-sdk-js/commit/09d649a))


### BREAKING CHANGES

* **type:** replace difficulty with compactTarget in Epoch
* **type:** 1. remove unclesCount
2. merge witnessesRoot and transactionRoot
3. replace difficulty with compactTarget
* **type:** change the type of args from string[] to string
* **rpc:** use bigint instead of number in the interfaces of rpc methods
* **type:** update the result of getCellsByLockHash method





## [0.21.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.21.0...v0.21.1) (2019-09-24)


### Bug Fixes

* **rpc:** add a parser for optional parameters ([274268e](https://github.com/nervosnetwork/ckb-sdk-js/commit/274268e))
* **rpc:** update the returned cell type of getLiveCell from cell to liveCell ([4a69d85](https://github.com/nervosnetwork/ckb-sdk-js/commit/4a69d85))





# [0.21.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.20.0...v0.21.0) (2019-09-21)


### Features

* **rpc:** format the outputs of the params formatter ([740b403](https://github.com/nervosnetwork/ckb-sdk-js/commit/740b403))
* **rpc:** update the interface of getLiveCell ([0280d7f](https://github.com/nervosnetwork/ckb-sdk-js/commit/0280d7f))


### BREAKING CHANGES

* **rpc:** update the interface of getLiveCell
* **rpc:** hexilize the outputs of the params formatter





# [0.20.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.19.1...v0.20.0) (2019-09-07)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





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


### BREAKING CHANGES

* **types:** types of script and cell output changed





# [0.16.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.1...v0.16.0) (2019-07-13)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





## [0.15.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.15.0...v0.15.1) (2019-07-12)


### Bug Fixes

* **rpc:** fix the return type of get_transaction api ([a1a5cf4](https://github.com/nervosnetwork/ckb-sdk-js/commit/a1a5cf4))





# [0.15.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.14.0...v0.15.0) (2019-06-29)


### Bug Fixes

* **rpc:** binding the node of method instances to the one of rpc instance. ([f0b486a](https://github.com/nervosnetwork/ckb-sdk-js/commit/f0b486a))


### Features

* **rpc:** add index related rpc ([cf8931b](https://github.com/nervosnetwork/ckb-sdk-js/commit/cf8931b))
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


### Bug Fixes

* **rpc:** fix get live cell rpc ([dffcc55](https://github.com/nervosnetwork/ckb-sdk-js/commit/dffcc55))
* **rpc:** fix the return type of getCellsByLockHash from cellByLockHash to cellIncludingOutPoint ([f648f56](https://github.com/nervosnetwork/ckb-sdk-js/commit/f648f56))


### Features

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





# [0.11.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.10.0...v0.11.0) (2019-05-14)


### Features

* **rpc:** feat(rpc): update rpc interface formatter according to new api ([c0a631](https://github.com/nervosnetwork/ckb-sdk-js/pull/135/commits/c0a631))





# [0.10.0](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.10.0) (2019-05-06)


### Features

* **types:** add field of validSince in cell input of a transaction ([54770fc](https://github.com/nervosnetwork/ckb-sdk-js/commit/54770fc))
* **types:** update ckb-types ([e6af3b5](https://github.com/nervosnetwork/ckb-sdk-js/commit/e6af3b5))


### BREAKING CHANGES

* **types:** replace type of u64 with type of string in ckb-types, remove version field from script interface
* **types:** rpc interface updated, add field of validSince in cell input of a transaction





## [0.9.1](https://github.com/nervosnetwork/ckb-sdk-js/compare/v0.9.0...v0.9.1) (2019-04-24)

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc





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

**Note:** Version bump only for package @nervosnetwork/ckb-sdk-rpc
