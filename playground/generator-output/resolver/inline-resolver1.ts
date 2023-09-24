import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const inlineResolver1: Resolver = (name) => ( /* groq */ `"${name}": {"super": "cool"}` )
