#!/bin/bash

BASE_DIR="packages/ckb-sdk-core/umd/"

npx rimraf $BASE_DIR
mkdir $BASE_DIR
echo "module.exports = require('@nervosnetwork/ckb-sdk-core').default;" > "${BASE_DIR}entry.js"
npx browserify "${BASE_DIR}entry.js" -o "${BASE_DIR}ckb-sdk.js" -s CKBCore
npx terser --compress --mangle -o "${BASE_DIR}ckb-sdk.umd.js" -- "${BASE_DIR}ckb-sdk.js"
npx rimraf "${BASE_DIR}/entry.js"
npx rimraf "${BASE_DIR}/ckb-sdk.js"

