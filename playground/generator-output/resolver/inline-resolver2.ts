import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const inlineResolver2: Resolver = (name) => ( /* groq */ `"${name}": {"super": "cool"}` )
