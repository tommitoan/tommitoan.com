import { describe, expect, it } from "vitest";
import { astronautSide, canGuide, expandedWidth, globeOpacity, turnSquash, typedText } from "./gatewayHover";

describe("window width", () => {
  it("multiplies any CSS length, including a clamp()", () => {
    expect(expandedWidth("20rem", 1.9)).toBe("calc(20rem * 1.9)");
    expect(expandedWidth("clamp(10.5rem, 15.5vw, 20.5rem)", 2)).toBe("calc(clamp(10.5rem, 15.5vw, 20.5rem) * 2)");
  });
});

describe("dimming and the astronaut's side", () => {
  it("dims everything but the active globe", () => {
    expect(globeOpacity(0, null, 0.3)).toBe(1);
    expect(globeOpacity(0, 0, 0.3)).toBe(1);
    expect(globeOpacity(1, 0, 0.3)).toBe(0.3);
  });

  it("puts the astronaut away from the hovered window", () => {
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
