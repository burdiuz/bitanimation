import { BitReader } from '../bitreader';
import { Endian } from '../../endian';

describe('BitReader', () => {
  let reader: BitReader;

  beforeEach(() => {
    reader = new BitReader();
  });

  describe('When changing endianess', () => {
    beforeEach(() => {
      reader.setData(
        Uint8Array.from([
          0b01010101,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00011000,
          0b00000000,
          0b00000000,
          0b00000000,
          0b00000000,
        ])
      );
    });

    fit('should properly read data between frames', () => {
      expect(reader.read(4)).toBe(0b0101);
      reader.setBitOrder(Endian.LITTLE);
      expect(reader.read(8)).toBe(0b1010);
      reader.setBitOrder(Endian.BIG);
      expect(reader.read(32)).toBe(1);
      reader.setBitOrder(Endian.LITTLE);
      expect(reader.read(32)).toBe(1);
    });
  });
});
