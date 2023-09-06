import type { Resolver, Field } from "./types";

export class Projector {
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

  #projectNodeAndSpread(fields: Array<Field>): string {
    return fields
      .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
      .reduce((acc: string, curr) => {
        const subFields = this.#getSubfields(curr);

        if (["array", "object"].includes(curr.type) && subFields) {
          if (this.#hasCustomField(this.#reduceTypes(curr))) {
            if (curr.type === "array") {
              return acc.concat(curr.name, `[]{\n ${this.#projectNodeAndSpread(subFields)} \n}, `);
            } else {
              return acc.concat(curr.name, `{\n ${this.#projectNodeAndSpread(subFields)} \n}, `);
            }
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

  #projectNode(fields: Array<Field>): string {
    return fields
      .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
      .reduce((acc: string, curr) => {
        const subFields = this.#getSubfields(curr);

        if ("array" && subFields) {
          return acc.concat(curr.name, `[]{\n ${this.#projectNode(subFields)} \n}, `);
        } else if (curr.type === "object" && subFields) {
          return acc.concat(curr.name, `{\n ${this.#projectNode(subFields)} \n}, `);
        } else {
          return acc.concat(`${curr.name}`, ",\n");
        }
      }, "");
  }

  projectDocument(document: { name: string; fields: Field[] }) {
    if (!Array.isArray(document?.fields)) {
      console.warn("Fields Proerty is required");
      return "";
    }
    return this.#projectNode(document.fields);
  }

  projectAndSpreadDocument(document: { name: string; fields: Field[] }) {
    if (!Array.isArray(document?.fields)) {
      console.warn("Fields Proerty is required");
      return "";
    }
    return this.#projectNodeAndSpread(document.fields);
  }
}
