const formatter = {
  toHash: (hash: string): string => hash,
  toOutPoint: (outPoint: string): any => outPoint,
  toNumber: (number: string | number): number => +number,
}
export default formatter
