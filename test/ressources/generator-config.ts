import { fileURLToPath } from "url";
import path from "path";
import { createConfig } from "../../src";
import { testDocumentSchema } from "./cms/schemas/documents/test";
import { specialNumberResolver } from "./cms/schemas/types/special-number";
import { localStringResolver } from "./cms/schemas/types/locale-string";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default createConfig(
  {
    schemas: {
      test: testDocumentSchema,
    },
    resolvers: {
      specialNumber: specialNumberResolver,
      localeString: localStringResolver,
    },
    queries: {
      getTest: ({ schemas }) => /* groq */ `
        *[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] {
          ${schemas.test.projection}
        }[0]
      `,
    },
  },
  { outPath: path.resolve(__dirname, "../generator-output"), inlineResolver: false}
);


