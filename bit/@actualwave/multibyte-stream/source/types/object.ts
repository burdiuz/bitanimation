import { readObjectFieldTypes } from '../schema/readobjectfieldtypes';
import { TypeRegistry, defaultTypeRegistry } from './registry';
import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';

export type Obj = { [key: string]: any };

/*
const stream = new BitStream();
const obj = new ObjectType();
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

obj.writeTo(stream, data);
stream.setPosition(0);
console.log(obj.readFrom(stream));
*/
export class ObjectType implements IType {
  static readonly type = 'object';
  private registry: TypeRegistry;
  private fields: { [key: string]: IType };
  private fieldList: Array<string>;

  constructor(registry: TypeRegistry = defaultTypeRegistry) {
    this.registry = registry;
  }

  setSchemaFrom(obj: Obj) {
    this.setSchema(readObjectFieldTypes(obj, this.registry));
  }

  appendSchemaFrom(obj: Obj) {
    this.setSchema(readObjectFieldTypes(obj, this.registry, this.fields));
  }

  setSchema(fields: { [key: string]: IType }) {
    this.fields = fields;
    this.fieldList = Object.keys(fields);
    this.fieldList.sort();
  }

  getSchema() {
    return this.fields;
  }

  writeTo(writer: IBitWriter, obj: Obj): void {
    if (!this.fields) {
      this.setSchemaFrom(obj);
    }

    const { fieldList: list, fields } = this;

    list.forEach((key) => {
      const type = fields[key];

      type.writeTo(writer, obj[key]);
    });
  }

  readFrom(reader: IBitReader): Obj {
    if (!this.fields) {
      throw new Error(
        'Object data could not be read since its schema is undefined.'
      );
    }

    const { fieldList: list, fields } = this;
    const target = {};

    list.forEach((key) => {
      const type = fields[key];

      target[key] = type.readFrom(reader);
    });

    return target;
  }

  toObject(): ITypeData {
    const fields = {};

    Object.keys(this.fields).forEach((key) => {
      const type = this.fields[key];

      fields[key] = type.toObject();
    });

    return { type: ObjectType.type, fields };
  }

  static getInstanceFrom(
    obj?: Obj,
    registry = defaultTypeRegistry
  ): ObjectType {
    const type = new ObjectType(registry);

    if (obj) {
      type.setSchemaFrom(obj);
    }

    return type;
  }

  static getInstance(
    schema?: { [key: string]: IType },
    registry = defaultTypeRegistry
  ): ObjectType {
    const type = new ObjectType(registry);

    if (schema) {
      type.setSchema(schema);
    }

    return type;
  }

  static getTypeKeys(): Array<string | Function> {
    return [ObjectType.type, Object, ObjectType];
  }

  static fromObject(
    data: ITypeData,
    registry = defaultTypeRegistry
  ): ObjectType {
    const { fields } = data;

    const instance = new ObjectType(registry);
    const schema = {};

    Object.keys(fields).forEach((key) => {
      const typeData = fields[key];

      schema[key] = registry.fromObject(typeData);
    });

    instance.setSchema(schema);

    return instance;
  }
}
