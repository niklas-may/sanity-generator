import path from "path";
import { createConfig } from "../src";
import { pageSchema } from "./sanity/schemas/documents";
import { localStringResolver, mediaResolver } from "./sanity/schemas/objects";

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
