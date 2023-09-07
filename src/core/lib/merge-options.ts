import type { Options } from "./../../types";
import { defu } from "defu";

const defaults: Options = { outPath: "./sanity-generator" };

export function mergeOptions(options?: Options) {
  return defu(options, defaults);
}
