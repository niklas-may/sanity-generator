export const complexFactory = (name: string) => ({
  type: "object",
  name,
  fields: [
    { name: "title", type: "string" },
    { name: "subtitle", type: "string" },
  ],
  generator: {
    resolver: (name: string) => /* groq */ `
            "${name}-wrapped": {
              "title": ${name}.title,
              "subtitle": ${name}.subtitle
            }
        `,
  },
});
