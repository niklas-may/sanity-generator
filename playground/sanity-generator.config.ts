import path from 'path';
import { fileURLToPath } from 'url';
import { createConfig } from "../src";
import { pageSchema } from "./sanity/schemas/documents";
import { localStringResolver, mediaResolver } from "./sanity/schemas/objects";

import {inspect} from "util"

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
      getPageBySlug: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}" && slug.current == $slug] {
         ${schemas.page.projection}
        }[0]
      `,
    },
  },
  {
    // inlineResolver: true,
    outPath: path.resolve(__dirname, "./sanity-generator"),
  }
);
