import { format } from "groqfmt-nodejs";
import { consola } from "consola";

function getPart(str: string, regex: RegExp) {
  const match = str?.match(regex);
  const msg = match ? match[1] : null;

  return msg;
}

export async function prettifyGroq(code: string) {
  try {
    return await format(String(code).trim());
  } catch (e: any) {
    const query = getPart(String(e), /echo\s+"([^"]+)"/);
    const msg = getPart(String(e), /parsing query:\s+parse\s+error\s(.+)/);

    consola.error("Groq Syntx Errror", msg, query);

    return "";
  }
}
