export default {
  toHash: (hash: string): string => hash,
  toOutPoint: (outPoint: string): any => outPoint,
  toNumber: (number: string | number): number => +number,
  toTx: (): // tx: CkbComponents.ITransaction
  any => ({
    version: 1,
    deps: [],
    inputs: [
      {
        prevOutput: {
          hash:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          index: 0,
        },
        unlock: {
          version: 0,
          args: [],
          binary: Uint8Array.from([109, 105, 110, 101, 114]), // "miner".into_bytes
        },
      },
    ],
    outputs: [
      {
        capacity: 0,
        data: Uint8Array.from([0]),
        lock:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
  }),
}
