/** A tiny front-matter reader: `key: value` lines between two `---` lines. No nesting, no lists. */

export type FrontMatter = { data: Record<string, string>; body: string };

export class FrontMatterError extends Error {}

const FENCE = "---";

function unquote(value: string): string {
  const quote = value[0];
  if ((quote === '"' || quote === "'") && value.length >= 2 && value.endsWith(quote)) return value.slice(1, -1);
  return value;
}

export function parseFrontMatter(raw: string): FrontMatter {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  if (lines[0]?.trim() !== FENCE) throw new FrontMatterError("the file does not start with a --- line");
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === FENCE);
  if (end < 0) throw new FrontMatterError("the front matter is not closed by a second --- line");
  const data: Record<string, string> = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon <= 0) throw new FrontMatterError(`front matter line without a "key: value" form: ${line}`);
    const key = line.slice(0, colon).trim();
    if (!/^[a-zA-Z][\w-]*$/.test(key)) throw new FrontMatterError(`invalid front matter key: ${key}`);
    if (key in data) throw new FrontMatterError(`front matter key given twice: ${key}`);
    data[key] = unquote(line.slice(colon + 1).trim());
  }
  return { data, body: lines.slice(end + 1).join("\n").replace(/^\n+/, "") };
}
