// Builds the shared kit into kit/dist:
//   kit.iife.js   one script for sites without a bundler (global TommiKit), minified
//   kit.esm.js    ES module for bundlers
//   kit.css       tokens and styles, minified
//   kit-boot.js   tiny snippet to inline in <head>
//   VERSION       the kit version, one line
//   manifest.json file sizes and SHA-256 hashes (the sync script and the Go tests check them)
// Run: pnpm kit:build   (same on macOS, Ubuntu and Fedora)
import { build, transform } from "esbuild";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "src");
const dist = path.join(here, "dist");

const versionSource = await readFile(path.join(src, "version.ts"), "utf8");
const version = /KIT_VERSION = "([^"]+)"/.exec(versionSource)?.[1];
if (!version) throw new Error("kit/src/version.ts has no KIT_VERSION");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const banner = `/* tommitoan kit ${version} */`;
const common = { entryPoints: [path.join(src, "index.ts")], bundle: true, banner: { js: banner }, legalComments: "none", logLevel: "warning" };

await build({ ...common, outfile: path.join(dist, "kit.iife.js"), format: "iife", globalName: "TommiKit", target: "es2019", minify: true });
await build({ ...common, outfile: path.join(dist, "kit.esm.js"), format: "esm", target: "es2020", minify: false });

const css = await transform(await readFile(path.join(src, "kit.css"), "utf8"), { loader: "css", minify: true });
await writeFile(path.join(dist, "kit.css"), `/* tommitoan kit ${version} */\n${css.code}`);

const boot = await transform(await readFile(path.join(src, "boot.js"), "utf8"), { minify: true });
await writeFile(path.join(dist, "kit-boot.js"), boot.code);

await writeFile(path.join(dist, "VERSION"), `${version}\n`);

const files = (await readdir(dist)).filter((name) => name !== "manifest.json").sort();
const manifest = { version, files: {} };
for (const name of files) {
  const bytes = await readFile(path.join(dist, name));
  manifest.files[name] = { bytes: bytes.length, gzip: gzipSync(bytes).length, sha256: createHash("sha256").update(bytes).digest("hex") };
}
await writeFile(path.join(dist, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`kit ${version}`);
for (const [name, info] of Object.entries(manifest.files)) console.log(`  ${name.padEnd(14)} ${String(info.bytes).padStart(7)} B  (${info.gzip} B gzip)`);
