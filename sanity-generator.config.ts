import { createConfig } from "./src/create-config";
import { pageSchema } from "./data/documents/page";
import { localStringQuery } from "./data/objects/locale-string";

export default createConfig({
  documents: {
    page: pageSchema,
  },
  resolveTypes: {
    localeString: localStringQuery,
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
