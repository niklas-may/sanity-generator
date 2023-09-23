import { format } from "groqfmt-nodejs";
import { consola } from "consola";

function getPart(str: string, regex: RegExp) {
  const match = str?.match(regex);
  const msg = match ? match[1] : null;

  return msg;
}

function getIndex(input: string) {
  const regex = /positions (\d+)\.\.(\d+)/;
  const match = input.match(regex);

  if (match) {
    const startPosition = parseInt(match[1]);
    const endPosition = parseInt(match[2]);

    if (!startPosition || !endPosition) return false;
    const capturedText = [startPosition, endPosition];
    return capturedText;
  } else {
    console.log("No match found.");
  }
}

function colorizeSubstring(source, startIndex, endIndex) {
  const beforeIndex = source.slice(0, startIndex);
  const coloredSubstring = `\x1b[1;31m${source.slice(startIndex, endIndex)}\x1b[0m`;
  const afterIndex = source.slice(endIndex);
  return beforeIndex + coloredSubstring + afterIndex;
}

export async function prettifyGroq(code: string) {
  try {
    return await format(String(code).trim());
  } catch (e: any) {
    const query = getPart(String(e), /echo\s+"([^"]+)"/);
    const msg = getPart(String(e), /parsing query:\s+parse\s+error\s(.+)/);
    const range = getIndex(String(e));

    const queryHighlighted = query && Array.isArray(range) ? colorizeSubstring(query, range[0], range[1]) : query;

    consola.error("Groq Syntx Errror", msg || e, queryHighlighted);

    process.exit(1);
  }
}
