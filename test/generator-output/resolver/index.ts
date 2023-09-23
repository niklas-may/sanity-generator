export const inlineResolver0 = (name2) =>
  /* groq */
  `
            "${name2}-wrapped": ${name2}
        `;

export const specialNumber = (name) =>
  /* groq */
  `
    "${name}-special-number": ${name}
`;

export const localeString = (name) =>
  /* groq */
  `
    "${name}": coalesce(${name}[$lang], ${name}.en)
`;

export const inlineResolver1 = (name2) =>
  /* groq */
  `
            "${name2}-wrapped": {
              "title": ${name2}.title,
              "subtitle": ${name2}.subtitle
            }
        `;
