import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ErrorView } from "./ErrorView";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? sourceFiles(full) : /\.tsx$/.test(name) ? [full] : [];
  });
}

describe("pages that draw the world header", () => {
  // The header holds the theme button, which does nothing outside a ThemeProvider (the 404 page once shipped that way).
  it("sit inside a ThemeProvider", () => {
    const pages = sourceFiles(path.join(process.cwd(), "src/app")).filter((file) => readFileSync(file, "utf8").includes("<WorldHeader"));
    expect(pages.length).toBeGreaterThanOrEqual(2);
    for (const file of pages) {
      const source = readFileSync(file, "utf8");
      expect(source, path.relative(process.cwd(), file)).toMatch(/<ThemeProvider>[\s\S]*<WorldHeader[\s\S]*<\/ThemeProvider>/);
    }
  });
});

describe("ErrorView", () => {
  it("offers the way home and the world on a missing page, and no retry", () => {
    const html = renderToStaticMarkup(createElement(ErrorView, { kind: "notFound" }));
    expect(html).toContain("fs-error");
    expect(html).toContain('href="/"');
    expect(html).toMatch(/href="\/fengshui\/?"/);
    expect(html).not.toContain("<button");
  });

  it("offers a retry on a failed render", () => {
    const html = renderToStaticMarkup(createElement(ErrorView, { kind: "error", onRetry: () => {} }));
    expect(html).toContain("<button");
    expect(html).toContain('href="/"');
  });
});
