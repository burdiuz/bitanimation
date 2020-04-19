import { IType } from '../types/itype';
import { defaultTypeRegistry } from '../types/registry';

export const readObjectFieldTypes = (
  data: { [key: string]: any },
  registry = defaultTypeRegistry,
  target = {}
): { [key: string]: IType } => {
  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined || key in target) {
      return;
    }

    const { constructor } = Object.getPrototypeOf(value);
    const type = registry.getTypeFor(constructor).getInstance();

    if (type) {
      target[key] = type;
    }
  });

  return target;
};
