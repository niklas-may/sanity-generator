import { format } from "groqfmt-nodejs";
import { Projector } from "./projector";
import type { ProcessedSchema, Config } from "./../types";
import { consola } from "consola";

export async function generate<T extends Record<string, any>>(config: Config<T>) {
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

  for (const [queryName, queryFn] of Object.entries(config.queries)) {
    const query = queryFn({ schemas: processedScheams });

    consola.info(queryName, await format(query));
  }
}
