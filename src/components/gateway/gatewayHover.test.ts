import { describe, expect, it } from "vitest";
import { astronautSide, canGuide, globeOpacity, resolveHoverTarget, slotOffsets, turnSquash, typedText } from "./gatewayHover";

describe("hover target", () => {
  it("is the slot under the pointer when nothing is active", () => {
    for (const slot of [0, 1, 2]) expect(resolveHoverTarget(slot, null)).toBe(slot);
  });

  it("keeps the active portal when the pointer reaches the centre to click it", () => {
    expect(resolveHoverTarget(1, 0)).toBe(0);
    expect(resolveHoverTarget(1, 2)).toBe(2);
    expect(resolveHoverTarget(1, 1)).toBe(1);
  });

  it("switches at once to the portal in the left or right slot", () => {
    expect(resolveHoverTarget(2, 0)).toBe(2);
    expect(resolveHoverTarget(0, 2)).toBe(0);
  });
});

describe("globe offsets", () => {
  const centres = [100, 400, 700];

  it("moves nothing without an active portal or with the centre one", () => {
    expect(slotOffsets(null, centres)).toEqual([0, 0, 0]);
    expect(slotOffsets(1, centres)).toEqual([0, 0, 0]);
  });

  it("swaps the left globe with the centre one", () => {
    expect(slotOffsets(0, centres)).toEqual([300, -300, 0]);
  });

  it("swaps the right globe with the centre one", () => {
    expect(slotOffsets(2, centres)).toEqual([0, 300, -300]);
  });

  it("copes with a bad index or missing measurements", () => {
    expect(slotOffsets(5, centres)).toEqual([0, 0, 0]);
    expect(slotOffsets(-1, centres)).toEqual([0, 0, 0]);
    expect(slotOffsets(0, [])).toEqual([]);
  });
});

describe("dimming and the astronaut's side", () => {
  it("dims everything but the active globe", () => {
    expect(globeOpacity(0, null, 0.3)).toBe(1);
    expect(globeOpacity(0, 0, 0.3)).toBe(1);
    expect(globeOpacity(1, 0, 0.3)).toBe(0.3);
  });

  it("puts the astronaut away from the active globe", () => {
    expect(astronautSide(0)).toBe("right");
    expect(astronautSide(1)).toBe("right");
    expect(astronautSide(2)).toBe("left");
    expect(astronautSide(null)).toBe("right");
  });
});

describe("typed speech", () => {
  it("shows more of the line as time passes and then all of it", () => {
    expect(typedText("Hello", 0, 40)).toBe("");
    expect(typedText("Hello", -5, 40)).toBe("");
    expect(typedText("Hello", 50, 40)).toBe("He");
    expect(typedText("Hello", 1000, 40)).toBe("Hello");
  });
});

describe("turning round", () => {
  it("is full width at both ends and thinnest in the middle", () => {
    expect(turnSquash(0)).toBe(1);
    expect(turnSquash(1)).toBe(1);
    expect(turnSquash(0.5)).toBeCloseTo(0.04);
    expect(turnSquash(0.25)).toBeCloseTo(0.5);
    expect(turnSquash(-3)).toBe(1);
  });
});

describe("when the guide runs", () => {
  it("needs a wide screen and motion", () => {
    expect(canGuide(1440, false)).toBe(true);
    expect(canGuide(767, false)).toBe(false);
    expect(canGuide(1440, true)).toBe(false);
  });
});
