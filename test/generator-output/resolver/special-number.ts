import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const specialNumber: Resolver = (name) => ( /* groq */ ` "${name}-special-number": ${name} ` )
