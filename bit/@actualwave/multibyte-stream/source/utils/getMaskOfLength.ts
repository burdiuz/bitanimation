export const MASK_MAX_INDEX = 32;

export const MASKS = ((index: number) => {
  const list = [0];

  while (index > 0) {
    list[index] = Math.pow(2, index) - 1;
    index--;
  }

  return list;
})(MASK_MAX_INDEX);

export const MAX_MASK = MASKS[MASK_MAX_INDEX];

export const getMaskOfLength = (length: number) => MASKS[length];

export const getBigIntMaskOfLength = (length: bigint) =>
  2n ** length - 1n;
