import type { Resolver, Field } from "../types";
import { consola } from "consola";

type TraversalArguments = { fields: Array<Field>; foundTypes?: Set<string>; inline: boolean };

export class Projector {
  resolvers: Record<string, Resolver>;
  customTypes: Set<string>;

  constructor(resolvers?: Record<string, Resolver>) {
    this.resolvers = resolvers ?? {};
    this.customTypes = new Set(Object.keys(this.resolvers));
  }

  #isCustomType(type: string) {
    return this.customTypes.has(type);
  }

  #hasCustomField(types: string[]): boolean | Set<string> {
    const matches = new Set<string>();
    for (const value of types) {
      if (this.customTypes.has(value)) {
        matches.add(value);
      }
    }

    return matches.size > 0 ? matches : false;
  }
  #getSubfields(field: Field): boolean | Field[] {
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

  #projectNodeAndSpread({ fields, foundTypes, inline }: TraversalArguments): [string, Set<string>] {
    const types = foundTypes ?? new Set();

    return [
      fields
        .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
        .reduce((acc: string, curr) => {
          const subFields = this.#getSubfields(curr);

          if (["array", "object"].includes(curr.type) && typeof subFields !== "boolean") {
            const childCustomTypes = this.#hasCustomField(this.#reduceTypes(curr));

            if (childCustomTypes instanceof Set) {
              childCustomTypes.forEach((v) => types.add(v));

              if (curr.type === "array") {
                return acc.concat(
                  curr.name,
                  `[]{\n ${
                    this.#projectNodeAndSpread({ fields: subFields, foundTypes: childCustomTypes, inline })[0]
                  } \n}, `
                );
              } else {
                return acc.concat(
                  curr.name,
                  `{\n ${
                    this.#projectNodeAndSpread({ fields: subFields, foundTypes: childCustomTypes, inline })[0]
                  } \n}, `
                );
              }
            } else {
              return acc;
            }
          } else if (this.#isCustomType(curr.type)) {
            const field = inline
              ? `${this.resolvers[curr.type](curr.name)}`
              : `"__start_resolve": "${curr.type} ${curr.name}__end__resolve"`;
            return acc.concat(field, ",\n");
          } else {
            return acc;
          }
        }, "...,\n"),
      types,
    ];
  }

  #projectNode(fields: Array<Field>): string {
    return fields
      .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
      .reduce((acc: string, curr) => {
        const subFields = this.#getSubfields(curr);

        if (typeof subFields !== "boolean") {
          if (curr.type === "array") {
            return acc.concat(curr.name, `[]{\n ${this.#projectNode(subFields)} \n}, `);
          } else if (curr.type === "object" && subFields) {
            return acc.concat(curr.name, `{\n ${this.#projectNode(subFields)} \n}, `);
          }
        } else {
          return acc.concat(`${curr.name}`, ",\n");
        }
      }, "");
  }

  projectDocument(document: { name: string; fields: Field[] }) {
    try {
      if (!Array.isArray(document?.fields)) throw new Error(`Missing "fields" property on schema ${document.name}`);
      return this.#projectNode(document.fields);
    } catch (e) {
      consola.error(e.message);
      process.exit(1);
    }
  }

  projectAndSpreadDocument(document: { name: string; fields: Field[] }, options: { inline: boolean }) {
    try {
      if (!Array.isArray(document?.fields)) throw new Error(`Missing "fields" property on schema ${document.name}`);
      return this.#projectNodeAndSpread({ fields: document.fields, inline: options.inline });
    } catch (e) {
      consola.error(e.message);
      process.exit(1);
    }
  }

  static insertResolver(query: string) {
    const resolverDependencies = new Set<string>();

    const transform = (match: string, innerText: string) => {
      const [resolver, param] = innerText.split(" ");
      resolverDependencies.add(resolver);
      return `\${${resolver}("${param}")}`;
    };

    const pattern = /"__start_resolve":\s+"([^"]+?)__end__resolve"/g;

    return {
      query: query.replace(pattern, (match, innerText) => transform(match, innerText)),
      resolverDependencies,
    };
  }
}
