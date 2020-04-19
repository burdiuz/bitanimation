import { IType, ITypeStatic, ITypeData } from './itype';

export class TypeRegistry {
  private map = new Map<string | Function, ITypeStatic>();

  add(type: ITypeStatic) {
    const keys = type.getTypeKeys();

    keys.forEach((key) => this.addTypeFor(key, type));
  }

  addTypeFor(key: string | Function, type: ITypeStatic) {
    this.map.set(key, type);
  }

  hasTypeFor(key: string | Function): boolean {
    return this.map.has(key);
  }

  getTypeFor(key: string | Function): ITypeStatic {
    return this.map.get(key);
  }

  fromObject(data: ITypeData): IType {
    const definition: ITypeStatic = this.getTypeFor(data.type);

    if (!definition) {
      throw new Error(`Data type "${data.type}" cannot be found`);
    }

    return definition.fromObject(data);
  }
}

export const defaultTypeRegistry = new TypeRegistry();

export const addTypeDefinition = (...types: ITypeStatic[]) =>
  types.map((type) => defaultTypeRegistry.add(type));

export const addTypeDefinitionFor = (
  key: string | Function,
  type: ITypeStatic
) => defaultTypeRegistry.addTypeFor(key, type);

export const hasTypeDefinitionFor = (key: string | Function): boolean =>
  defaultTypeRegistry.hasTypeFor(key);

export const getTypeDefinitionFor = (key: string | Function): ITypeStatic =>
  defaultTypeRegistry.getTypeFor(key);
