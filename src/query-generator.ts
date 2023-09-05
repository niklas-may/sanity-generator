import type { Resolver, Field } from "./types";

export class QueryGenerator {
  typeResolver: Record<string, Resolver>;
  customTypes: Set<string>;

  constructor(typeResolver?: Record<string, Resolver>) {
    this.typeResolver = typeResolver ?? {};
    this.customTypes = new Set(Object.keys(this.typeResolver));
  }

  #isCustomType(type: string) {
    return this.customTypes.has(type);
  }

  #hasCustomField(types: string[]): boolean {
    for (const value of types) {
      if (this.customTypes.has(value)) {
        return true;
      }
    }

    return false;
  }
  #getSubfields(field: Field) {
    return field.of || field.fields || false;
  }

  #reduceTypes(field: Field, prevAcc?: string[]): string[] {
    return (field.of || field.fields || []).reduce((acc: string[], curr: Field) => {
      acc.push(curr.type);

      if (this.#getSubfields(curr)) {
        return this.#reduceTypes(curr, acc);
      }
      return acc;
    }, prevAcc ?? []);
  }

  #traverseAndSplat(fields: Array<Field>): string {
    return fields
      .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
      .reduce((acc: string, curr) => {
        const subFields = this.#getSubfields(curr);

        if (curr.type === "array" && subFields) {
          if (this.#hasCustomField(this.#reduceTypes(curr))) {
            return acc.concat(curr.name, `[]{\n ${this.#traverseAndSplat(subFields)} \n}, `);
          } else {
            return acc;
          }
        } else if (curr.type === "object" && subFields) {
          if (this.#hasCustomField(this.#reduceTypes(curr))) {
            return acc.concat(curr.name, `{\n ${this.#traverseAndSplat(subFields)} \n}, `);
          } else {
            return acc;
          }
        } else if (this.#isCustomType(curr.type)) {
          return acc.concat(`${this.typeResolver[curr.type](curr.name)}`, ",\n");
        } else {
          return acc;
        }
      }, "...,\n");
  }

  #traverse(fields: Array<Field>): string {
    return fields
      .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
      .reduce((acc: string, curr) => {
        const subFields = this.#getSubfields(curr);

        if (curr.type === "array" && subFields) {
          return acc.concat(curr.name, `[]{\n ${this.#traverse(subFields)} \n}, `);
        } else if (curr.type === "object" && subFields) {
          return acc.concat(curr.name, `{\n ${this.#traverse(subFields)} \n}, `);
        } else {
          return acc.concat(`${curr.name}`, ",\n");
        }
      }, "");
  }

  create(document: { name: string; fields: Field[] }) {
    return this.#traverse(document.fields);
  }

  createSpalt(document: { name: string; fields: Field[] }) {
    return this.#traverseAndSplat(document.fields);
  }
}
