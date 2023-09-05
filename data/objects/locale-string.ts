import { Resolver } from "./../../src/types";

export const localeStringSchema = {
  type: "object",
  name: "localeString",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      fieldset: "translations",
    },
  ],
};

export const localStringResolver: Resolver = (name: string) => /* groq */ `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;
