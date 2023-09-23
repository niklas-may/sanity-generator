export const inlineResolver0 = (name) =>
  /* groq */
  `
          "${name}": {
            "germanTitle": ${name}.de,
            "englishTitle": ${name}.en
          }
        `;

export const localeString = (name) =>
  /* groq */
  `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;

export const inlineResolver1 = (name) =>
  /* groq */
  `"${name}": {"super": "cool"}`;
