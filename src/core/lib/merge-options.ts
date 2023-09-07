import type { Options } from "./../../types";
import { defu } from "defu";

const defaults: Options = { outPath: "./sanity-generator", inlineResolver: false };

export function mergeOptions(options?: Options) {
  return defu(options, defaults);
}
