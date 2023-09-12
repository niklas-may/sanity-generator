#! /usr/bin/env node
import { CreateConfigReturn } from "../types";

import path from "path";
import fs from "fs";
import { register } from "ts-node";
import { consola } from "consola";
import { program } from "commander";
import { generate } from "../core/generate";

register({
  compilerOptions: {
    module: "CommonJS",
  },
  require: ["tsconfig-paths/register"],
  typeCheck: false,
  transpileOnly: true,
});

program.name("Sanity Generator");

program
  .command("generate")
  .option("-c, --config <filename>", "Path to the configuration file")
  .action(({ config }) => {
    try {
      const filePath = [config, "sanity-generator.config.ts", "sanity-generator.config.js"]
        .filter(Boolean)
        .filter((f) => fs.existsSync(path.resolve(process.cwd(), f)))
        .shift();

      if (!filePath)
        throw new Error(
          "Config file not found. Run the init command to generate a config file or use the --config <path-to-config-file> to specify the location."
        );
      const configObject = require(path.resolve(process.cwd(), filePath)).default as CreateConfigReturn<object>;
      generate(...configObject);
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
