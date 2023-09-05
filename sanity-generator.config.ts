import { createConfig } from "./src/create-config";
import { pageSchema } from "./data/documents/page";
import { localStringProjection, mediaProjection } from "./data/objects";

export default createConfig({
  documents: {
    page: pageSchema,
  },
  resolveTypes: {
    localeString: localStringProjection,
    media: mediaProjection,
  },
  createQueries: {
    getPages: (documents) => /* groq */ `
          *[_type == "${documents.page.type}"] {${documents.page.groq}}
        `,
    getPageBySlug: (documents) => /* groq */ `
          *[_type == "${documents.page.type}" && slug == $slug] {${documents.page.groq}}[0]
        `,
  },
});
