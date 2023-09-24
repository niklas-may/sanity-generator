import { type Resolver } from "sanity-generator/types";

// prettier-ignore
export const inlineResolver1: Resolver = (name2) => ( /* groq */ ` "${name2}-wrapped": { "title": ${name2}.title, "subtitle": ${name2}.subtitle } ` )
