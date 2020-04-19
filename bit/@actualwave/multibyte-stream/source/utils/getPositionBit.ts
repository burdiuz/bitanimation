export const MAX_POW_INDEX = 31;

export const POWS = ((index: number) => {
  const list = [];

  while (index >= 0) {
    list[index] = (1 << index) >>> 0;
    index--;
  }

  return list;
})(MAX_POW_INDEX);

export const getPositionBit = (index: number) => POWS[index];

export const getBigIntPositionBit = (index: bigint) => 1n << index;
