export * from './stream/bitstream';
export * from './stream/bitreader';
export * from './stream/bitwriter';
export * from './types/index';
export * from './schema/schema';

/*
import { BitStream } from './stream/bitstream';
import { IntType } from './types/int';
import { SimpleFloatType } from './types/simplefloattype';
import { ObjectType } from './types/object';
import { ArrayType } from './types/array';
import { BoolType } from './types/bool';
import { StringType } from './types/string';
import { BigIntType } from './types/bigint';
import { readSchemaFrom, Schema } from './schema/schema';
import { EnumType } from './types/enum';

/*
 ======= debug
//* /
declare const window: any;

window.exports = {};
window.stream = new BitStream();
window.int = new IntType();
window.sfloat = new SimpleFloatType();
window.bool = new BoolType();
window.obj = new ObjectType();
window.enum = new EnumType();
window.arr = new ArrayType();
window.big = new BigIntType();
window.str = new StringType();

/*
window.sfloat.writeTo(window.stream, 123.456);
window.stream.setPosition(0);
console.log(window.sfloat.readFrom(window.stream));
//* /

const X = 1;
const _ = 0;
const config = {
  frames: [
    [
      [_, X, _, X, _, X],
      [X, _, X, _, X, _],
    ],
    [
      [X, _, X, _, X, _],
      [_, X, _, X, _, X],
    ],
  ],
};

const schema = new Schema(
  ObjectType.getInstance({
    frames: new ArrayType(new ArrayType(new ArrayType(new IntType(false, 1)))),
  })
);

const data = schema.saveBase64From(config);
console.log(data);
console.log(schema.loadBase64To(data));
*/
