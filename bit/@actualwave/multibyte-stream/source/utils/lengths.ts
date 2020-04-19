import { getBitCount } from './getBitCount';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

export const readLength = (
  reader: IBitReader,
  blocks: number,
  multiplierShift: number = 2
) => {
  const length = (reader.read(blocks) + 1) << multiplierShift;

  return reader.read(length);
};

export const writeLength = (
  writer: IBitWriter,
  value: number,
  blocks: number,
  multiplierShift: number = 2
) => {
  const length = getBitCount(value) >> multiplierShift;

  writer.write(length, blocks);
  writer.write(value, (length + 1) << multiplierShift);
};

export const readShortLength = (reader: IBitReader) => readLength(reader, 2);

export const writeShortLength = (writer: IBitWriter, value: number) =>
  writeLength(writer, value, 2);

export const readUIntLength = (reader: IBitReader) => readLength(reader, 3);

export const writeUIntLength = (writer: IBitWriter, value: number) =>
  writeLength(writer, value, 3);

export const readBigIntLength = (reader: IBitReader) =>
  readLength(reader, 3, 4);

export const writeBigIntLength = (writer: IBitWriter, value: number) =>
  writeLength(writer, value, 3, 4);
