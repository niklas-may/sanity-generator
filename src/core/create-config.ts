import type { Config, Options, CreateConfigReturn } from "../types";

export function createConfig<T extends Record<string, any>>(
  config: Config<T>,
  options?: Options
): CreateConfigReturn<T> {
  return [config, options];
}
