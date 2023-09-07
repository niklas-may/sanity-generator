import { createConfig } from "sanity-generator";

export default createConfig({
  schemas: {},
  resolvers: {},
  queries: {
    myQuery: ({ schemas }) => /* groq */ `
      `,
  },
});
