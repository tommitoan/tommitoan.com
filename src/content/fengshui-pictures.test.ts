import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { nayinImage } from "./fengshui-nayin";
import { branchImage } from "./fengshui-branches";
import { stemImage } from "./fengshui-stems";
import { termImage } from "./fengshui-terms";

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

const read = (url: string): Buffer => readFileSync(path.join(process.cwd(), "public", url));

// The pictures are the square exports of the paintings of the sister site's knowledge pages. The world draws them with `height: auto` or a square
// frame, so a picture of another shape would be stretched or cropped.
const KINDS = [
  { name: "solar terms", count: 24, url: termImage, smallest: 192 },
  { name: "heavenly stems", count: 10, url: stemImage, smallest: 384 },
  { name: "earthly branches", count: 12, url: branchImage, smallest: 288 },
  { name: "Nayin", count: 30, url: nayinImage, smallest: 288 },
] as const;

describe("fengshui world pictures", () => {
  for (const kind of KINDS) {
    it(`has ${kind.count} square WebP pictures of the ${kind.name}, none smaller than ${kind.smallest} px`, () => {
      for (let index = 0; index < kind.count; index += 1) {
        const [width, height] = webpSize(read(kind.url(index)));
        expect(width, `${kind.url(index)} is ${width}x${height}`).toBe(height);
        expect(width).toBeGreaterThanOrEqual(kind.smallest);
      }
    });
  }
});
