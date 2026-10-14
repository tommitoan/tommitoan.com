import { clamp } from "@kit/color";
import { ganzhiYear } from "@kit/solar";

/** The sixty stem-and-branch pairs, starting at Jia Zi (1984 is a Jia Zi year). */
export function sixtyCycle(startYear = 1984): string[] {
  return Array.from({ length: 60 }, (_, i) => ganzhiYear(startYear + i).han);
}

/**
 * New offset of a marquee row. `halfWidth` is the width of one copy of the content (the row holds two),
 * `direction` is -1 for leftward and 1 for rightward, and fast scrolling adds speed only on the full tier.
 * The result stays in the range (-halfWidth, 0] so the row loops without a visible jump.
 */
export function marqueeAdvance(position: number, halfWidth: number, direction: 1 | -1, dtMs: number, scrollVelocity: number, full: boolean): number {
  if (halfWidth <= 0) return 0;
  const step = direction * (0.04 * dtMs + (full ? Math.abs(scrollVelocity) * 0.6 : 0));
  let next = (position + step) % halfWidth;
  if (next > 0) next -= halfWidth;
  return next;
}

/** Leaning angle in degrees: the faster the page scrolls, the more the text slants. */
export function marqueeSkew(scrollVelocity: number, direction: 1 | -1, full: boolean): number {
  if (!full) return 0;
  return clamp(scrollVelocity * 0.35 * -direction, -14, 14);
}

/** Smooths the raw scroll speed so a single jump does not whip the marquee. */
export const smoothVelocity = (previous: number, deltaY: number): number => previous + (deltaY - previous) * 0.12;
