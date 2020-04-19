# @actualwave/multibyte-stream
This library allows to write and read data between bytes. It allows to store booleans using single bit to store integers using less than a byte and so on.

## Motivation
I wanted a data format that minifies payload to smallest size, so I could save or transfer more data within a limit. To make such compact data format I decided to cut everything that should not be saved/transferred, so this library only saves the values ignoring anything about data structure and field names.
Let's look at this object:
```javascript
const data = {
  number: 1234,
  boolean: true,
  string: "Hello",
};
```
When encoded into JSON, it keeps data structure
```json
{"number":1234,"boolean":true,"string":"Hello"}
```
If we encode it into URL variables, it will loook like
```
number=1234&boolean=true&string=Hello
```
But if we cut all the structure and leave only values, it should be
```
1234trueHello
```
Now it's shortest, but then, look at it's number and boolean values in binary format(strings are more complicated to compact and usually they keep most of the occupied space).
```
00000100 11010010 -- 1234 takes at least 2 bytes
00000001 -- true takes at least one byte
```
12 bits left unused and still occupied. But we could compact it even more by placing them in-between bytes
```
10011010010 1 -- 1234 and true combined in 12 bits. 4 bits are still free and could be used for another value
```

Such compact data format would allow, for example, to store more data in places like URL in form of Base64-encoded string. Like `DBQSEruPv7WFY2VAYKQ+ysKDB7vn06Onu56DT9K4gnJw+XWA` string contains an object with numbers, booleans, array and nested object, and it could be stored in URL `htts://mydomain.com/?DBQSEruPv7WFY2VAYKQ%2BysKDB7vn06Onu56DT9K4gnJw%2BXWA`.
```javascript
// config data to save
const config = {
  fields: ['name', 'address', 'email'],
  sortBy: {
    field: 'address',
    order: 'asc',
  },
  filterBy: [
    { field: 'email', value: '.com' },
    { field: 'date', value: '12' },
  ],
  page: 40,
  query: '20 Anything St.',
  panels: ['top-bar', 'bottom-bar', 'side-bar'],
  theme: 'dark',
};

// prepare enumerations
const fieldType = EnumType.getInstance(['name', 'address', 'email', 'date']);
const orderType = EnumType.getInstance(['asc', 'desc']);
const panelType = EnumType.getInstance(['top-bar', 'bottom-bar', 'side-bar']);

// create config schema
const configType = ObjectType.getInstance({
  fields: ArrayType.getInstance(fieldType),
  sortBy: ObjectType.getInstance({
    field: fieldType,
    order: orderType,
  }),
  filterBy: ArrayType.getInstance(
    ObjectType.getInstance({
      field: fieldType,
      value: StringType.getInstance(),
    })
  ),
  page: IntType.getInstance(false, 6),
  query: StringType.getInstance(),
  panels: ArrayType.getInstance(panelType),
  theme: StringType.getInstance(),
});

const schema = new Schema(configType);

// save config values into Base64 string
const values = schema.saveBase64From(config);
console.log(values); // DBQSEruPv7WFY2VAYKQ+ysKDB7vn06Onu56DT9K4gnJw+XWA
```
This allows to persist more insignificant data on client's side without the need to save it on server. Such Base64 string could then be loaded using same schema.
```javascript
const loadedConfig = schema.loadBase64To('DBQSEruPv7WFY2VAYKQ+ysKDB7vn06Onu56DT9K4gnJw+XWA');
console.log(loadedConfig);
/*
{
  "fields": [
    "name",
    "address",
    "email"
  ],
  "filterBy": [
    {
      "field": "email",
      "value": ".com"
    },
    {
      "field": "date",
      "value": "12"
    }
  ],
  "page": 40,
  "panels": [
    "top-bar",
    "bottom-bar",
    "side-bar"
  ],
  "query": "20 Anything St.",
  "sortBy": {
    "field": "address",
    "order": "asc"
  },
  "theme": "dark"
}
*/
```
> Note that schema must be exactly the same. Since values are stored as a stream it is crucial to provide exactly same schema to be able to restore data.

It may also help to communicate with server or any other party. For example, some years ago communication between client and server looked like
```
- let's request something from server
- pray
- not disconnected, great
- it returns timestamps as strings, ok
- response misses some fields, ok
- response has more fields than we expected, ok
- everything received exactly as expected, impossible?
```
These days communication is usually stricter and reads like
```
- let's request something from server
- wait
- not disconnected, why so long
- it returns timestamps as strings, failure
- response misses some fields, failure
- response has more fields than we expected, failure
- everything received exactly as expected, finally, we may proceed
```
All parties that work with data know it's structure and field types, so why to pass it? Let's just communicate values and apply them to structures we already know. This means structures must be equal across all parties that work with data, but usually it is already like that.

## Usage
There are multiple ways how this package could be used -- via BitStream, Data Types or Schema.

### BitStream

Simplest way to use this package is to directly create BitStream to read or write data. BitStream contains BitReader and BitWriter, each of them could be used on their own to read or write data to [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)s.

```javascript
const stream = new BitStream();

// write data
stream.write(15, 4); // record value 15 using 4 bits
stream.write(100, 8); // record value 100 using 8 bits

// reset position
stream.setPosition(0);

// read data
console.log(stream.read(4)); // read 4 bits value, returns 15
console.log(stream.read(8)); // read 8 bits value, returns 100
```

BitStream allows to write only unsigned integer values.

You could also use BitReader or BitWriter separately.
BitWriter accepts TypedArray as a data source or constructs new Uint8Array(255 bytes) if nothing passed to setData(). BitWriter will expand TypedArray if it's position goes beyond array's capacity, so data length could be retrieved by current writing position or stored separately.

```javascript
const writer = new BitWriter();

// set default TypedArray
writer.setData();

// write some data
writer.write(1, 1);
writer.write(0, 1);
writer.write(0, 1);
writer.write(15, 4);
writer.write(100, 8);

// retrieve data
console.log(
  Array.from(writer.getData().slice(0, 2))
    .map((value) => value.toString(2).padStart(8, '0'))
    .join(' ')
);
/*
  this will show in console 10011110 11001000, the values are 1, 0, 0, 1111, 01100100
*/
```

BitReader code example:
```javascript
const reader = new BitReader();

// set data
reader.setData(Uint8Array.from([0b10011110, 0b11001000]));

// read values
reader.read(1); // 1
reader.read(1); // 0
reader.read(1); // 0
reader.read(4); // 15
reader.read(8); // 100
```

### Data Types
Data Types are classes that help to read and write data of specific types. Currently I've implemented these types
 - **BoolType** uses one bit to record value.
 - **IntType** saves real numbers. Can be customized to save number sign, use [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) for negative numbers and to use variable or specific size. Additionaly provided derived classes to record integers  with specific size -- ShortType, ByteType, UIntType, UShortType, UByteType.
 - **SimpleFloatType** is derived from InType. It simply multiples float to preserve specified accuracy and transforms into integer. Accuracy could be specified by passing value to constructor, by default it's 3 symbols after comma.
 - **StringType** writes strings using variable byte length for each character. most significant bit used to determine if new character starts(1) or current continues(0).
 - **ObjectType** records values of object fields to stream. It should be provided with object schema or can read object schema from populated object(properties with default values to read data types from them).
 - **ArrayType** uses any other type for array elements and records it's content to stream. It works with arrays that contain elements of same type, values of other types will lead to unexpected results.
 - **BigIntType** works with [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values of length up to 128 bits.
 - **EnumType** should be provided with list of possible values, saves index of the value to stream.

> IntType with variable size uses first 3 bits to specify how many of 4-bit chunks used to record the actual value.

### Type Registry
This project contains so-called type registry, it contains all Data Type classes that are used in automatic schema generation via `readSchemaFrom`(or in ObjectType/ArrayType) and in serializing schemas into raw objects and back. Withithn the library all available Data Types are registered using `addTypeDefinition()` function which does all the work.

### Schema
Schema object contains ObjectType in it and provides simple API to generate Uint8Array from object properties and back. Also may use [Base64](https://en.wikipedia.org/wiki/Base64)-encoded string.
```javascript
// sample data
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

// write data and convert to Base64 string
const schema = readSchemaFrom(data);
console.log(schema.saveBase64From(data)); // QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=

// read data from Base64 string using same schema
const newData = schema.loadBase64To('QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=');
console.log(newData);
/*
{
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  big: 555555555555555555555555555555555n,
  bool: false,
  ...
*/
```
To see or save schema use toObject() method and `console.log(schema.toObject());` from example above will result in
```json
{
  "type": "object",
  "fields": {
    "bool": {
      "type": "bool"
    },
    "num": {
      "type": "int",
      "signed": true,
      "size": 0,
      "twosComplement": true
    },
    "big": {
      "type": "bigint"
    },
    "arr": {
      "type": "array",
      "elementsOfType": {
        "type": "int",
        "signed": true,
        "size": 0,
        "twosComplement": true
      }
    },
    "obj": {
      "type": "object",
      "fields": {
        "one": {
          "type": "bool"
        },
        "two": {
          "type": "bool"
        },
        "three": {
          "type": "bool"
        },
        "num": {
          "type": "int",
          "signed": true,
          "size": 0,
          "twosComplement": true
        }
      }
    }
  }
}
```
This simple version of schema could be stored elsewhere in JSON and restored back using Schema.fromObject();
```javascript
const schema = Schema.fromObject(JSON.parse(jsonEncodedSchema));

schema.loadBase64To(queryData, currentConfig);
```

Save and load nested arrays of booleans
```javascript
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
console.log(data); // CCQZVBqgkGqQZUA=
console.log(schema.loadBase64To(data));
```

## Extensions
To extend this library with new data types or special cases for already existing data types, you have to create new Data Type class and register it using Type Registry.
```javascript
import { defaultTypeRegistry, addTypeDefinition } from '@actualwave/multibyte-stream';

/*
  Create a data type
*/
export class MyCustomType implements IType {
  static readonly type = 'mycustom';

  writeTo(writer: IBitWriter, value: any): void {
    /*
      Here you write data to stream in form of unsigned integers
    */
  }

  readFrom(reader: IBitReader): any {
    /*
      Read unsigned integers andconvert them into your data
    */
  }

  toObject(): ITypeData {
    /*
      Convert your custom data type into a serializable object
    */

    return {
      type: MyCustomType.type,
    };
  }

  static getInstance(): IType {
    return new MyCustomType();
  }

  static getTypeKeys(): Array<string | Function> {
    /*
      Any identifiers which can be used to apply instance of this class to a value
      Usually these are strings or classes.
      If you want to bind your custom type to specific object type or base type,
      pass it here. For example, adding here Number will assign this data type for
      all numbers.

    */
    return [MyCustomType.type, MyCustomType];
  }

  static fromObject(
    data: ITypeData,
    registry: TypeRegistry = defaultTypeRegistry
  ): MyCustomType {
    /*
      Convert object to data type instance
    */
    return new MyCustomType();
  }
}

/*
Register your data type so it cam be applied in auto-generated custom schemas(for objects, arrays etc.).
*/
addTypeDefinition(MyCustomType);
```
If you want your data type to be used for custom type of object, just ad dit to the list in `getTypeKeys()`, this works for simple JS types.
```javascript
  static getTypeKeys(): Array<string | Function> {
    /*
      I want to make custom date objects, built-in Date and moment objects to be serializable
    */
    return [MyCustomType.type, CustomDateObject, Date, moment, MyCustomType];
  }
```
