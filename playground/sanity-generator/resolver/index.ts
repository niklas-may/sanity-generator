export const inlineResolver0 = (name) =>
  /* groq */
  `"${name}": {"super": "cool"}`;

export const localeString = (name) =>
  /* groq */
  `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;
