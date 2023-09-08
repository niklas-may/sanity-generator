import type { ProcessedSchema, Config, Options, Resolver } from "./../types";
import path from "path";
import { consola } from "consola";

import { rimrafSync } from "rimraf";
import serializeJs from "serialize-javascript";
import { Projector } from "./projector";
import { mergeOptions, createMissingDirectories, writeTypeScript, prettifyGroq } from "./lib";

function processSchema<T extends Record<string, any>>(config: Config<T>, options?: Options) {
  const projector = new Projector(config.resolvers);

  const schemas = {} as Record<keyof T, ProcessedSchema>;
  const types = new Set<string>();

  for (const key in config.schemas) {
    const k = key as keyof typeof config.schemas;
    const doc = config.schemas[k];

    const [projection, foundTypes] = projector.projectAndSpreadDocument(doc, { inline: options?.inlineResolver });
    foundTypes.forEach((t) => types.add(t));

    schemas[key] = {
      name: doc.name,
      projection,
    };
  }

  return { schemas, types };
}

function wirteResolver(names: Set<string>, resolvers: Record<string, Resolver>, dir: string) {
  let resolverCode = "";

  names.forEach((t) => (resolverCode += `export const ${t} = ${serializeJs(resolvers[t])}; \n \n`));
  writeTypeScript(path.resolve(dir, "index.ts"), resolverCode);
}

export async function generate<T extends Record<string, any>>(config: Config<T>, options?: Options) {
  const opts = mergeOptions(options);

  rimrafSync(`${opts.outPath}/*`, { glob: true });
  createMissingDirectories(path.join(opts.outPath, "queries"));

  const { schemas } = processSchema(config, { inlineResolver: true });

  consola.info("Looking for GROQ syntax errors...");

  for (const [_, queryFn] of Object.entries(config.queries)) {
    const queryString = queryFn({ schemas: schemas });
    await prettifyGroq(queryString);
  }

  consola.info("No errors found.");

  if (opts?.inlineResolver === true) {
    for (const [queryName, queryFn] of Object.entries(config.queries)) {
      const queryString = queryFn({ schemas: schemas });

      const query = await prettifyGroq(queryString);

      const code = `export const ${queryName} = /* groq */\`\n${query}\``;
      const filePath = path.resolve(opts.outPath, "queries", `${queryName}.ts`);
      writeTypeScript(filePath, code);
    }
  }

  if (opts?.inlineResolver === false) {
    const { schemas, types } = processSchema(config, { inlineResolver: false });
    createMissingDirectories(path.join(opts.outPath, "resolver"));

    wirteResolver(types, config.resolvers, path.join(opts.outPath, "resolver"));

    for (const [queryName, queryFn] of Object.entries(config.queries)) {
      const queryTemplate = await prettifyGroq(queryFn({ schemas: schemas }));
      const { query, resolverDependencies } = Projector.insertResolver(queryTemplate);

      const code = [
        resolverDependencies.size > 0 ? `import { ${[...resolverDependencies].join(", ")}} from '../resolver'\n` : "",
        `export const ${queryName} = /* groq */\`\n${query}\``,
      ]
        .filter(Boolean)
        .join("\n");

      const filePath = path.resolve(opts.outPath, "queries", `${queryName}.ts`);
      writeTypeScript(filePath, code);
    }
  }

  if (opts.inlineResolver) {
    consola.info(`${Object.entries(config.queries).length} queries written.`);
  } else {
    consola.info(
      `${Object.entries(config.queries).length} queries and ${Object.entries(config.resolvers).length} resolvers written.`
    );
  }
  consola.info(`✅ All done. See output at ${opts.outPath}`);
}
