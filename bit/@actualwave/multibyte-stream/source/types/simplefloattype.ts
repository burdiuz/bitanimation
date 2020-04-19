import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';
import { IntType } from './int';

export class SimpleFloatType extends IntType {
  static readonly type = 'sfloat';

  private multiplier: number;

  constructor(signed = true, private fractionDigits = 3, size = 0) {
    super(signed, size);

    this.multiplier = Math.pow(10, this.fractionDigits);
  }

  writeTo(writer: IBitWriter, value: number): void {
    super.writeTo(writer, (value * this.multiplier) | 0);
  }

  readFrom(reader: IBitReader): number {
    const value = super.readFrom(reader);

    return value / this.multiplier;
  }

  toObject(): ITypeData {
    const { signed, fractionDigits, size } = this;
    return { type: SimpleFloatType.type, signed, fractionDigits, size };
  }

  static getInstance(
    signed?: boolean,
    fractionDigits?: number,
    size?: number
  ): IType {
    return new SimpleFloatType(signed, fractionDigits, size);
  }

  static getTypeKeys(): Array<string | Function> {
    return [SimpleFloatType.type, SimpleFloatType];
  }

  static fromObject(data: ITypeData): SimpleFloatType {
    const { signed, fractionDigits, size } = data;
    const instance = new SimpleFloatType(
      signed as boolean,
      fractionDigits as number,
      size as number
    );

    return instance;
  }
}
