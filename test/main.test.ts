import { expect, test } from "vitest";
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);

export function sum(a, b) {
  return a + b;
}

test("adds 1 + 2 to equal 3", async () => {
  await execProm("npx ts-node src/cli/main generate --config test/ressources/sanity-generator.base-config.ts");
  expect(sum(1, 2)).toBe(3);
});
