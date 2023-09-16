import { Options } from "./../types/index";
import { fileExistsAsync } from "tsconfig-paths/lib/filesystem";
import { type Plugin, transformWithEsbuild, createServer } from "vite";
import util from "util";
import fs from "fs";
export function sanityGenerator(options?: Record<string, any>): Plugin {
  return {
    name: "sanity-composer",
    config: () => ({
      optimizeDeps: {
        include: ["./sanity-generator.config.ts"],
      },
    }),
    async configureServer(server) {
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "custom",
      });

      const module = await vite.ssrLoadModule(
        "/Users/niklasmay/Development/@nm/sanity-generator/playground/sanity/sanity-generator.config.ts"
      );

      const [config, options] = module.default;
      console.log(config)
    },
  } as const satisfies Plugin;
}
