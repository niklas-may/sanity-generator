import type { Resolver, DocumentOrField } from "../types";
import { consola } from "consola";

type ObjectMode = "wraped" | "naked";
type TraversalArguments = {
  fields: Array<DocumentOrField>;
  foundTypes?: Set<string>;
  inline: boolean;
  objectMode?: ObjectMode;
};

export class Projector {
  inlineResolverId = 0;
  resolvers: Record<string, Resolver>;
  customTypes: Set<string>;

  constructor(resolvers?: Record<string, Resolver>) {
    this.resolvers = resolvers ?? {};
    this.customTypes = new Set(Object.keys(this.resolvers));
    this.customTypes.add("inlineResolver");
  }

  #isCustomType(type: string) {
    return this.customTypes.has(type);
  }

  #hasInlineResolver(field: DocumentOrField) {
    return typeof field.generator?.resolver === "function";
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
  #getSubfields(field: DocumentOrField): boolean | DocumentOrField[] {
    return field.of || field.fields || false;
  }

  #mybeAddInlineResolver(field: DocumentOrField, arr: string[]) {
    if (typeof field.generator?.resolver === "function") {
      let resolverName = "";

      for (let [key, val] of Object.entries(this.resolvers)) {
        if (val?.toString() === field.generator.resolver.toString()) {
          resolverName = key;
        }
      }

      if (resolverName === "") {
        resolverName = `inlineResolver${this.inlineResolverId}`;
        this.inlineResolverId += 1;
      }

      this.resolvers[resolverName] = field.generator.resolver;
      field.type = resolverName;
      this.customTypes.add(resolverName);
      field.generator.resolver = undefined;

      arr.push(resolverName);
    }
  }

  #reduceTypes(field: DocumentOrField, prevAcc: string[] = []): string[] {
    return (field.of || field.fields || []).reduce((acc: string[], curr: DocumentOrField) => {
      acc.push(curr.type);
      this.#mybeAddInlineResolver(curr, acc);

      if (this.#getSubfields(curr)) {
        return this.#reduceTypes(curr, acc);
      }
      return acc;
    }, prevAcc ?? []);
  }

  #warpField(objectMode: ObjectMode, children: string, name: string) {
    if (objectMode === "wraped") {
      return `_type == '${name}' =>  {\n 
      ${children} 
     } `;
    } else if (objectMode === "naked") {
      return `
        ${children}
      `;
    } else {
      return children;
    }
  }

  #projectNodeAndSpread({ fields, foundTypes, inline, objectMode }: TraversalArguments): [string, Set<string>] {
    const types = foundTypes ?? new Set();

    return [
      fields
        .sort((a) => (this.#isCustomType(a.type) || this.#getSubfields(a) ? 1 : -1))
        .reduce(
          (acc: string, curr, index) => {
            const subFields = this.#getSubfields(curr);

            if (
              ["array", "object"].includes(curr.type) &&
              typeof subFields !== "boolean" &&
              !this.#hasInlineResolver(curr)
            ) {
              const childCustomTypes = this.#hasCustomField(this.#reduceTypes(curr));

              if (childCustomTypes instanceof Set) {
                childCustomTypes.forEach((v) => types.add(v));

                if (curr.type === "array") {
                  const objectMode = curr.of.length > 1 ? "wraped" : "naked";
                  return acc.concat(
                    curr.name,
                    `[]{\n ..., ${
                      this.#projectNodeAndSpread({
                        fields: subFields,
                        foundTypes: childCustomTypes,
                        inline,
                        objectMode,
                      })[0]
                    } \n}, `
                  );
                } else {
                  return acc.concat(
                    this.#warpField(
                      objectMode,
                      this.#projectNodeAndSpread({ fields: subFields, foundTypes: childCustomTypes, inline })[0],
                      curr.name
                    ), index < fields.length - 1 ? ',' : ''
                  );
                }
              } else {
                return acc;
              }
            } else if (this.#isCustomType(curr.type) || this.#hasInlineResolver(curr)) {
              let resolverName = curr.type;

              // Would be nice to deal with inline Resolver on in one place...
              if (this.#hasInlineResolver(curr)) {
                resolverName = `inlineResolver${this.inlineResolverId}`;
                this.resolvers[resolverName] = curr.generator.resolver;
                this.inlineResolverId += 1;
                types.add(resolverName);
              } else {
                resolverName = curr.type;
                types.add(resolverName);
              }
              const field = inline
                ? `${this.resolvers[resolverName](curr.name)}`
                : `"__start_resolve": "${resolverName} ${curr.name}__end__resolve"`;
              return acc.concat(this.#warpField(objectMode, field, curr.name), ",\n");
            } else {
              return acc;
            }
          },
          objectMode ? "\n" : "...,\n"
        ),
      types,
    ];
  }

  #projectNode(fields: Array<DocumentOrField>): string {
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

  projectDocument(document: { name: string; fields: DocumentOrField[] }) {
    try {
      if (!Array.isArray(document?.fields)) throw new Error(`Missing "fields" property on schema ${document.name}`);
      return this.#projectNode(document.fields);
    } catch (e) {
      consola.error(e.message);
      process.exit(1);
    }
  }

  projectAndSpreadDocument(document: { name: string; fields: DocumentOrField[] }, options: { inline: boolean }) {
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
