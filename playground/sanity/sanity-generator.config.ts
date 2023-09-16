import { createConfig } from "../../src";
import { fileURLToPath } from 'url';
import { pageSchema } from "./schemas/documents";
import { localStringResolver, mediaResolver } from "./schemas/objects";


import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default createConfig(
  {
    schemas: {
      page: pageSchema,
    },
    resolvers: {
      localeString: localStringResolver,
      media: mediaResolver,
    },
    queries: {
      getPages: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}"] {
          ${schemas.page.projection}
        }[0]
      `,
    },
  },
  {
    inlineResolver: true,
    outPath: path.resolve(__dirname, "./sanity-generator"),
  }
);
