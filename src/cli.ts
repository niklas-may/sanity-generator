import path from "path";
import { program } from "commander";
import { main } from "./main";

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
