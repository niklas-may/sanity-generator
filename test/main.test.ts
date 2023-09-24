import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import { expect, test, expectTypeOf, describe } from "vitest";
import PicoSanity from "picosanity";
import { paramCase } from "change-case";
import generatorConfig from "./ressources/generator-config-base";
import referenceConfig from "./ressources/reference-config";

const [config, options] = generatorConfig;

const testSource = process.env.NODE_ENV === "test" ? "build/cli/main.js" : "src/cli/main";
const testConfigs = [
  { fileName: "generator-config-base.ts" },
  { fileName: "generator-config-external-resolver.ts" },
  { fileName: "generator-config-external-resolver-and-trim.ts" },
];

describe.each(testConfigs)(`Run CLI from ${testSource} with $fileName`, async ({ fileName }) => {
  test("Generate with custom config should work", async () => {
    return await execProm(`npx ts-node ${testSource}  generate --config test/ressources/${fileName}`).then((res: any) =>
      expect(res.stderr).toBe("")
    );
  });

  const queries = Object.keys(config.queries).map((queryName) => ({ queryName }));

  describe.each(queries)("Current Query: $queryName", ({ queryName }) => {
    const filePath = path.join(options.outPath, "queries", `${paramCase(queryName)}.ts`);

    test(`Should be written to disk`, () => {
      return expect(fs.existsSync(filePath)).toBe(true);
    });

    test(`Should compile when imported`, async () => {
      return await importFresh(filePath).then((module) => {
        return expect(module[queryName]).toBeDefined();
      });
    });

    test(`Should have a reference query`, () => {
      return expectTypeOf(referenceConfig.queries[queryName]).toBeString();
    });

    test(
      "Fetch result should match reference query",
      async () => {
        const params = { lang: "en" };

        return Promise.all([
          importFresh(filePath).then(async (module) => {
            const data = await client.fetch(module[queryName], params);
            return data;
          }),
          client.fetch(referenceConfig.queries[queryName], params),
        ]).then(([res, resReference]) => {
          return expect(res).toStrictEqual(resReference);
        });
      },
      { retry: 3 }
    );
  });
});

const execProm = util.promisify(exec);

const client = new PicoSanity({
  projectId: "gmpiajy6",
  dataset: "test-suite",
  apiVersion: "2023-09-23",
  useCdn: false,
});

async function importFresh(modulePath: string) {
  const cacheBustingModulePath = `${modulePath}?update=${Date.now()}`;
  return await import(cacheBustingModulePath);
}
