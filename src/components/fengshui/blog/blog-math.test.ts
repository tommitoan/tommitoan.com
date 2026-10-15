import { describe, expect, it } from "vitest";
import { fillProgress, previewPosition, splitWords, wordsFilled } from "./blog-math";

const viewport = { width: 1000, height: 700 };
const preview = { width: 300, height: 120 };

describe("previewPosition", () => {
  it("sits below and to the right of the pointer", () => {
    expect(previewPosition({ x: 100, y: 100 }, preview, viewport)).toEqual({ x: 120, y: 120 });
  });

  it("flips to the left of the pointer near the right edge", () => {
    expect(previewPosition({ x: 900, y: 100 }, preview, viewport)).toEqual({ x: 580, y: 120 });
  });

  it("flips above the pointer near the bottom edge", () => {
    expect(previewPosition({ x: 100, y: 650 }, preview, viewport)).toEqual({ x: 120, y: 510 });
  });

  it("stays inside the window in the bottom-right corner", () => {
    const at = previewPosition({ x: 990, y: 690 }, preview, viewport);
    expect(at.x + preview.width).toBeLessThanOrEqual(viewport.width - 12);
    expect(at.y + preview.height).toBeLessThanOrEqual(viewport.height - 12);
  });

  it("never leaves the margin at the top-left even when flipping does not help", () => {
    expect(previewPosition({ x: 2, y: 2 }, { width: 2000, height: 2000 }, viewport)).toEqual({ x: 12, y: 12 });
  });
});

describe("fillProgress", () => {
  it("is 0 while the text is still below the fold and 1 once it has passed", () => {
    expect(fillProgress(900, 100, 800)).toBe(0);
    expect(fillProgress(-500, 100, 800)).toBe(1);
  });

  it("grows as the text moves up", () => {
    const early = fillProgress(400, 100, 800);
    const later = fillProgress(200, 100, 800);
    expect(early).toBeGreaterThan(0);
    expect(later).toBeGreaterThan(early);
    expect(later).toBeLessThan(1);
  });

  it("copes with an empty window", () => {
    expect(fillProgress(0, 0, 0)).toBe(1);
  });
});

describe("wordsFilled and splitWords", () => {
  it("rounds the share of words and keeps it inside 0 to total", () => {
    expect(wordsFilled(10, 0.5)).toBe(5);
    expect(wordsFilled(10, 2)).toBe(10);
    expect(wordsFilled(10, -1)).toBe(0);
    expect(wordsFilled(0, 0.5)).toBe(0);
  });

  it("splits on any whitespace and ignores empty pieces", () => {
    expect(splitWords("  một  hai\nba\t")).toEqual(["một", "hai", "ba"]);
    expect(splitWords("")).toEqual([]);
  });
});
