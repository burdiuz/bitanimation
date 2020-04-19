import { getBitCount } from './../utils/getBitCount';
import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

/*
 Enumeration type receives an array of values and saves to stream an index of the value.
 To properly read/write values to stream, array must be the same at all times.
*/
export class EnumType implements IType {
  static readonly type = 'enum';
  private size: number;

  constructor(private values: Array<any> = []) {
    this.size = getBitCount(this.values.length);
  }

  writeTo(writer: IBitWriter, value: any): void {
    const index = this.values.findIndex((item) => item === value);

    if (index < 0) {
      throw new Error(`Value "${value}" is not part of enumeration.`);
    }

    writer.write(index, this.size);
  }

  readFrom(reader: IBitReader): any {
    return this.values[reader.read(this.size)];
  }

  toObject(): ITypeData {
    return { type: EnumType.type, values: this.values };
  }

  static getTypeKeys(): Array<string | Function> {
    return [EnumType.type, EnumType];
  }

  static getInstance(values: Array<any>): IType {
    return new EnumType(values);
  }

  static fromObject({ values }: ITypeData & { values: Array<any> }): EnumType {
    return new EnumType(values as Array<any>);
  }
}
