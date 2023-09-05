import type { Config } from "./types";

export function createConfig<T extends Record<string, any>>(options: Config<T>): Config<T> {
  return options;
}
