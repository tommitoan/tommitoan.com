import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FENGSHUI_ART } from "./fengshui-art";

/** Width and height of a lossy WebP, from its header; throws when the file is cut, padded or another kind of file. */
function webpSize(data: Buffer): [number, number] {
  const lossy =
    data.length >= 30 &&
    data.toString("latin1", 0, 4) === "RIFF" &&
    data.toString("latin1", 8, 12) === "WEBP" &&
    data.toString("latin1", 12, 16) === "VP8 " &&
    data[23] === 0x9d &&
    data[24] === 0x01 &&
    data[25] === 0x2a;
  if (!lossy) throw new Error("not a lossy WebP file");
  if (data.readUInt32LE(4) + 8 !== data.length) throw new Error("the RIFF length does not match the file size");
  return [data.readUInt16LE(26) & 0x3fff, data.readUInt16LE(28) & 0x3fff];
}

const publicDir = path.join(process.cwd(), "public");
const MAX_BYTES = 64 * 1024; // the page loads five of them, each only when it comes near
const ENTRIES = Object.entries(FENGSHUI_ART);

describe("the wide pictures of the Feng Shui bands", () => {
  it("has the five bands the page draws", () => {
    expect(ENTRIES.map(([key]) => key)).toEqual(["basics", "why", "roadmap", "principles", "begin"]);
  });

  for (const [key, art] of ENTRIES) {
    it(`${key}: a lossy 16:9 WebP of the declared size, between 896 and 1280 px and under ${MAX_BYTES / 1024} KB`, () => {
      expect(art.src.startsWith("/fengshui/art/")).toBe(true);
      const data = readFileSync(path.join(publicDir, art.src));
      const [width, height] = webpSize(data);
      expect([art.width, art.height], `${art.src} is ${width}x${height}`).toEqual([width, height]);
      expect(width).toBeGreaterThanOrEqual(896);
      expect(width).toBeLessThanOrEqual(1280);
      expect(Math.abs(width / height - 16 / 9) / (16 / 9)).toBeLessThan(0.03);
      expect(data.length).toBeLessThanOrEqual(MAX_BYTES);
    });
  }

  it("has no picture in the folder that the page does not draw, and no band shares a picture", () => {
    const used = ENTRIES.map(([, art]) => path.basename(art.src)).sort();
    expect(new Set(used).size).toBe(used.length);
    expect(readdirSync(path.join(publicDir, "fengshui", "art")).sort()).toEqual(used);
  });

  // A band draws its picture only if its component passes it to the heading (or, for the call to action, draws the figure itself).
  it("is drawn by the section that names it", () => {
    const section = (name: string) => readFileSync(path.join(process.cwd(), "src/components/fengshui/sections", `FengShui${name}Section.tsx`), "utf8");
    const wanted: Record<string, [string, RegExp]> = {
      basics: ["Basics", /<WorldHeading[^>]*art=\{FENGSHUI_ART\.basics\}/],
      why: ["Pillars", /<WorldHeading[^>]*art=\{FENGSHUI_ART\.why\}/],
      roadmap: ["Lanes", /<WorldHeading[^>]*art=\{FENGSHUI_ART\.roadmap\}/],
      principles: ["Principles", /<WorldHeading[^>]*art=\{FENGSHUI_ART\.principles\}/],
      begin: ["Links", /<ArtFigure art=\{FENGSHUI_ART\.begin\} \/>/],
    };
    for (const [key, [name, pattern]] of Object.entries(wanted)) {
      expect(section(name), `${name} does not draw ${key}`).toMatch(pattern);
    }
  });

  it("is a decorative figure that is lazy and has its size", () => {
    const heading = readFileSync(path.join(process.cwd(), "src/components/fengshui/world/WorldHeading.tsx"), "utf8");
    const image = heading.match(/<img [^>]*\/>/)?.[0] ?? "";
    expect(image).toContain('alt=""');
    expect(image).toContain("width={art.width}");
    expect(image).toContain("height={art.height}");
    expect(image).toContain('loading="lazy"');
  });
});
