import { describe, expect, it } from "vitest";
import { clockView, doubleHour, formatCountdown } from "./clock-math";

// Local time on purpose: the clock reads the visitor's own clock.
const at = (hours: number, minutes: number, seconds = 0): Date => new Date(2026, 9, 15, hours, minutes, seconds);

describe("double-hours", () => {
  it("names the twelve with their clock ranges, Tý across midnight", () => {
    expect(doubleHour(0)).toMatchObject({ name: "Tý", range: "23:00–01:00" });
    expect(doubleHour(8)).toMatchObject({ name: "Thân", range: "15:00–17:00" });
    expect(doubleHour(11)).toMatchObject({ name: "Hợi", range: "21:00–23:00" });
  });

  it("wraps indexes in both directions", () => {
    expect(doubleHour(12).name).toBe("Tý");
    expect(doubleHour(-1).name).toBe("Hợi");
  });
});

describe("clock view", () => {
  it("is in Thân from 15:00 to 17:00 and counts down to 17:00", () => {
    const view = clockView(at(15, 58, 0));
    expect(view.current).toMatchObject({ name: "Thân", remainingSeconds: 62 * 60 });
    expect(view.previous.name).toBe("Mùi");
    expect(view.next.name).toBe("Dậu");
    expect(view.current.progress).toBeCloseTo(1 - 3720 / 7200, 6);
  });

  it("counts seconds too", () => {
    expect(clockView(at(15, 58, 30)).current.remainingSeconds).toBe(62 * 60 - 30);
  });

  it("starts a new double-hour at the boundary instead of showing zero", () => {
    const view = clockView(at(17, 0, 0));
    expect(view.current).toMatchObject({ name: "Dậu", remainingSeconds: 7200, progress: 0 });
    expect(view.previous.name).toBe("Thân");
    expect(clockView(at(16, 59, 59)).current).toMatchObject({ name: "Thân", remainingSeconds: 1 });
  });

  it("crosses midnight inside Tý", () => {
    expect(clockView(at(23, 30, 0)).current).toMatchObject({ name: "Tý", remainingSeconds: 90 * 60 });
    expect(clockView(at(0, 30, 0)).current).toMatchObject({ name: "Tý", remainingSeconds: 30 * 60 });
    expect(clockView(at(0, 30, 0)).previous.name).toBe("Hợi");
  });
});

describe("countdown text", () => {
  it("is mm:ss, with minutes up to three digits", () => {
    expect(formatCountdown(62 * 60 + 5)).toBe("62:05");
    expect(formatCountdown(7200)).toBe("120:00");
    expect(formatCountdown(59)).toBe("00:59");
    expect(formatCountdown(-4)).toBe("00:00");
    expect(formatCountdown(61.9)).toBe("01:01");
  });
});
