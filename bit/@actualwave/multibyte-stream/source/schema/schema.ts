import { setDataSourceLength } from '../stream/datasource';
import { TypedArray } from '../types';
import { defaultTypeRegistry } from '../types/registry';
import { ObjectType, Obj } from '../types/object';
import { BitStream } from '../stream/bitstream';
import { ITypeData } from '../types/itype';

export const readSchemaFrom = (value: Obj, registry = defaultTypeRegistry) => {
  const obj = new ObjectType(registry);
  obj.setSchemaFrom(value);

  return new Schema(obj);
};

/*
const data = {
  bool: false,
  num: 777,
  big: 555555555555555555555555555555555n,
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  obj: {
    one: true,
    two: false,
    three: true,
    num: 8765,
  },
};

const schema: Schema = readSchemaFrom(data);
console.log(schema.saveBase64From(data));
console.log(schema.toObject());
*/
export class Schema {
  private type: ObjectType;

  constructor(obj: ObjectType) {
    this.type = obj;
  }

  loadDataTo(value: TypedArray, target?: Obj): Obj {
    const stream = new BitStream(value);

    const values = this.type.readFrom(stream);

    return target ? Object.assign(target, values) : values;
  }

  saveDataFrom(source: Obj): TypedArray {
    const stream = new BitStream();

    this.type.writeTo(stream, source);

    const data: TypedArray = stream.getData();

    return setDataSourceLength(
      data,
      Math.ceil(stream.getBytePosition() / data.BYTES_PER_ELEMENT)
    );
  }

  loadBase64To(str: string, target?: Obj): Obj {
    const data = Uint8Array.from(
      atob(str)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    return this.loadDataTo(data, target);
  }

  saveBase64From(source: Obj): string {
    const data: TypedArray = this.saveDataFrom(source);

    return btoa(String.fromCharCode(...data));
  }

  toObject(): ITypeData {
    return this.type.toObject();
  }

  static fromObject(data: ITypeData, registry = defaultTypeRegistry) {
    return new Schema(ObjectType.fromObject(data, registry));
  }
}
