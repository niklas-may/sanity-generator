import { format } from "groqfmt-nodejs";
import { QueryGenerator } from "./query-generator";
import type { Projection, Config } from "./types";

export async function main<T extends Record<string, any>>(config: Config<T>) {
  const writer = new QueryGenerator(config.resolveTypes);
  const queries: Record<string, Projection> = {};

  for (const key in config.documents) {
    const k = key as keyof typeof config.documents;
    const doc = config.documents[k];
    
    queries[key] = {
      type: doc.name,
      groq: writer.createSpalt(doc),
    };
  }

  for (const [key, value] of Object.entries(config.createQueries)) {
    //@ts-ignore
    const query = value(queries);

    console.log(key, await format(query));
  }
}

