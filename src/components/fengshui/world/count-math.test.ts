import { describe, expect, it } from "vitest";
import { countAt, groupDigits } from "./count-math";

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

describe("figures on the reasons cards", () => {
  it("groups digits with the chosen separator", () => {
    expect(groupDigits(518400, ".")).toBe("518.400");
    expect(groupDigits(255669, ",")).toBe("255,669");
    expect(groupDigits(400, ".")).toBe("400");
    expect(groupDigits(10, ",")).toBe("10");
    expect(groupDigits(1000, ",")).toBe("1,000");
  });

  it("518,400 is the number of different charts: 60 year pillars, 12 months, 60 days, 12 hours", () => {
    expect(60 * 12 * 60 * 12).toBe(518400);
  });

  it("255,669 is the number of days from 1 January 1700 to 31 December 2399", () => {
    const days = (Date.UTC(2399, 11, 31) - Date.UTC(1700, 0, 1)) / 86400000 + 1;
    expect(days).toBe(255669);
  });
});
