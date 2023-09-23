export const primitiveFactory = (name: string) => ({
  type: "number",
  name,
  generator: {
    resolver: (name: string) => /* groq */ `
            "${name}-wrapped": ${name}
        `,
  },
});
