export const reverseBitOrder = (value: number, length: number): number => {
  let pos = 0;
  let result = 0;

  while (pos < length) {
    result = ((result << 1) | ((value >> pos++) & 1)) >>> 0;
  }

  return result;
};
