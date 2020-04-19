import { IBitReader, IBitWriter } from './ibitstream';
import { BitReader } from './bitreader';
import { BitWriter } from './bitwriter';
import { IDataSource } from './idatasource';
import { Endian } from '../endian';
import { TypedArray } from '../types';

export class BitStream implements IBitReader, IBitWriter {
  private reader: BitReader;
  private writer: BitWriter;

  constructor(data?: TypedArray) {
    this.writer = new BitWriter();
    this.reader = new BitReader();

    this.setData(data);
  }

  getData(): TypedArray {
    return this.reader.getData();
  }

  setData(data?: TypedArray): void {
    this.writer.setData(data);
    this.reader.setSource(this.writer.getSource());
  }

  getSource(): IDataSource {
    return this.reader.getSource();
  }

  setSource(source: IDataSource): void {
    this.writer.setSource(source);
    this.reader.setSource(this.writer.getSource());
  }

  getBitOrder(): Endian {
    return this.reader.getBitOrder();
  }

  setBitOrder(value: Endian): void {
    this.writer.setBitOrder(value);
    this.reader.setBitOrder(value);
  }

  getPosition(): number {
    return this.reader.getPosition();
  }

  setPosition(value: number): void {
    this.writer.setPosition(value);
    this.reader.setPosition(value);
  }

  getBytePosition(): number {
    return this.reader.getBytePosition();
  }

  getFrameSize(): number {
    return this.reader.getFrameSize();
  }

  write(value: number, bitCount: number): void {
    this.writer.write(value, bitCount);
    this.reader.setPosition(this.writer.getPosition());
  }

  writeData(value: TypedArray, bitStart?: number, bitCount?: number): void {
    this.writer.writeData(value, bitStart, bitCount);
    this.reader.setPosition(this.writer.getPosition());
  }

  read(bitCount: number): number {
    const value = this.reader.read(bitCount);
    this.writer.setPosition(this.reader.getPosition());
    return value;
  }
}
