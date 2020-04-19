import { BigIntType } from './bigint';
import { StringType } from './string';
import {
  IntType,
  ShortType,
  ByteType,
  UIntType,
  UShortType,
  UByteType,
} from './int';
import { SimpleFloatType } from './simplefloattype';
import { ObjectType } from './object';
import { ArrayType } from './array';
import { BoolType } from './bool';
import { EnumType } from './enum';
export * from './registry';
import { addTypeDefinition } from './registry';

addTypeDefinition(BoolType);
addTypeDefinition(
  IntType,
  ShortType,
  ByteType,
  UIntType,
  UShortType,
  UByteType
);
addTypeDefinition(SimpleFloatType);
addTypeDefinition(BigIntType);
addTypeDefinition(StringType);
addTypeDefinition(ObjectType);
addTypeDefinition(ArrayType);

export const types = {
  BigIntType,
  StringType,
  IntType,
  ShortType,
  ByteType,
  UIntType,
  UShortType,
  UByteType,
  SimpleFloatType,
  EnumType,
  ObjectType,
  ArrayType,
  BoolType,
};
