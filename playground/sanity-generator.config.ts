import { createConfig } from "../src";
import { pageSchema } from "./schemas/documents";
import { localStringResolver, mediaResolver } from "./schemas/objects";

export default createConfig({
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
        }
      `,
    getPageBySlug: ({ schemas }) => /* groq */ `
        *[_type == "${schemas.page.name}" && slug == $slug] {
          ${schemas.page.projection}
        }[0]
      `,
  },
});
