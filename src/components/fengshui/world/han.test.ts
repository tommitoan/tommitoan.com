import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BRANCHES_HAN, STEMS_HAN } from "@kit/solar";
import { SOLAR_TERMS_HAN } from "./dial-math";
import { HAN_FONT_STACK, HAN_GLYPHS, hanFontHref } from "./han";

const root = path.resolve(__dirname, "../../../..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|css)$/.test(name) && !/\.test\.ts$/.test(name) ? [full] : [];
  });
}

describe("Han font subset", () => {
  it("covers the stems, branches and solar terms with no duplicates", () => {
    for (const ch of STEMS_HAN + BRANCHES_HAN + SOLAR_TERMS_HAN.join("")) expect(HAN_GLYPHS).toContain(ch);
    expect(new Set(HAN_GLYPHS.split("")).size).toBe(HAN_GLYPHS.length);
  });

  it("builds a Google Fonts URL limited to those glyphs", () => {
    const href = hanFontHref();
    expect(href).toContain("family=Noto+Serif+SC");
    expect(href).toContain(`text=${encodeURIComponent(HAN_GLYPHS)}`);
    expect(href.length).toBeLessThan(1500);
    expect(HAN_FONT_STACK).toContain("Noto Serif SC");
  });

  it("every Han character used by the Feng Shui world is in the subset", () => {
    const files = [
      ...sourceFiles(path.join(root, "src/components/fengshui")),
      ...sourceFiles(path.join(root, "src/app/(fengshui)")),
      path.join(root, "src/content/fengshui-world.ts"),
      path.join(root, "src/content/fengshui-content.ts"),
    ];
    const missing = new Set<string>();
    for (const file of files) {
      for (const ch of readFileSync(file, "utf8").match(/[㐀-鿿]/g) ?? []) if (!HAN_GLYPHS.includes(ch)) missing.add(`${ch} in ${path.relative(root, file)}`);
    }
    expect([...missing]).toEqual([]);
  });
});
