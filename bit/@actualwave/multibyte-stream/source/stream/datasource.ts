import { IDataSource } from './idatasource';
import { TypedArray } from '../types';

export const setDataSourceLength = (
  source: TypedArray,
  length: number
): TypedArray => {
  if (length < source.length) {
    return source.slice(0, length);
  }

  const { constructor: ArrayDef } = Object.getPrototypeOf(source);
  const values = new ArrayDef(length);
  values.set(source);

  return values;
};

export class DataSource implements IDataSource {
  protected source: TypedArray;
  protected position: number = 0;
  constructor(source: TypedArray = new Uint8Array(0xff)) {
    this.source = source;
  }

  getPosition() {
    return this.position;
  }

  setPosition(value: number) {
    this.position = value;
  }

  getFrameSize() {
    return this.source.BYTES_PER_ELEMENT << 3;
  }

  getCurrentFrame() {
    return this.getFrame(this.position);
  }

  setCurrentFrame(value: number) {
    this.setFrame(value, this.position);
  }

  nextFrame() {
    this.setPosition(this.isLastFrame() ? 0 : this.position + 1);
  }

  previousFrame() {
    this.setPosition(this.position > 0 ? this.position - 1 : 0);
  }

  isLastFrame() {
    return this.position === this.source.length - 1;
  }

  getFrame(index: number) {
    return this.source[index];
  }

  setFrame(value: number, index: number) {
    this.source[index] = value;
  }

  getLength() {
    return this.source.length;
  }

  setLength(length: number) {
    this.source = setDataSourceLength(this.source, length);
  }

  getSource() {
    return this.source;
  }

  toString(start = 0, length = this.source.length - start) {
    let str = '';

    for (let index = 0; index < length; index++) {
      const item = this.source[index] >>> 0;
      const frame = item.toString(2).padStart(this.getFrameSize(), '0');

      str = `${str} ${frame}`;
    }

    return str.trim();
  }
}

export class DynamicDataSource extends DataSource {
  constructor(source?: TypedArray) {
    super(source);
    this.validateLength();
  }

  setPosition(value: number) {
    super.setPosition(value);
    this.validateLength();
  }

  validateLength() {
    const {
      position,
      source: { length },
    } = this;

    if (position >= length - 1) {
      this.setLength(Math.ceil(Math.max(length, position, 1) << 1));
    }
  }
}
