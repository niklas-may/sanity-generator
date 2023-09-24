// prettier-ignore
export const inlineResolver0 = (name2) => ( /* groq */ ` "${name2}-wrapped": ${name2} ` );

// prettier-ignore
export const specialNumber = (name) => ( /* groq */ ` "${name}-special-number": ${name} ` );

// prettier-ignore
export const localeString = (name) => ( /* groq */ ` "${name}": coalesce(${name}[$lang], ${name}.en) ` );

// prettier-ignore
export const inlineResolver1 = (name2) => ( /* groq */ ` "${name2}-wrapped": { "title": ${name2}.title, "subtitle": ${name2}.subtitle } ` );
