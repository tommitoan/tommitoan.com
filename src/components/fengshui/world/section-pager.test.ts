import { describe, expect, it } from "vitest";
import { type Block, easeInOutCubic, pagerTarget, wheelPixels } from "./section-pager";

const VIEWPORT = 900;
// A tall pinned scene, then three one-page bands, a tall pinned story, a one-page band and a short footer.
const blocks: Block[] = [
  { top: 0, bottom: 4680 },
  { top: 4680, bottom: 5580 },
  { top: 5580, bottom: 6480 },
  { top: 6480, bottom: 7380 },
  { top: 7380, bottom: 10440 },
  { top: 10440, bottom: 11340 },
  { top: 11340, bottom: 11600 },
];
const maxScroll = 11600 - VIEWPORT;
const target = (scrollY: number, delta: number) => pagerTarget(blocks, scrollY, VIEWPORT, maxScroll, delta);

describe("inside a tall section", () => {
  it("lets the browser scroll", () => {
    expect(target(0, 100)).toBeNull();
    expect(target(1500, 100)).toBeNull();
    expect(target(1500, -100)).toBeNull();
  });

  it("stops exactly at the last screen when the wheel would carry the page past it", () => {
    const end = 4680 - VIEWPORT;
    expect(target(end - 60, 100)).toBe(end);
    expect(target(end - 500, 100)).toBeNull();
  });

  it("then crosses to the top of the next section with the next turn", () => {
    expect(target(4680 - VIEWPORT, 100)).toBe(4680);
    expect(target(4600, 100)).toBe(4680);
  });

  it("stops at its top going up, and goes on to the end of the section above with the next turn", () => {
    expect(target(7380 + 40, -100)).toBe(7380);
    expect(target(7380, -100)).toBe(6480);
    expect(target(4680, -100)).toBe(4680 - VIEWPORT);
  });
});

describe("on a one-page section", () => {
  it("one turn down goes all the way to the next section", () => {
    expect(target(4680, 100)).toBe(5580);
    expect(target(5580, 5)).toBe(6480);
    expect(target(6480, 100)).toBe(7380);
  });

  it("one turn up goes to the previous section, to its last screen when that one is tall", () => {
    expect(target(5580, -100)).toBe(4680);
    expect(target(10440, -100)).toBe(10440 - VIEWPORT);
  });

  it("first returns to the top of the section when the page rests in the middle of it", () => {
    expect(target(5000, -100)).toBe(4680);
    expect(target(5000, 100)).toBe(5580);
  });

  it("goes down to the end of the page from the last full section, and nowhere from the end or the very top", () => {
    expect(target(10440, 100)).toBe(maxScroll);
    expect(target(maxScroll, 100)).toBeNull();
    expect(target(0, -100)).toBeNull();
  });
});

describe("helpers", () => {
  it("does nothing for no movement or no sections", () => {
    expect(target(4680, 0)).toBeNull();
    expect(pagerTarget([], 0, VIEWPORT, 1000, 100)).toBeNull();
  });

  it("reads the wheel in pixels in every unit", () => {
    expect(wheelPixels(100, 0, 900)).toBe(100);
    expect(wheelPixels(3, 1, 900)).toBe(48);
    expect(wheelPixels(1, 2, 900)).toBe(900);
  });

  it("eases from 0 to 1 and is symmetric", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
    expect(easeInOutCubic(0.25) + easeInOutCubic(0.75)).toBeCloseTo(1);
  });
});
