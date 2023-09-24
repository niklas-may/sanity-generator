import path from "path";
import * as prettier from "prettier";
import { promises, mkdirSync, existsSync } from "fs";

export function createMissingDirectories(targetPath: string) {
  mkdirSync(targetPath, { recursive: true });
}

export async function prettifyTypeScript(code: string) {
  return await prettier.format(code, { parser: "babel-ts"});
}

export async function writeTypeScript(filePath: string, code: string) {
  const content = await prettifyTypeScript(code);
  return await promises.writeFile(filePath, content);
}
