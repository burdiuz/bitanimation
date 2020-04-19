import { getMaskOfLength } from "./getMaskOfLength";

/*
  Returns uint with identical bit values.
*/
export const toOnesComplementRepresentation = (value:number, length:number) => {
  const valueLength = length - 1;
  const mask = getMaskOfLength(valueLength);

  if (value >= 0) {
    return value & mask;
  }

  return (-value & mask) | (1 << valueLength);
};

export const fromOnesComplementRepresentation = (value:number, length:number) => {
  const valueLength = length - 1;
  const mask = getMaskOfLength(valueLength);
  const sign = (value >>> valueLength) & 0b1;

  if (sign) {
    return -(value & mask);
  }

  return value & mask;
};
