import { describe, expect, it } from "vitest";
import { GATE_FULL_CLIP, gateDestination, gateStartClip, usesPaperGate } from "./paperGate";

describe("usesPaperGate", () => {
  it("applies to the Feng Shui portal only", () => {
    expect(usesPaperGate("fengshui", false)).toBe(true);
    expect(usesPaperGate("tech", false)).toBe(false);
    expect(usesPaperGate("discover", false)).toBe(false);
  });

  it("is skipped with reduced motion", () => {
    expect(usesPaperGate("fengshui", true)).toBe(false);
  });
});

describe("gateDestination", () => {
  it("adds the trailing slash a static export needs", () => {
    expect(gateDestination("/fengshui")).toBe("/fengshui/");
  });

  it("keeps an existing trailing slash", () => {
    expect(gateDestination("/fengshui/")).toBe("/fengshui/");
  });
});

describe("gateStartClip", () => {
  const viewport = { width: 1200, height: 800 };

  it("insets the viewport down to the frame rectangle", () => {
    expect(gateStartClip({ left: 100, top: 50, right: 400, bottom: 750 }, viewport, 24)).toBe("inset(50px 800px 50px 100px round 24px)");
  });

  it("never produces a negative inset when the frame sticks out of the viewport", () => {
    expect(gateStartClip({ left: -20, top: -5, right: 1250, bottom: 810 }, viewport, 8)).toBe("inset(0px 0px 0px 0px round 8px)");
  });

  it("rounds fractional pixels", () => {
    expect(gateStartClip({ left: 10.4, top: 20.6, right: 300, bottom: 400 }, viewport, 0)).toBe("inset(21px 900px 400px 10px round 0px)");
  });

  it("ends fully open with square corners", () => {
    expect(GATE_FULL_CLIP).toBe("inset(0px 0px 0px 0px round 0px)");
  });
});
