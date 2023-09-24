import type { ProcessedSchema, Config, Options, Resolver } from "./../types";
import path from "path";
import { consola } from "consola";
import { rimrafSync } from "rimraf";
import serializeJs from "serialize-javascript";
import { paramCase } from "change-case";
import { Projector } from "./projector";
import { mergeOptions, createMissingDirectories, writeTypeScript, prettifyGroq } from "./lib";

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
      const queryProcessed = opts.trim ? trimString(query) : query

      const code = `${opts.trim ? '// prettier-ignore\n' : ''}export const ${queryName} = /* groq */\`\n${queryProcessed}\``;
      const filePath = path.resolve(opts.outPath, "queries", `${paramCase(queryName)}.ts`);

      await writeTypeScript(filePath, code);
    }
  }
  let usedResolvers = 0;
  if (opts?.inlineResolver === false) {
    const { schemas, types, resolvers } = processSchema(config, { inlineResolver: false });
    usedResolvers = types.size;
    createMissingDirectories(path.join(opts.outPath, "resolver"));

    wirteResolver(types, resolvers, path.join(opts.outPath, "resolver"), opts);

    for (const [queryName, queryFn] of Object.entries(config.queries)) {
      const queryTemplate = await prettifyGroq(queryFn({ schemas: schemas }));
      const { query, resolverDependencies } = Projector.insertResolver(queryTemplate);

      const queryProcessed = opts.trim ? trimString(query) : query

      const code = [
        resolverDependencies.size > 0 ? `import { ${[...resolverDependencies].join(", ")}} from '../resolver'\n` : "",
        `${opts.trim ? '// prettier-ignore\n' : ''} export const ${queryName} = /* groq */\`\n${queryProcessed}\``,
      ]
        .filter(Boolean)
        .join("\n");

      const filePath = path.resolve(opts.outPath, "queries", `${paramCase(queryName)}.ts`);
      await writeTypeScript(filePath, code);
    }
  }

  if (opts.inlineResolver) {
    consola.info(`${Object.entries(config.queries).length} querie(s) written.`);
  } else {
    consola.info(`${Object.entries(config.queries).length} querie(s) and ${usedResolvers} resolver(s) written.`);
  }
  consola.info(`✅ All done. See output at ${opts.outPath}`);
}

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

  return { schemas, types, resolvers: projector.resolvers };
}

async function wirteResolver(names: Set<string>, resolvers: Record<string, Resolver>, dir: string, options: Options) {
  let resolverCode = "";

  names.forEach((t) => {
    let fnString = serializeJs(resolvers[t]);

    if (options.trim) {
      fnString = trimString(fnString);
    }

    return (resolverCode += `${options.trim ? '// prettier-ignore\n' : ''}export const ${t} = ${fnString}; \n \n`);
  });
  await writeTypeScript(path.resolve(dir, "index.ts"), resolverCode);
}

function trimString(str: string) {
  return str.replace(/\s+/g, " ");
}
