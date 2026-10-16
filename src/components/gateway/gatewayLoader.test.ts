import { describe, expect, it } from "vitest";
import { completedWork, loaderTarget, MAX_FRAME_MS, PART_WEIGHTS, stepProgress, WAITING_CEILING } from "./gatewayLoader";

/** Runs the ring frame by frame; `completedAt(ms)` says how much work is done at a time. */
function run(totalMs: number, frameMs: number, completedAt: (ms: number) => number) {
  let shown = 0;
  let since = 0;
  let previousCompleted = completedAt(0);
  const values: number[] = [];
  let doneAt: number | null = null;
  for (let elapsed = frameMs; elapsed <= totalMs; elapsed += frameMs) {
    const completed = completedAt(elapsed);
    if (completed !== previousCompleted) {
      since = 0;
      previousCompleted = completed;
    } else since += frameMs;
    shown = stepProgress(shown, completed, since, frameMs);
    values.push(shown);
    if (shown === 100 && doneAt === null) doneAt = elapsed;
  }
  return { values, doneAt };
}

describe("loader work", () => {
  it("adds up to 100 when every part is ready", () => {
    expect(PART_WEIGHTS.assets + PART_WEIGHTS.astronaut + 3 * PART_WEIGHTS.planet).toBe(100);
    expect(completedWork({ assets: true, astronaut: true, planets: 3 })).toBe(100);
    expect(completedWork({ assets: false, astronaut: false, planets: 0 })).toBe(0);
    expect(completedWork({ assets: true, astronaut: false, planets: 2 })).toBe(65);
  });

  it("does not claim more than is done while a part is missing", () => {
    for (const completed of [0, 25, 40, 65, 85]) {
      expect(loaderTarget(completed, 1e9)).toBeLessThanOrEqual(Math.min(WAITING_CEILING, completed + 10));
    }
    expect(loaderTarget(85, 1e9)).toBeLessThan(100);
  });
});

describe("loader progress", () => {
  it("never reaches 100 while a part is still missing, however long it takes", () => {
    const { values } = run(60_000, 16, (ms) => (ms < 500 ? 0 : 85));
    expect(values[values.length - 1]).toBeLessThan(100);
    expect(values[values.length - 1]).toBeLessThanOrEqual(WAITING_CEILING);
  });

  it("only goes up and moves in small steps at 60 frames a second", () => {
    const { values } = run(8000, 16, (ms) => (ms < 400 ? 0 : ms < 900 ? 25 : ms < 1500 ? 40 : ms < 2200 ? 60 : ms < 3000 ? 80 : 100));
    let previous = 0;
    let biggest = 0;
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(previous);
      biggest = Math.max(biggest, value - previous);
      previous = value;
    }
    expect(biggest).toBeLessThan(4.2);
    expect(values[values.length - 1]).toBe(100);
  });

  it("runs on to exactly 100 within a second of the last part", () => {
    const { doneAt } = run(10_000, 16, (ms) => (ms < 3000 ? 80 : 100));
    expect(doneAt).not.toBeNull();
    expect(doneAt as number).toBeLessThan(3000 + 1000);
    expect(doneAt as number).toBeGreaterThan(3000);
  });

  it("does not leap when one frame is very long", () => {
    const calm = stepProgress(30, 25, 1000, 16);
    const stalled = stepProgress(30, 25, 1000, 2000);
    const cap = stepProgress(30, 25, 1000, MAX_FRAME_MS);
    expect(stalled).toBeCloseTo(cap, 10);
    expect(stalled - 30).toBeLessThan(10);
    expect(calm).toBeGreaterThanOrEqual(30);
  });
});
