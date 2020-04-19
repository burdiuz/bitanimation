import { IDataSource } from './idatasource';
import { Endian } from '../endian';
import { TypedArray } from '../types';

export interface IBaseBitRW {
  getData(): TypedArray;
  setData(data: TypedArray): void;
  getSource(): IDataSource;
  setSource(source: IDataSource): void;

  getBitOrder(): Endian;
  setBitOrder(value: Endian): void;

  getPosition(): number;
  setPosition(value: number): void;
  getBytePosition(): number;
  getFrameSize(): number;
}

export interface IBitWriter extends IBaseBitRW {
  write(value: number, bitCount: number): void;
  writeData(value: TypedArray, bitStart?:number, bitCount?: number): void;
}

export interface IBitReader extends IBaseBitRW {
  read(bitCount: number): number;
}

export interface IBitStream extends IBitReader, IBitWriter {}
