#!/usr/bin/env node
/**
 * Size budgets for the static export. Run after `pnpm build`: for each page it adds up the gzip size of the
 * scripts and the stylesheets the page names, and fails when a page is over its budget. The gateway (`/`) carries
 * the 3D scene and has its own, larger budget.
 *
 *   node scripts/check-budgets.mjs          # check
 *   node scripts/check-budgets.mjs --report # print the numbers only
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const OUT = path.join(process.cwd(), "out");
const KB = 1024;

// Budgets in kilobytes of gzip, for scripts + styles together. Headroom is about 10% over the measured size.
const BUDGETS = [
  { name: "Feng Shui world home", pages: ["fengshui/index.html"], scripts: 290, styles: 24 }, // 21 KB measured: the clock, the pinned dial, the scroll cue and the Bazica card
  { name: "404 page", pages: ["404.html"], scripts: 200, styles: 24 }, // shares the world stylesheet
  { name: "Gateway (3D scene)", pages: ["index.html"], scripts: 520, styles: 16 },
  { name: "Tech and Discover pages", pages: ["tech/index.html", "discover/index.html"], scripts: 280, styles: 16 },
];
// Single files that must stay small whatever page names them.
const FILES = [
  { glob: /^\/icon\.png$|^\/apple-icon\.png$|^\/icon-192\.png$/, max: 80, label: "icons" },
  { glob: /^\/fengshui\/char\/.*\.webp$/, max: 90, label: "character frames" },
  { glob: /^\/fengshui\/terms\/.*\.webp$/, max: 30, label: "solar term paintings" },
  { glob: /^\/fengshui\/stems\/.*\.webp$/, max: 60, label: "heavenly stem paintings" },
  { glob: /^\/gateway\/.*\.webp$/, max: 600, label: "gateway images" },
];

const gz = (file) => gzipSync(readFileSync(file)).length;

function assets(html) {
  const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  const local = (list) => [...new Set(list.filter((url) => url.startsWith("/")).map((url) => url.split("?")[0]))];
  return { scripts: local(scripts), styles: local(styles) };
}

const report = process.argv.includes("--report");
const problems = [];
const line = (text) => console.log(text);

for (const budget of BUDGETS) {
  for (const page of budget.pages) {
    const file = path.join(OUT, page);
    if (!existsSync(file)) {
      problems.push(`${page}: not found in out/; run pnpm build first`);
      continue;
    }
    const { scripts, styles } = assets(readFileSync(file, "utf8"));
    const total = (urls) => urls.reduce((sum, url) => sum + (existsSync(path.join(OUT, url)) ? gz(path.join(OUT, url)) : 0), 0) / KB;
    const js = total(scripts);
    const css = total(styles);
    line(`${page.padEnd(42)} scripts ${js.toFixed(0).padStart(5)} KB / ${budget.scripts}   styles ${css.toFixed(0).padStart(3)} KB / ${budget.styles}`);
    if (js > budget.scripts) problems.push(`${page}: scripts are ${js.toFixed(0)} KB gzip, over the budget of ${budget.scripts} KB (${budget.name})`);
    if (css > budget.styles) problems.push(`${page}: styles are ${css.toFixed(0)} KB gzip, over the budget of ${budget.styles} KB (${budget.name})`);
  }
}

function walk(directory, found = []) {
  for (const name of existsSync(directory) ? readdirSync(directory) : []) {
    const full = path.join(directory, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else found.push(full);
  }
  return found;
}
for (const file of walk(OUT)) {
  const url = "/" + path.relative(OUT, file).split(path.sep).join("/");
  for (const rule of FILES) {
    if (!rule.glob.test(url)) continue;
    const size = statSync(file).size / KB;
    if (size > rule.max) problems.push(`${url}: ${size.toFixed(0)} KB, over the ${rule.max} KB limit for ${rule.label}`);
  }
}

if (problems.length && !report) {
  console.error(`\nBudget problems:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
line(problems.length ? `\n(report only) ${problems.length} problem(s):\n- ${problems.join("\n- ")}` : "\nAll budgets are met.");
