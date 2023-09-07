import type { ProcessedSchema, Config, Options } from "./../types";

import { format } from "groqfmt-nodejs";
import path from "path";
import { Projector } from "./projector";
import { mergeOptions, createMissingDirectories, writeTypeScript } from "./lib";

export async function generate<T extends Record<string, any>>(config: Config<T>, options?: Options) {
  const opts = mergeOptions(options);

  const projector = new Projector(config.resolvers);
  const processedScheams = {} as Record<keyof T, ProcessedSchema>;

  for (const key in config.schemas) {
    const k = key as keyof typeof config.schemas;
    const doc = config.schemas[k];

    processedScheams[key] = {
      name: doc.name,
      projection: projector.projectAndSpreadDocument(doc),
    };
  }

  createMissingDirectories(opts.outPath);

  for (const [queryName, queryFn] of Object.entries(config.queries)) {
    const query = queryFn({ schemas: processedScheams });

    const filePath = path.resolve(opts.outPath, `${queryName}.ts`);
    writeTypeScript(filePath, `export const ${queryName} = /* groq */\`\n${await format(query)}\``);
  }
}
