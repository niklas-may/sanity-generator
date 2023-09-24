import type { ProcessedSchema, Config, Options, Resolver } from "./../types";
import path from "path";
import { consola } from "consola";
import { rimrafSync } from "rimraf";
import serializeJs from "serialize-javascript";
import { paramCase, pascalCase } from "change-case";
import { Projector } from "./projector";
import { mergeOptions, createMissingDirectories, writeTypeScript, prettifyGroq } from "./lib";

export async function generate<T extends Record<string, any>>(config: Config<T>, options?: Options) {
  const opts = mergeOptions(options);
  const configQueries = Object.entries(config.queries);
  const configQuerieNames = Object.keys(config.queries);

  rimrafSync(`${opts.outPath}/*`, { glob: true });
  createMissingDirectories(path.join(opts.outPath, "queries"));

  const { schemas } = processSchema(config, { inlineResolver: true });

  consola.info("Looking for GROQ syntax errors...");

  for (const [_, queryFn] of configQueries) {
    const queryString = queryFn({ schemas: schemas });
    await prettifyGroq(queryString);
  }

  consola.info("No errors found.");

  if (opts?.inlineResolver === true) {
    await Promise.all(
      configQueries.map(async ([queryName, queryFn]) => {
        const queryString = queryFn({ schemas: schemas });

        const query = await prettifyGroq(queryString);
        const queryProcessed = opts.trim ? trimString(query) : query;

        const code = `${
          opts.trim ? "// prettier-ignore\n" : ""
        }export const ${queryName} = /* groq */\`\n${queryProcessed}\``;
        const filePath = path.resolve(opts.outPath, "queries", `${paramCase(queryName)}.ts`);

        return await writeTypeScript(filePath, code);
      })
    );
  }
  let usedResolvers = 0;
  if (opts?.inlineResolver === false) {
    const { schemas, types, resolvers } = processSchema(config, { inlineResolver: false });
    usedResolvers = types.size;
    createMissingDirectories(path.join(opts.outPath, "resolver"));


    await Promise.all(
      configQueries.map(async ([queryName, queryFn]) => {
        const queryTemplate = await prettifyGroq(queryFn({ schemas: schemas }));
        const { query, resolverDependencies } = Projector.insertResolver(queryTemplate);

        const queryProcessed = opts.trim ? trimString(query) : query;

        const code = [
          resolverDependencies.size > 0 ? `import { ${[...resolverDependencies].join(", ")}} from '../resolver'\n` : "",
          `${opts.trim ? "// prettier-ignore\n" : ""} export const ${queryName} = /* groq */\`\n${queryProcessed}\``,
        ]
          .filter(Boolean)
          .join("\n");

        const filePath = path.resolve(opts.outPath, "queries", `${paramCase(queryName)}.ts`);
        return await writeTypeScript(filePath, code);
      })
    );
    await wirteResolver(types, resolvers, path.join(opts.outPath, "resolver"), opts);
    await writeBarrelFile(configQuerieNames, path.resolve(opts.outPath, "queries"));

  }

  if (opts.inlineResolver) {
    consola.info(`${configQueries.length} querie(s) written.`);
  } else {
    consola.info(`${configQueries.length} querie(s) and ${usedResolvers} resolver(s) written.`);
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
  const resolverNames = Array.from(names).sort();

  await Promise.all(
    resolverNames.map(async (name) => {
      let fnString = serializeJs(resolvers[name]);

      if (options.trim) {
        fnString = trimString(fnString);
      }

      const code = `import {type Resolver} from 'sanity-generator/types'\n\n${
        options.trim ? "// prettier-ignore\n" : ""
      }export const ${name}: Resolver = ${fnString}`;

      return await writeTypeScript(path.resolve(dir, `${paramCase(name)}.ts`), code);
    })
  );

  await writeBarrelFile(resolverNames, dir);
}

function trimString(str: string) {
  return str.replace(/\s+/g, " ");
}

async function writeBarrelFile(fileNames: string[], dir: string) {
  const barrleCode = fileNames.reduce((acc, cur) => acc.concat(`export * from "./${paramCase(cur)}"\n`), "");
  await writeTypeScript(path.resolve(dir, "index.ts"), barrleCode);
}
