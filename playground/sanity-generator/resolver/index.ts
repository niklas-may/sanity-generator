export const localeString = (name) =>
  /* groq */
  `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;
