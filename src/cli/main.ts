#! /usr/bin/env node

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
      const filePath = [config, "sanity-genelrator.config.ts", "sanity-genelrator.config.js"]
        .filter((f) => fs.existsSync(path.resolve(process.cwd(), f ?? "")))
        .pop();

      if (!filePath)
        return consola.warn(
          "Sanity Generator config missing. Use --config <filename>  run init to generate a config file."
        );

      const configObject = require(path.resolve(process.cwd(), filePath)).default;
      generate(configObject);
    } catch (e) {
      consola.error(e);
    }
  });

program.command("init [filename]", "Creates a blank config file as a startnig point.").action((filename) => {
  const templatePath = path.resolve(__dirname, "../static/templates/config.ts");
  const outPath = path.resolve(process.cwd(), filename ?? "sanity-generator.config.js");

  fs.copyFileSync(templatePath, outPath);
});

program.parse(process.argv);
