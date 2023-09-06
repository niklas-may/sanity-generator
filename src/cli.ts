#! /usr/bin/env node

import path from "path";
import { program } from "commander";
import { main } from "./main";
import { register } from "ts-node";

register({
  compilerOptions: {
    module: "CommonJS",
  },
  require: ["tsconfig-paths/register"],
  typeCheck: false,
  transpileOnly: true,
});

program
  .name("Sanity Generator")
  .option("-c, --config <file-path>", "Path to the configuration file")
  .action(({ config }) => {
    try {
      const configObject = require(path.resolve(process.cwd(), config ?? "sanity-generator.config.ts")).default;
      main(configObject);
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
