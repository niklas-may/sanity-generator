export const localeString = {
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

export const localStringQuery = (name: string) => /* groq */ `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;
