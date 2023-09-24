import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const inlineResolver0: Resolver = (name) => ( /* groq */ ` "${name}": { "germanTitle": ${name}.de, "englishTitle": ${name}.en } ` )
