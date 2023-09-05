import path from "path";
import { main } from "./main";

export function cli() {
  const config = require(path.resolve(process.cwd(), "sanity-generator.config.ts")).default;
  if (config) {
    main(config);
  }
}

cli()
