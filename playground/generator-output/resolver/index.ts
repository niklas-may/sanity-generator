// prettier-ignore
export const inlineResolver0 = (name) => ( /* groq */ ` "${name}": { "germanTitle": ${name}.de, "englishTitle": ${name}.en } ` );

// prettier-ignore
export const localeString = (name) => ( /* groq */ ` "${name}": coalesce(${name}[$lang], ${name}.en) ` );

// prettier-ignore
export const inlineResolver1 = (name) => ( /* groq */ `"${name}": {"super": "cool"}` );
