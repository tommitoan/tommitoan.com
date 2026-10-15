import { describe, expect, it } from "vitest";
import { countAt } from "./count-math";

describe("count-up", () => {
  it("starts at zero and ends exactly on the value", () => {
    expect(countAt(700, 0)).toBe(0);
    expect(countAt(700, 1)).toBe(700);
    expect(countAt(3, 1)).toBe(3);
  });

  it("only goes up, and is ahead of a straight line early on", () => {
    let previous = -1;
    for (let step = 0; step <= 20; step += 1) {
      const shown = countAt(60, step / 20);
      expect(shown).toBeGreaterThanOrEqual(previous);
      previous = shown;
    }
    expect(countAt(60, 0.25)).toBeGreaterThan(15);
  });

  it("stays inside the range for progress outside 0 to 1", () => {
    expect(countAt(60, -1)).toBe(0);
    expect(countAt(60, 5)).toBe(60);
  });
});
