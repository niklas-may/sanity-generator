import type { Config, Options } from "../types";

export function createConfig<T extends Record<string, any>>(config: Config<T>, options?: Options): Config<T> {
  return config;
}
