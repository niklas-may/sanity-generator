import { Resolver } from "../../../../src/types";

export const localeStringSchema = {
  type: "object",
  name: "localeString",
  fields: [
    {
      type: "string",
      name: "en",
      title: "English",
    },
    {
      type: "string",
      name: "de",
      title: "German",
    },
  ],
};

export const localStringResolver: Resolver = (name: string) => /* groq */ `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;
