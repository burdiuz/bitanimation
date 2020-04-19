import { getBigIntBitCount } from '../utils/getBitCount';
import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
Currently BigInt is limited to 128 bits, but BigInts could be of any size, 256, 512.
TODO Make most significant bit to signal about normal or extended mode.
     normal mode -- 128 bit
     extended bit -- 1024 bit

BigInt is recorded using one's complement.
*/
export class BigIntType implements IType {
  static readonly type = 'bigint';

  writeTo(writer: IBitWriter, value: bigint): void {
    const size = getBigIntBitCount(value) + 1;
    const length = Math.ceil(size / 8 || 1) - 1;
    const negative = value < 0n;

    writer.write(length, 4);

    if (negative) {
      value = -value;
    }

    for (let index = 0; index <= length; index++) {
      const part = Number((value >> BigInt((length - index) << 3)) & 255n);

      writer.write(!index && negative ? part | (1 << 7) : part, 8);
    }
  }

  readFrom(reader: IBitReader): bigint {
    const length = reader.read(4);
    let chunk = reader.read(8);
    let value = BigInt(chunk & 0b1111111);
    const negative = !!(chunk >> 7);

    for (let index = 1; index <= length; index++) {
      value = (value << 8n) | BigInt(reader.read(8));
    }

    return negative ? -value : value;
  }

  toObject(): ITypeData {
    return { type: BigIntType.type };
  }

  static getInstance(): BigIntType {
    return new BigIntType();
  }

  static getTypeKeys(): Array<string | Function> {
    return [BigIntType.type, BigInt, BigIntType];
  }

  static fromObject(): BigIntType {
    return new BigIntType();
  }
}
