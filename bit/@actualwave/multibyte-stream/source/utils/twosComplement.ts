import { getPositionBit } from './getPositionBit';
import { getMaskOfLength } from './getMaskOfLength';

// https://en.wikipedia.org/wiki/Two%27s_complement#Converting_from_two's_complement_representation

/*
  Returns uint with identical bit values to int in two's complement representation
*/
export const toTwosComplementRepresentation = (value: number, length: number) =>
  (value >>> 0) & getMaskOfLength(length);

/*
  Reads uint as int in two's complement representation
*/
export const fromTwosComplementRepresentation = (
  value: number,
  length: number
) => {
  // checking for most negative number
  if (getPositionBit(length) === value) {
    return -value;
  }

  const valueLength = length - 1;
  const mask = getMaskOfLength(valueLength);
  const sign = (value >>> valueLength) & 0b1;

  if (sign) {
    return -(((value & mask) - 1) ^ mask);
  }

  return value & mask;
};

/*
  Returns Two's Complement to passed value. Since negative integers are already in this form,
  we have almost nothing to do here.
*/
export const getTwosComplementOf = (value: number, length: number) => {
  const val = value < 0 ? -value : value;
  const mask = getMaskOfLength(length);

  return (((val ^ mask) + 1) >>> 0) & mask;
};
