#! /usr/bin/env node

import path from "path";
import fs from "fs";
import { consola } from "consola";
import { program } from "commander";
import { generate } from "../core/generate";
import { serveConfig } from "../core/serve-config";

program.name("Sanity Generator");

program
  .command("generate")
  .option("-c, --config <filename>", "Path to the configuration file")
  .option("-w, --watch", "Watch for file changes and rerun")
  .action(async ({ config, watch }) => {
    try {
      const filePath = [config, "sanity-generator.config.ts", "sanity-generator.config.js"]
        .filter(Boolean)
        .filter((f) => fs.existsSync(path.resolve(process.cwd(), f)))
        .shift();

      if (!filePath)
        throw new Error(
          "Config file not found. Run the init command to generate a config file or use the --config <path-to-config-file> to specify the location."
        );

      serveConfig({ configPath: path.resolve(process.cwd(), filePath), watch: !!watch }, async (config) => await generate(...config));
    } catch (e) {
      consola.error(e);
    }
  });

program.command("init").action(() => {
  const templatePath = path.resolve(__dirname, "../static/templates/config.ts");
  const outPath = path.resolve(process.cwd(), "sanity-generator.config.ts");

  fs.copyFileSync(templatePath, outPath);
});

program.parse(process.argv);
