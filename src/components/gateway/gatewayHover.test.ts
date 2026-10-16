import { describe, expect, it } from "vitest";
import { astronautSide, canGuide, hoverExpandFactor, restingWindowWidth, expandedWidth, globeOpacity, pulledTilt, squeezeFactor, turnSquash, typedText, windowWidth } from "./gatewayHover";

describe("window width", () => {
  it("multiplies any CSS length, including a clamp()", () => {
    expect(expandedWidth("20rem", 1.9)).toBe("calc(20rem * 1.9)");
    expect(expandedWidth("clamp(10.5rem, 15.5vw, 20.5rem)", 2)).toBe("calc(clamp(10.5rem, 15.5vw, 20.5rem) * 2)");
  });
});

describe("accordion widths", () => {
  it("makes the three windows add up to the same width whichever one is hovered", () => {
    for (const factor of [1.5, 1.8, 2]) {
      expect(factor + 2 * squeezeFactor(factor)).toBeCloseTo(3);
    }
  });

  it("leaves every window alone when none is hovered, and grows only the hovered one", () => {
    expect(windowWidth("20rem", 1, null, 1.8)).toBe("20rem");
    expect(windowWidth("20rem", 1, 1, 1.8)).toBe("calc(20rem * 1.8)");
    expect(windowWidth("20rem", 0, 1, 1.8)).toBe("calc(20rem * 0.6)");
    expect(windowWidth("20rem", 2, 1, 1.8)).toBe("calc(20rem * 0.6)");
  });
});

describe("how far the hovered window grows", () => {
  it("follows the config's clamp for the resting width", () => {
    expect(restingWindowWidth(400)).toBe(168);
    expect(restingWindowWidth(1440)).toBeCloseTo(223.2);
    expect(restingWindowWidth(4000)).toBe(328);
  });

  it("grows more on a small screen so the text still has room, and never past the limits", () => {
    expect(hoverExpandFactor(1440)).toBe(1.8);
    expect(hoverExpandFactor(1920)).toBe(1.8);
    expect(hoverExpandFactor(1024)).toBeGreaterThan(1.9);
    expect(hoverExpandFactor(768)).toBe(2);
    // The other two windows still keep a usable width.
    expect(squeezeFactor(hoverExpandFactor(768))).toBeGreaterThanOrEqual(0.5);
  });
});

describe("dimming and the astronaut's side", () => {
  it("dims everything but the active globe", () => {
    expect(globeOpacity(0, null, 0.3)).toBe(1);
    expect(globeOpacity(0, 0, 0.3)).toBe(1);
    expect(globeOpacity(1, 0, 0.3)).toBe(0.3);
  });

  it("keeps the astronaut on the right whichever window is hovered", () => {
    expect(astronautSide()).toBe("right");
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

describe("being pulled into a portal", () => {
  it("does not tilt before the pull starts", () => {
    expect(pulledTilt(1, 0, 3)).toBeCloseTo(0, 10);
    expect(pulledTilt(-1, 0, 7)).toBeCloseTo(0, 10);
  });

  it("leans toward the portal's side, and not at all for the middle one", () => {
    // with the wobble at zero the lean is exact: left (-1) leans one way, right (1) the other
    expect(pulledTilt(1, 1, 0, 0.3, 0)).toBeCloseTo(-0.3, 10);
    expect(pulledTilt(-1, 1, 0, 0.3, 0)).toBeCloseTo(0.3, 10);
    expect(pulledTilt(0, 1, 0, 0.3, 0)).toBeCloseTo(0, 10);
  });

  it("keeps the wobble small and the progress inside 0 to 1", () => {
    for (let t = 0; t < 5; t += 0.1) expect(Math.abs(pulledTilt(0, 1, t))).toBeLessThanOrEqual(0.05 + 1e-9);
    expect(pulledTilt(1, 5, 0, 0.3, 0)).toBeCloseTo(-0.3, 10);
  });
});

