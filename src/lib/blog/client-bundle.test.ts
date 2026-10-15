import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The Markdown renderer and the file loader run at build time only. If a module that the browser downloads imports them,
// the renderer (about 50 KB) is added to every page that uses the module.
const SERVER_ONLY = [/from\s+["']marked["']/, /["']\.\/markdown["']/, /["']@\/lib\/blog\/markdown["']/, /["']\.\/posts["']/, /["']@\/lib\/blog\/posts["']/, /["']@\/lib\/blog\/load["']/, /["']\.\/load["']/, /node:fs/];

const files = (directory: string): string[] =>
  readdirSync(directory).flatMap((name) => {
    const full = path.join(directory, name);
    return statSync(full).isDirectory() ? files(full) : [full];
  });

const source = (file: string): string => readFileSync(file, "utf8");

describe("the browser bundle stays free of the Markdown renderer", () => {
  it("keeps client-safe blog modules from importing server-only ones", () => {
    for (const name of ["entries.ts", "format.ts"]) {
      const text = source(path.join(__dirname, name));
      for (const pattern of SERVER_ONLY) expect(text, `${name} matches ${pattern}`).not.toMatch(pattern);
    }
  });

  it("keeps every client component away from them", () => {
    const root = path.join(process.cwd(), "src", "components");
    for (const file of files(root).filter((name) => /\.tsx?$/.test(name))) {
      const text = source(file);
      if (!/^["']use client["']/.test(text)) continue;
      for (const pattern of SERVER_ONLY) expect(text, `${path.relative(root, file)} matches ${pattern}`).not.toMatch(pattern);
    }
  });

  it("keeps the build-time modules where the pages (server components) import them", () => {
    expect(source(path.join(__dirname, "posts.ts"))).toMatch(/from\s+"\.\/markdown"/);
    expect(source(path.join(__dirname, "load.ts"))).toMatch(/node:fs/);
  });
});
