/* eslint-disable max-len */

jest.mock('axios')

const axiosMock = require('axios')
const CKBRPC = require('../lib').default

describe('Test with mock', () => {
  const rpc = new CKBRPC()
  const ranNum = 1
  const id = Math.round(ranNum * 10000)

  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(ranNum)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('ckb-rpc success', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('get block by number', async () => {
      const BLOCK_NUMBER = '0x400'
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            header: {
              compact_target: '0x1e083126',
              dao: '0xb5a3e047474401001bc476b9ee573000c0c387962a38000000febffacf030000',
              epoch: '0x7080018000001',
              hash: '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
              nonce: '0x0',
              number: '0x400',
              parent_hash: '0xae003585fa15309b30b31aed3dcf385e9472c3c3e93746a6c4540629a6a1ed2d',
              proposals_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              timestamp: '0x5cd2b117',
              transactions_root: '0xc47d5b78b3c4c4c853e2a32810818940d0ee403423bea9ec7b8e566d9595206c',
              uncles_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              version: '0x0',
            },
            proposals: [],
            transactions: [
              {
                cell_deps: [],
                hash: '0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17',
                header_deps: [],
                inputs: [
                  {
                    previous_output: {
                      index: '0xffffffff',
                      tx_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    },
                    since: '0x400',
                  },
                ],
                outputs: [
                  {
                    capacity: '0x18e64b61cf',
                    lock: {
                      args: '0x',
                      code_hash: '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
                      hash_type: 'data',
                    },
                    type: null,
                  },
                ],
                outputs_data: ['0x'],
                version: '0x0',
                witnesses: [
                  '0x450000000c000000410000003500000010000000300000003100000028e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5000000000000000000',
                ],
              },
            ],
            uncles: [],
          },
        },
      })
      const res = await rpc.getBlockByNumber(BLOCK_NUMBER)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_block_by_number',
        params: [BLOCK_NUMBER],
      })
      expect(res).toEqual({
        header: {
          compactTarget: '0x1e083126',
          dao: '0xb5a3e047474401001bc476b9ee573000c0c387962a38000000febffacf030000',
          epoch: '0x7080018000001',
          hash: '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
          nonce: '0x0',
          number: '0x400',
          parentHash: '0xae003585fa15309b30b31aed3dcf385e9472c3c3e93746a6c4540629a6a1ed2d',
          proposalsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          timestamp: '0x5cd2b117',
          transactionsRoot: '0xc47d5b78b3c4c4c853e2a32810818940d0ee403423bea9ec7b8e566d9595206c',
          unclesHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          version: '0x0',
        },
        proposals: [],
        transactions: [
          {
            cellDeps: [],
            hash: '0x365698b50ca0da75dca2c87f9e7b563811d3b5813736b8cc62cc3b106faceb17',
            headerDeps: [],
            inputs: [
              {
                previousOutput: {
                  index: '0xffffffff',
                  txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                },
                since: '0x400',
              },
            ],
            outputs: [
              {
                capacity: '0x18e64b61cf',
                lock: {
                  args: '0x',
                  codeHash: '0x28e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5',
                  hashType: 'data',
                },
                type: null,
              },
            ],
            outputsData: ['0x'],
            version: '0x0',
            witnesses: [
              '0x450000000c000000410000003500000010000000300000003100000028e83a1277d48add8e72fadaa9248559e1b632bab2bd60b27955ebc4c03800a5000000000000000000',
            ],
          },
        ],
        uncles: [],
      })
    })
    it('tx pool info', async () => {
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            last_txs_updated_at: '0x0',
            min_fee_rate: '0x0',
            orphan: '0x0',
            pending: '0x1',
            proposed: '0x0',
            total_tx_cycles: '0x219',
            total_tx_size: '0x112',
          },
        },
      })
      const res = await rpc.txPoolInfo()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'tx_pool_info',
        params: [],
      })
      expect(res).toEqual({
        lastTxsUpdatedAt: '0x0',
        minFeeRate: '0x0',
        orphan: '0x0',
        pending: '0x1',
        proposed: '0x0',
        totalTxCycles: '0x219',
        totalTxSize: '0x112',
      })
    })
    it('get current epoch', async () => {
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            compact_target: '0x1e083126',
            length: '0x708',
            number: '0x1',
            start_number: '0x3e8',
          },
        },
      })
      const res = await rpc.getCurrentEpoch()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_current_epoch',
        params: [],
      })
      expect(res).toEqual({
        compactTarget: '0x1e083126',
        length: '0x708',
        number: '0x1',
        startNumber: '0x3e8',
      })
    })
    it('get epoch by number', async () => {
      const BLOCK_NUMBER = '0x0'
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            compact_target: '0x20010000',
            length: '0x3e8',
            number: '0x0',
            start_number: '0x0',
          },
        },
      })
      const res = await rpc.getEpochByNumber(BLOCK_NUMBER)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_epoch_by_number',
        params: [BLOCK_NUMBER],
      })
      expect(res).toEqual({
        compactTarget: '0x20010000',
        length: '0x3e8',
        number: '0x0',
        startNumber: '0x0',
      })
    })
    it.skip('dryRunTransaction', async () => {})
    it('get cellbase output capacity details', async () => {
      const BLOCK_HASH = '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40'
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            primary: '0x18ce922bca',
            proposal_reward: '0x0',
            secondary: '0x17b93605',
            total: '0x18e64b61cf',
            tx_fee: '0x0',
          },
        },
      })
      const res = await rpc.getCellbaseOutputCapacityDetails(BLOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_cellbase_output_capacity_details',
        params: [BLOCK_HASH],
      })
      expect(res).toEqual({
        primary: '0x18ce922bca',
        proposalReward: '0x0',
        secondary: '0x17b93605',
        total: '0x18e64b61cf',
        txFee: '0x0',
      })
    })
    it('calculate dao maximum withdraw', async () => {
      const PARAMS = [
        {
          index: '0x0',
          txHash: '0xa4037a893eb48e18ed4ef61034ce26eba9c585f15c9cee102ae58505565eccc3',
        },
        '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
      ]
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: '0x4a8b4e8a4',
        },
      })
      const res = await rpc.calculateDaoMaximumWithdraw(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'calculate_dao_maximum_withdraw',
        params: [
          {
            index: '0x0',
            tx_hash: '0xa4037a893eb48e18ed4ef61034ce26eba9c585f15c9cee102ae58505565eccc3',
          },
          '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
        ],
      })
      expect(res).toBe('0x4a8b4e8a4')
    })
    it('get capacity by lock hash', async () => {
      const LOCK_HASH = '0x4ceaa32f692948413e213ce6f3a83337145bde6e11fd8cb94377ce2637dcc412'
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            block_number: '0x400',
            capacity: '0xb00fb84df292',
            cells_count: '0x3f5',
          },
        },
      })
      const res = await rpc.getCapacityByLockHash(LOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_capacity_by_lock_hash',
        params: [LOCK_HASH],
      })
      expect(res).toEqual({
        blockNumber: '0x400',
        capacity: '0xb00fb84df292',
        cellsCount: '0x3f5',
      })
    })
    it('get block economic state', async () => {
      const BLOCK_HASH = '0x02530b25ad0ff677acc365cb73de3e8cc09c7ddd58272e879252e199d08df83b'

      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: {
            finalized_at: '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
            issuance: {
              primary: '0x18ce922bca',
              secondary: '0x7f02ec655',
            },
            miner_reward: {
              committed: '0x0',
              primary: '0x18ce922bca',
              proposal: '0x0',
              secondary: '0x17b93605',
            },
            txs_fee: '0x0',
          },
        },
      })
      const res = await rpc.getBlockEconomicState(BLOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_block_economic_state',
        params: [BLOCK_HASH],
      })
      expect(res).toEqual({
        finalizedAt: '0xa5f5c85987a15de25661e5a214f2c1449cd803f071acc7999820f25246471f40',
        issuance: {
          primary: '0x18ce922bca',
          secondary: '0x7f02ec655',
        },
        minerReward: {
          committed: '0x0',
          primary: '0x18ce922bca',
          proposal: '0x0',
          secondary: '0x17b93605',
        },
        txsFee: '0x0',
      })
    })
    it('get blockchain info', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            alerts: [],
            chain: 'ckb_dev',
            difficulty: '0x100',
            epoch: '0xa00090000e2',
            is_initial_block_download: true,
            median_time: '0x172a87eeab0',
          },
          id,
        },
      })
      const res = await rpc.getBlockchainInfo()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_blockchain_info',
        params: [],
      })
      expect(res).toEqual({
        alerts: [],
        chain: 'ckb_dev',
        difficulty: '0x100',
        epoch: '0xa00090000e2',
        isInitialBlockDownload: true,
        medianTime: '0x172a87eeab0',
      })
    })

    it('local node info', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            addresses: [
              {
                address: '/ip4/0.0.0.0/tcp/8115/p2p/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                score: '0x100',
              },
            ],
            is_outbound: null,
            node_id: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            version: '0.33.0 (248aa88 2020-10-22)',
          },
          id,
        },
      })
      const res = await rpc.localNodeInfo()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'local_node_info',
        params: [],
      })
      expect(res).toEqual({
        addresses: [
          {
            address: '/ip4/0.0.0.0/tcp/8115/p2p/eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            score: '0x100',
          },
        ],
        isOutbound: null,
        nodeId: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        version: '0.33.0 (248aa88 2020-10-22)',
      })
    })

    it('get peers', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [],
          id,
        },
      })
      const res = await rpc.getPeers()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_peers',
        params: [],
      })
      expect(res).toEqual([])
    })

    it('get peers state', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [],
          id,
        },
      })
      const res = await rpc.getPeersState()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_peers_state',
        params: [],
      })
      expect(res).toEqual({
        blocksInFlight: undefined,
        lastUpdated: undefined,
      })
    })

    it('get tip block number', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: '0x8dd',
          id,
        },
      })
      const res = await rpc.getTipBlockNumber()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_tip_block_number',
        params: [],
      })
      expect(res).toBe('0x8dd')
    })

    it('get block hash', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: '0x120ab9abd48e3b82f93b88eba8c50a0e1304cc2fffb5573fb14b56c6348f2305',
          id,
        },
      })
      const res = await rpc.getBlockHash('0x0')
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_block_hash',
        params: ['0x0'],
      })
      expect(res).toBe('0x120ab9abd48e3b82f93b88eba8c50a0e1304cc2fffb5573fb14b56c6348f2305')
    })

    it('get block', async () => {
      const BLOCK_HASH = '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4'
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            header: {
              compact_target: '0x20010000',
              dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
              epoch: '0xa00090000e2',
              hash: BLOCK_HASH,
              nonce: '0x3388940124a1004051e37eb039a3dfeb',
              number: '0x8dd',
              parent_hash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
              proposals_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              timestamp: '0x172a8804ad1',
              transactions_root: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
              uncles_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              version: '0x0',
            },
            proposals: [],
            transactions: [
              {
                cell_deps: [],
                hash: '0x638f645b153c543acc63a884cf2423499bd2774b42d7dd96bd8b50ddc4b5c038',
                header_deps: [],
                inputs: [
                  {
                    previous_output: {
                      index: '0xffffffff',
                      tx_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    },
                    since: '0x8dd',
                  },
                ],
                outputs: [
                  {
                    capacity: '0x12440cbf2a1e',
                    lock: {
                      args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                      code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                      hash_type: 'type',
                    },
                    type: null,
                  },
                ],
                outputs_data: ['0x'],
                version: '0x0',
                witnesses: [
                  '0x5a0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000e2fa82e70b062c8644b80ad7ecf6e015e5f352f60100000000',
                ],
              },
            ],
            uncles: [],
          },
          id,
        },
      })

      const res = await rpc.getBlock(BLOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_block',
        params: [BLOCK_HASH],
      })
      expect(res).toEqual({
        header: {
          compactTarget: '0x20010000',
          dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
          epoch: '0xa00090000e2',
          hash: BLOCK_HASH,
          nonce: '0x3388940124a1004051e37eb039a3dfeb',
          number: '0x8dd',
          parentHash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
          proposalsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          timestamp: '0x172a8804ad1',
          transactionsRoot: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
          unclesHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          version: '0x0',
        },
        proposals: [],
        transactions: [
          {
            cellDeps: [],
            hash: '0x638f645b153c543acc63a884cf2423499bd2774b42d7dd96bd8b50ddc4b5c038',
            headerDeps: [],
            inputs: [
              {
                previousOutput: {
                  index: '0xffffffff',
                  txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                },
                since: '0x8dd',
              },
            ],
            outputs: [
              {
                capacity: '0x12440cbf2a1e',
                lock: {
                  args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                  codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                  hashType: 'type',
                },
                type: null,
              },
            ],
            outputsData: ['0x'],
            version: '0x0',
            witnesses: [
              '0x5a0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000e2fa82e70b062c8644b80ad7ecf6e015e5f352f60100000000',
            ],
          },
        ],
        uncles: [],
      })
    })

    it('get tip header', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            compact_target: '0x20010000',
            dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
            epoch: '0xa00090000e2',
            hash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
            nonce: '0x3388940124a1004051e37eb039a3dfeb',
            number: '0x8dd',
            parent_hash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
            proposals_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            timestamp: '0x172a8804ad1',
            transactions_root: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
            uncles_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            version: '0x0',
          },
          id,
        },
      })
      const res = await rpc.getTipHeader()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_tip_header',
        params: [],
      })
      expect(res).toEqual({
        compactTarget: '0x20010000',
        dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
        epoch: '0xa00090000e2',
        hash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
        nonce: '0x3388940124a1004051e37eb039a3dfeb',
        number: '0x8dd',
        parentHash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
        proposalsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '0x172a8804ad1',
        transactionsRoot: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
        unclesHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        version: '0x0',
      })
    })

    it('get transaction', async () => {
      const TX_HASH = '0xc4a69f70877c2e00897191e0ca81edc8ad14ff81b8049c9d66523df7e365524f'
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            transaction: {
              cell_deps: [],
              hash: TX_HASH,
              header_deps: [],
              inputs: [
                {
                  previous_output: {
                    index: '0xffffffff',
                    tx_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  },
                  since: '0x8dc',
                },
              ],
              outputs: [
                {
                  capacity: '0x12440d255842',
                  lock: {
                    args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                    code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                    hash_type: 'type',
                  },
                  type: null,
                },
              ],
              outputs_data: ['0x'],
              version: '0x0',
              witnesses: [
                '0x5a0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000e2fa82e70b062c8644b80ad7ecf6e015e5f352f60100000000',
              ],
            },
            tx_status: {
              block_hash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
              status: 'committed',
            },
          },
          id,
        },
      })
      const res = await rpc.getTransaction(TX_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_transaction',
        params: [TX_HASH],
      })
      expect(res).toEqual({
        transaction: {
          cellDeps: [],
          hash: '0xc4a69f70877c2e00897191e0ca81edc8ad14ff81b8049c9d66523df7e365524f',
          headerDeps: [],
          inputs: [
            {
              previousOutput: {
                index: '0xffffffff',
                txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              },
              since: '0x8dc',
            },
          ],
          outputs: [
            {
              capacity: '0x12440d255842',
              lock: {
                args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                hashType: 'type',
              },
              type: null,
            },
          ],
          outputsData: ['0x'],
          version: '0x0',
          witnesses: [
            '0x5a0000000c00000055000000490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000e2fa82e70b062c8644b80ad7ecf6e015e5f352f60100000000',
          ],
        },
        txStatus: {
          blockHash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
          status: 'committed',
        },
      })
    })

    it('get live cell', async () => {
      const OUT_POINT = {
        txHash: '0xc4a69f70877c2e00897191e0ca81edc8ad14ff81b8049c9d66523df7e365524f',
        index: '0x0',
      }
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            cell: {
              data: {
                content: '0x',
                hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              },
              output: {
                capacity: '0x12440d255842',
                lock: {
                  args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                  code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                  hash_type: 'type',
                },
                type: null,
              },
            },
            status: 'live',
          },
          id,
        },
      })
      const res = await rpc.getLiveCell(OUT_POINT, true)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_live_cell',
        params: [
          {
            tx_hash: '0xc4a69f70877c2e00897191e0ca81edc8ad14ff81b8049c9d66523df7e365524f',
            index: '0x0',
          },
          true,
        ],
      })
      expect(res).toEqual({
        cell: {
          data: {
            content: '0x',
            hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          },
          output: {
            capacity: '0x12440d255842',
            lock: {
              args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
              codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
              hashType: 'type',
            },
            type: null,
          },
        },
        status: 'live',
      })
    })

    it('get cells by lock hash', async () => {
      const PARAMS = ['0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674', '0x0', '0x64']
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [
            {
              block_hash: '0x8b5de4cad43e62fdc391d897b94a97d1af369bbe2b7cbe1de20d432da5a23f4c',
              capacity: '0x12479afc2a35',
              cellbase: true,
              lock: {
                args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                hash_type: 'type',
              },
              out_point: {
                index: '0x0',
                tx_hash: '0x0db670e7bab37e4f942acf47c7887009771e01b5a6b282eff32084c38533a2b2',
              },
              output_data_len: '0x0',
              type: null,
            },
          ],
          id,
        },
      })
      const res = await rpc.getCellsByLockHash(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_cells_by_lock_hash',
        params: PARAMS,
      })
      expect(res).toEqual([
        {
          blockHash: '0x8b5de4cad43e62fdc391d897b94a97d1af369bbe2b7cbe1de20d432da5a23f4c',
          capacity: '0x12479afc2a35',
          cellbase: true,
          lock: {
            args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
            codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
            hashType: 'type',
          },
          outPoint: {
            index: '0x0',
            txHash: '0x0db670e7bab37e4f942acf47c7887009771e01b5a6b282eff32084c38533a2b2',
          },
          outputDataLen: '0x0',
          type: null,
        },
      ])
    })

    it('index lock hash', async () => {
      const PARAMS = ['0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674', '0x0']
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            block_hash: '0x8b5de4cad43e62fdc391d897b94a97d1af369bbe2b7cbe1de20d432da5a23f4c',
            block_number: '0x18',
            lock_hash: '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674',
          },
          id,
        },
      })
      const res = await rpc.indexLockHash(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'index_lock_hash',
        params: PARAMS,
      })
      expect(res).toEqual({
        blockHash: '0x8b5de4cad43e62fdc391d897b94a97d1af369bbe2b7cbe1de20d432da5a23f4c',
        blockNumber: '0x18',
        lockHash: '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674',
      })
    })

    it('deindex lock hash', async () => {
      const LOCK_HASH = '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674'
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: null,
          id,
        },
      })
      const res = await rpc.deindexLockHash(LOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'deindex_lock_hash',
        params: [LOCK_HASH],
      })
      expect(res).toBeNull()
    })

    it('get live cells by lock hash', async () => {
      const PARAMS = ['0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674', '0x0', '0x10', false]
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [
            {
              cell_output: {
                capacity: '0x12479d77059e',
                lock: {
                  args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
                  code_hash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
                  hash_type: 'type',
                },
                type: null,
              },
              cellbase: true,
              created_by: {
                block_number: '0x12',
                index: '0x0',
                tx_hash: '0xdda2f516ebfaf1d3ff5eecd65c78a22254127606339fec4a5328099ea0ddb7db',
              },
              output_data_len: '0x0',
            },
          ],
          id,
        },
      })
      const res = await rpc.getLiveCellsByLockHash(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_live_cells_by_lock_hash',
        params: PARAMS,
      })
      expect(res).toEqual([
        {
          cellOutput: {
            capacity: '0x12479d77059e',
            lock: {
              args: '0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6',
              codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
              hashType: 'type',
            },
            type: null,
          },
          cellbase: true,
          createdBy: {
            blockNumber: '0x12',
            index: '0x0',
            txHash: '0xdda2f516ebfaf1d3ff5eecd65c78a22254127606339fec4a5328099ea0ddb7db',
          },
          outputDataLen: '0x0',
        },
      ])
    })

    it('get lock hash index states', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [
            {
              block_hash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
              block_number: '0x8dd',
              lock_hash: '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674',
            },
          ],
          id,
        },
      })
      const res = await rpc.getLockHashIndexStates()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_lock_hash_index_states',
        params: [],
      })
      expect(res).toEqual([
        {
          blockHash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
          blockNumber: '0x8dd',
          lockHash: '0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674',
        },
      ])
    })

    it('get tranactions by lock hash', async () => {
      const PARAMS = ['0x0da2fe99fe549e082d4ed483c2e968a89ea8d11aabf5d79e5cbf06522de6e674', '0x0', '0x10', false]
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [
            {
              consumed_by: {
                block_number: '0x67c',
                index: '0x0',
                tx_hash: '0xfd9170c6a55095b7f878bfbddaa726446fa91414ec6fd61e8d5275451b91d854',
              },
              created_by: {
                block_number: '0xc',
                index: '0x0',
                tx_hash: '0x5b8184b27bad1238809300cb116ad85bdd2cc1ce0736d619c1468774cf27d4ce',
              },
            },
          ],
          id,
        },
      })
      const res = await rpc.getTransactionsByLockHash(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_transactions_by_lock_hash',
        params: PARAMS,
      })
      expect(res).toEqual([
        {
          consumedBy: {
            blockNumber: '0x67c',
            index: '0x0',
            txHash: '0xfd9170c6a55095b7f878bfbddaa726446fa91414ec6fd61e8d5275451b91d854',
          },
          createdBy: {
            blockNumber: '0xc',
            index: '0x0',
            txHash: '0x5b8184b27bad1238809300cb116ad85bdd2cc1ce0736d619c1468774cf27d4ce',
          },
        },
      ])
    })

    it('get banned addresses', async () => {
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: [],
          id,
        },
      })
      const res = await rpc.getBannedAddresses()
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_banned_addresses',
        params: [],
      })
      expect(res).toEqual([])
    })

    it('set address to be banned', async () => {
      const PARAMS = ['1.1.1.1', 'insert', null, true, 'No reason']
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: null,
          id,
        },
      })
      const res = await rpc.setBan(...PARAMS)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'set_ban',
        params: PARAMS,
      })
      expect(res).toBeNull()
    })

    it('get header', async () => {
      const BLOCK_HASH = '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4'
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            compact_target: '0x20010000',
            dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
            epoch: '0xa00090000e2',
            hash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
            nonce: '0x3388940124a1004051e37eb039a3dfeb',
            number: '0x8dd',
            parent_hash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
            proposals_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            timestamp: '0x172a8804ad1',
            transactions_root: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
            uncles_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            version: '0x0',
          },
          id,
        },
      })
      const res = await rpc.getHeader(BLOCK_HASH)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_header',
        params: [BLOCK_HASH],
      })
      expect(res).toEqual({
        compactTarget: '0x20010000',
        dao: '0xd6ec63f77d466d2fb394bcb565ac2300b14e9b080c222a0000418b05be0fff06',
        epoch: '0xa00090000e2',
        hash: '0x7c7f64c875b22807451620c9d1e9af460e851ffe82d85a90e1bccb1117e2e3a4',
        nonce: '0x3388940124a1004051e37eb039a3dfeb',
        number: '0x8dd',
        parentHash: '0xc4537bb867ef8103c221888f134b95078bb121c9cb2b654272e6730025304b7b',
        proposalsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '0x172a8804ad1',
        transactionsRoot: '0xcde937f363e195a97467061a45a6b5b318da02fc3fec5e76ab298e41ace0b7a1',
        unclesHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        version: '0x0',
      })
    })

    it('get header by number', async () => {
      const BLOCK_NUMBER = '0x1'
      axiosMock.mockResolvedValue({
        data: {
          jsonrpc: '2.0',
          result: {
            compact_target: '0x20010000',
            dao: '0x1d78d68e4363a12ee3e511f1fa862300f091bde0110f00000053322801fbfe06',
            epoch: '0xa0002000000',
            hash: '0xffd50ddb91a842234ff8f0871b941a739928c2f4a6b5cfc39de96a3f87c2413e',
            nonce: '0x4e51c6b50fd5a1af81c1d0c770a23c93',
            number: BLOCK_NUMBER,
            parent_hash: '0x4aa1bf4930b2fbcebf70bd0b6cc63a19ae8554d6c7e89a666433040300641db9',
            proposals_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            timestamp: '0x1725940cb91',
            transactions_root: '0xcd95e31e21734fb796de0070407c1d4f91ec00d699f840e5ad9aa293443744e6',
            uncles_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
            version: '0x0',
          },
          id,
        },
      })
      const res = await rpc.getHeaderByNumber(BLOCK_NUMBER)
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'get_header_by_number',
        params: [BLOCK_NUMBER],
      })
      expect(res).toEqual({
        compactTarget: '0x20010000',
        dao: '0x1d78d68e4363a12ee3e511f1fa862300f091bde0110f00000053322801fbfe06',
        epoch: '0xa0002000000',
        hash: '0xffd50ddb91a842234ff8f0871b941a739928c2f4a6b5cfc39de96a3f87c2413e',
        nonce: '0x4e51c6b50fd5a1af81c1d0c770a23c93',
        number: BLOCK_NUMBER,
        parentHash: '0x4aa1bf4930b2fbcebf70bd0b6cc63a19ae8554d6c7e89a666433040300641db9',
        proposalsHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '0x1725940cb91',
        transactionsRoot: '0xcd95e31e21734fb796de0070407c1d4f91ec00d699f840e5ad9aa293443744e6',
        unclesHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        version: '0x0',
      })
    })

    it.skip('estimate fee rate', async () => {
      const res = await rpc.estimateFeeRate('0x11')
      expect(res).toBeTruthy()
    })

    it('send transaction', async () => {
      const tx = {
        cellDeps: [
          {
            outPoint: {
              txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              index: '0x1',
            },
            depType: 'code',
          },
        ],
        headerDeps: [],
        inputs: [
          {
            previousOutput: {
              txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
              index: '0x0',
            },
            since: '0x0',
          },
        ],
        outputs: [
          {
            capacity: '0x48c27395000',
            lock: {
              args: [],
              codeHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
              hashType: 'data',
            },
            type: null,
          },
        ],
        version: '0x0',
        outputsData: ['0x'],
        witnesses: [],
      }
      axiosMock.mockResolvedValue({
        data: {
          id,
          jsonrpc: '2.0',
          result: '0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3',
        },
      })
      const res = await rpc.sendTransaction(tx, 'passthrough')
      expect(axiosMock.mock.calls[0][0].data).toEqual({
        id,
        jsonrpc: '2.0',
        method: 'send_transaction',

        params: [
          {
            cell_deps: [
              {
                out_point: {
                  tx_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  index: '0x1',
                },
                dep_type: 'code',
              },
            ],
            header_deps: [],
            inputs: [
              {
                previous_output: {
                  tx_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
                  index: '0x0',
                },
                since: '0x0',
              },
            ],
            outputs: [
              {
                capacity: '0x48c27395000',
                lock: {
                  args: [],
                  code_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
                  hash_type: 'data',
                },
                type: null,
              },
            ],
            version: '0x0',
            outputs_data: ['0x'],
            witnesses: [],
          },
          'passthrough',
        ],
      })
      expect(res).toEqual('0xa0ef4eb5f4ceeb08a4c8524d84c5da95dce2f608e0ca2ec8091191b0f330c6e3')
    })
  })

  describe('ckb-rpc errors', () => {
    it('throw raw error', async () => {
      expect(() => rpc.getBlock(0)).toThrow('Hash 0 should be type of string')
    })
  })
})
