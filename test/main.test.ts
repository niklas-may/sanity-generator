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
const testConfigs = [{ fileName: "generator-config-base.ts" }, { fileName: "generator-config-external-resolver.ts" }];

describe.each(testConfigs)(`Run CLI from ${testSource} with $fileName`, async ({ fileName }) => {
  test("Generate with custom config should work", async () => {
    return await execProm(`npx ts-node ${testSource}  generate --config test/ressources/${fileName}`).then((res: any) =>
      expect(res.stderr).toBe("")
    );
  });

  for (const name of Object.keys(config.queries)) {
    const filePath = path.join(options.outPath, "queries", `${paramCase(name)}.ts`);

    test(`Query file should exist`, () => {
      return expect(fs.existsSync(filePath)).toBe(true);
    });

    test(`Query file should compile`, async () => {
      return await import(filePath).then((module) => expect(module[name]).toBeDefined());
    });

    test(`Query file should have reference query`, () => {
      return expectTypeOf(referenceConfig.queries[name]).toBeString();
    });

    test(
      "Query result should match reference",
      async () => {
        const params = { lang: "en" };

        return Promise.all([
          import(filePath).then(async (module) => {
            const data = await client.fetch(module[name], params);
            return data;
          }),
          client.fetch(referenceConfig.queries[name], params),
        ]).then(([res, resReference]) => {
          return expect(res).toStrictEqual(resReference);
        });
      },
      { retry: 3 }
    );
  }
});

const execProm = util.promisify(exec);

const client = new PicoSanity({
  projectId: "gmpiajy6",
  dataset: "test-suite",
  apiVersion: "2023-09-23",
  useCdn: false,
});
