import { describe, expect, it } from "vitest";
import { cycleIndex, parsePillar, ringPoint, SAMPLE_CYCLE, SLOTS } from "./anatomy-math";

describe("chart anatomy", () => {
  it("walks the eight places pillar by pillar", () => {
    expect(SLOTS).toHaveLength(8);
    expect(SLOTS[0]).toEqual({ pillar: 0, part: "stem" });
    expect(SLOTS[1]).toEqual({ pillar: 0, part: "branch" });
    expect(SLOTS[7]).toEqual({ pillar: 3, part: "branch" });
  });

  it("reads a pillar's stem and branch numbers", () => {
    expect(parsePillar("甲子")).toEqual({ stem: 0, branch: 0 });
    expect(parsePillar("癸亥")).toEqual({ stem: 9, branch: 11 });
  });

  it("finds the place in the sixty-pair cycle", () => {
    expect(cycleIndex(0, 0)).toBe(0); // Giáp Tý
    expect(cycleIndex(9, 11)).toBe(59); // Quý Hợi
    expect(cycleIndex(0, 6)).toBe(30); // Giáp Ngọ
    expect(cycleIndex(0, 1)).toBeNull(); // a yang stem never meets a yin branch
  });

  it("places the sample chart's pillars", () => {
    // Ất Hợi, Mậu Tý, Giáp Ngọ, Canh Ngọ
    expect(SAMPLE_CYCLE).toEqual([11, 24, 30, 6]);
  });

  it("puts place 0 at the top and place 15 at the right", () => {
    const top = ringPoint(0, 10);
    expect(top.x).toBeCloseTo(0);
    expect(top.y).toBeCloseTo(-10);
    const right = ringPoint(15, 10);
    expect(right.x).toBeCloseTo(10);
    expect(right.y).toBeCloseTo(0);
  });
});
