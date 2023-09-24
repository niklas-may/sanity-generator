import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const localeString: Resolver = (name) => ( /* groq */ ` "${name}": coalesce(${name}[$lang], ${name}.en) ` )
