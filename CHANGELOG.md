# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
