import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
1 bit -- value
*/
export class BoolType implements IType {
  static readonly type = 'bool';

  writeTo(writer: IBitWriter, value: boolean): void {
    writer.write(value ? 1 : 0, 1);
  }
  readFrom(reader: IBitReader): boolean {
    return reader.read(1) === 1;
  }

  toObject(): ITypeData {
    return { type: BoolType.type };
  }

  static getTypeKeys(): Array<string | Function> {
    return [BoolType.type, Boolean, BoolType];
  }

  static getInstance(): IType {
    return new BoolType();
  }

  static fromObject(): BoolType {
    return new BoolType();
  }
}
