import { writeShortLength, readShortLength } from '../utils/lengths';
import { TypeRegistry, defaultTypeRegistry } from './registry';
import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';
import { IntType } from './int';

/*
3 bits -- size of length block
4 - 16 bits -- array length
... -- array elements

const stream = new BitStream();
const arr = new ArrayType();

arr.writeTo(stream, [77, 888, 9999, 10000, 76543, 2345678]);
stream.setPosition(0);
console.log(arr.readFrom(stream));
console.log(stream.getSource().toString());
*/
export class ArrayType implements IType {
  static readonly type = 'array';
  protected registry: TypeRegistry;
  public elementType: IType;

  constructor(
    elementType: IType = IntType.getInstance(),
    registry: TypeRegistry = defaultTypeRegistry
  ) {
    this.elementType = elementType;
    this.registry = registry;
  }

  writeTo(writer: IBitWriter, value: Array<any>): void {
    const { length } = value;

    writeShortLength(writer, length);

    for (let index = 0; index < length; index++) {
      this.elementType.writeTo(writer, value[index]);
    }
  }

  readFrom(reader: IBitReader): Array<any> {
    const array = [];

    const length = readShortLength(reader);

    for (let index = 0; index < length; index++) {
      array.push(this.elementType.readFrom(reader));
    }

    return array;
  }

  toObject(): ITypeData {
    return {
      type: ArrayType.type,
      elementsOfType: this.elementType.toObject(),
    };
  }

  static getInstance(
    elementType: IType,
    registry: TypeRegistry = defaultTypeRegistry
  ): IType {
    return new ArrayType(elementType, registry);
  }

  static getTypeKeys(): Array<string | Function> {
    return [ArrayType.type, Array, ArrayType];
  }

  static fromObject(
    data: ITypeData,
    registry: TypeRegistry = defaultTypeRegistry
  ): ArrayType {
    const { elementsOfType } = data;
    const instance = new ArrayType(
      registry.fromObject(elementsOfType as ITypeData),
      registry
    );

    return instance;
  }
}
