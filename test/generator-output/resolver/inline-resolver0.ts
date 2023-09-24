import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const inlineResolver0: Resolver = (name2) => ( /* groq */ ` "${name2}-wrapped": ${name2} ` )
