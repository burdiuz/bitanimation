import { getMaskOfLength, getBigIntMaskOfLength } from './getMaskOfLength';

export const getSliceOf = (value: number, position: number, size: number) =>
  (value >> position) & getMaskOfLength(size);

export const getPartFrom = (
  value: number,
  size: number,
  position: number = 0
) => getSliceOf(value, position * size, size);

export const getByteFrom = (value: number, position: number = 0) =>
  getSliceOf(value, position * 8, 8);

export const toSlices = (value: number, ...sizes: number[]) => {
  let position = 0;

  return sizes.map((size: number) => {
    const slice = getSliceOf(value, position, size);
    position += size;

    return slice;
  });
};

export const getBigIntSliceOf = (value: bigint, position: bigint, size: bigint) =>
  (value >> position) & getBigIntMaskOfLength(size);
