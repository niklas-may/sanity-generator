import path from "path";
import * as prettier from "prettier";
import { promises, mkdirSync, existsSync } from "fs";

export function createMissingDirectories(targetPath: string) {
  const folders = path.join(targetPath, '/').split(path.sep).filter(Boolean);
  let currentPath = "";

  for (const folder of folders) {
    currentPath = path.join(currentPath, '/', folder);

    if (!existsSync(currentPath)) {
      mkdirSync(currentPath);
    }
  }
}

export async function prettifyTypeScript(code: string) {
  return await prettier.format(code, { parser: "babel-ts" });
}

export async function writeTypeScript(filePath: string, code: string) {
  const content = await prettifyTypeScript(code);
  return await promises.writeFile(filePath, content);
}
