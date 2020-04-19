import { IType, ITypeData } from './itype';
import { IBitWriter, IBitReader } from '../stream/ibitstream';
import { copyWriterConfig } from '../stream/bitwriter';
import { writeShortLength, readShortLength } from '../utils/lengths';

/*
Ideas for other string writing implementations

static length:
2 bits -- size of length block
8 - 16 bits -- length of the value
0 - ... -- value, max supported length is 65535 bytes
*/
/*
For variable length string it should be separated in groups:
0 group -- 0 - 127
1 group -- 127 - ...
2 bits -- size of length block
4 - 16 bits -- length of the string value

cycle:
  1 bit -- group

  2 bits -- length of group offset(4, 8, 12, 16 bits)
  4 - 16 bits -- group offset
  2 bits -- length of char size(4, 8, 12, 16 bits)
  4 - 16 bits -- char size


  2 bits -- size of length block
  4 - 16 bits -- length of the group
*/

/*
  Saves characters as sequence of 7 bit values. most significant bit, when set,
  tells that new character starts.
*/
export class StringType implements IType {
  static readonly type = 'string';

  writeTo(writer: IBitWriter, value: string): void {
    const chars = copyWriterConfig(writer);
    const { length } = value;

    for (let index = 0; index < length; index++) {
      let char = value.charCodeAt(index);
      let first = true;

      while (char) {
        const part = char & 0b1111111;

        chars.write(first ? 0b10000000 | part : part, 8);

        char = char >> 7;
        first = false;
      }
    }

    writeShortLength(writer, chars.getBytePosition());
    writer.writeData(chars.getData(), 0, chars.getPosition());
  }

  readFrom(reader: IBitReader): string {
    let value = '';
    let charCode = 20;
    let partCount = 0;

    let length = readShortLength(reader);

    while (length) {
      const part = reader.read(8);

      if (part >> 7 === 1) {
        value = `${value}${String.fromCharCode(charCode)}`;
        charCode = part & 0b1111111;
        partCount = 1;
      } else {
        charCode = ((part & 0b1111111) << (7 * partCount)) | charCode;
        partCount++;
      }

      length--;
    }

    // add last read char code and remove first space
    value = `${value.substr(1)}${String.fromCharCode(charCode)}`;

    return value;
  }

  toObject(): ITypeData {
    return { type: StringType.type };
  }

  static getTypeKeys(): Array<string | Function> {
    return [StringType.type, String, StringType];
  }

  static getInstance(): IType {
    return new StringType();
  }

  static fromObject(): StringType {
    return new StringType();
  }
}
