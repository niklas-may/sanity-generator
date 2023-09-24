import { type CreateConfigReturn } from "../types";
import { createServer, ModuleNode, ViteDevServer } from "vite";

export async function serveConfig(
  args: { configPath: string; watch: boolean },
  callback: (config: CreateConfigReturn<object>) => any
) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const config = await loadConfigModule(args.configPath, vite);
    const configModule = await vite.moduleGraph.getModuleByUrl(args.configPath);
    let configDeps = getDependencies(configModule);

    await callback(config);

    if (!args.watch) {
      process.exit(0);
    } else {
      vite.watcher.on("all", async (event, file) => {
        if (configDeps.has(file) || file === configModule.file) {
          await vite.reloadModule(configModule);
          const config = await loadConfigModule(args.configPath, vite);
          await callback(config);

          if (file === configModule.file) {
            configDeps = getDependencies(configModule);
          }
        }
      });
    }
  } catch (e) {
    console.log(e)
    // vite.ssrRewriteStacktrace(e);
  }
}

function getDependencies(node: ModuleNode, deps: Set<string> = new Set<string>()): Set<string> {
  deps.add(node.file);
  node.ssrImportedModules.forEach((module) =>
    module.ssrImportedModules.forEach((importedModule) => getDependencies(importedModule, deps))
  );
  return deps;
}

async function loadConfigModule(filePath: string, vite: ViteDevServer) {
  return (await vite.ssrLoadModule(filePath).then((m) => m.default)) as CreateConfigReturn<object>;
}
