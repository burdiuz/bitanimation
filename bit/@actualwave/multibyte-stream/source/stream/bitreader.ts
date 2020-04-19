import { getMaskOfLength } from '../utils/getMaskOfLength';
import { BaseBitRW } from './basebitrw';
import { IDataSource } from './idatasource';
import { DataSource } from './datasource';
import { Endian } from '../endian';
import { reverseBitOrder } from '../utils/reverseBitOrder';
import { TypedArray } from '../types';
import { IBitReader } from './ibitstream';

export class BitReader extends BaseBitRW implements IBitReader {
  setData(data: TypedArray): void {
    this.source = new DataSource(data);
  }

  setSource(source: IDataSource): void {
    this.source = source;
  }

  read(size: number) {
    const frameSize = this.getFrameSize();

    let value = 0;
    let leftSize = size;
    let leftSpace = frameSize - this.framePosition;

    while (leftSize > 0) {
      let shiftSize = leftSize;

      if (shiftSize > leftSpace) {
        shiftSize = leftSpace;
      }

      let currentFrame = this.source.getCurrentFrame();

      value =
        (value << shiftSize) |
        ((currentFrame >> (leftSpace - shiftSize)) &
          getMaskOfLength(shiftSize));

      leftSpace -= shiftSize;
      leftSize -= shiftSize;

      if (!leftSpace) {
        this.source.nextFrame();
        leftSpace = frameSize;
      }
    }

    if (this.endian === Endian.LITTLE) {
      value = reverseBitOrder(value, size);
    }

    this.framePosition = frameSize - leftSpace;

    return value;
  }

  readBit() {
    return this.read(1);
  }

  readUByte() {
    return this.read(8);
  }

  readUShort() {
    return this.read(16);
  }

  readUInt() {
    return this.read(32);
  }
}
