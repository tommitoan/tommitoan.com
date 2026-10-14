// Copies the built kit (kit/dist) into the Go site so both sites run the same version.
//   node scripts/sync-kit.mjs                   copy into ../bazica-web/static/kit
//   node scripts/sync-kit.mjs --target <dir>    use another bazica-web checkout
//   node scripts/sync-kit.mjs --check           change nothing; exit 1 when the Go site is out of date
// Run `pnpm kit:build` first. Works the same on macOS, Ubuntu and Fedora.
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const targetFlag = args.indexOf("--target");
const goSite = path.resolve(targetFlag >= 0 ? args[targetFlag + 1] : path.join(root, "..", "bazica-web"));
const from = path.join(root, "kit", "dist");
const to = path.join(goSite, "static", "kit");
const COPY = ["kit.iife.js", "kit.css", "kit-boot.js", "VERSION", "manifest.json"];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

try {
  await access(path.join(goSite, "go.mod"));
} catch {
  fail(`${goSite} does not look like the Go site (no go.mod). Pass --target <dir>.`);
}

let manifest;
try {
  manifest = JSON.parse(await readFile(path.join(from, "manifest.json"), "utf8"));
} catch {
  fail("kit/dist/manifest.json is missing. Run `pnpm kit:build` first.");
}

// The dist files must match their manifest before they are copied anywhere.
for (const name of COPY.filter((file) => file !== "manifest.json")) {
  const entry = manifest.files[name];
  if (!entry) fail(`${name} is not listed in the manifest.`);
  if (sha256(await readFile(path.join(from, name))) !== entry.sha256) fail(`${name} does not match the manifest. Run \`pnpm kit:build\` again.`);
}

// The Go site gets only the files it serves, so its manifest lists exactly those files.
const served = COPY.filter((file) => file !== "manifest.json");
const goManifest = `${JSON.stringify({ version: manifest.version, files: Object.fromEntries(served.map((name) => [name, manifest.files[name]])) }, null, 2)}\n`;

let stale = 0;
for (const name of COPY) {
  const source = name === "manifest.json" ? Buffer.from(goManifest) : await readFile(path.join(from, name));
  let current = null;
  try {
    current = await readFile(path.join(to, name));
  } catch {
    /* not copied yet */
  }
  const same = current !== null && sha256(current) === sha256(source);
  if (!same) stale += 1;
  if (!check && !same) {
    await mkdir(to, { recursive: true });
    await writeFile(path.join(to, name), source);
  }
  console.log(`${same ? "same   " : check ? "STALE  " : "copied "} ${name}`);
}

if (check && stale > 0) fail(`${stale} file(s) differ from kit ${manifest.version}. Run \`pnpm kit:sync\`.`);
console.log(check ? `bazica-web is on kit ${manifest.version}` : `kit ${manifest.version} is in ${to}`);
