import { BRANCHES_HAN, STEMS_HAN } from "@kit/solar";
import { SAMPLE_PILLARS } from "./scene-math";

/** A chart is four pillars (year, month, day, hour), each a stem over a branch: eight places to look at. */
export type AnatomySlot = { pillar: number; part: "stem" | "branch" };

/** The eight places in the order the section walks through them: each pillar's stem, then its branch. */
export const SLOTS: readonly AnatomySlot[] = [0, 1, 2, 3].flatMap((pillar) => [
  { pillar, part: "stem" as const },
  { pillar, part: "branch" as const },
]);

/** Stem and branch numbers (0 is Giáp, 0 is Tý) of a two-character pillar such as the sample's. */
export function parsePillar(han: string): { stem: number; branch: number } {
  const [stem = "", branch = ""] = han.split("");
  return { stem: STEMS_HAN.indexOf(stem), branch: BRANCHES_HAN.indexOf(branch) };
}

/**
 * Where a pillar stands in the sixty-pair cycle, 0 for Giáp Tý to 59 for Quý Hợi, or null for a pair that does not exist
 * (a yang stem only joins a yang branch). The cycle takes one stem and one branch forward at each step.
 */
export function cycleIndex(stem: number, branch: number): number | null {
  for (let n = 0; n < 60; n += 1) if (n % 10 === stem && n % 12 === branch) return n;
  return null;
}

/** Point on a ring of 60 places for cycle index `n`, starting at the top and running clockwise. */
export function ringPoint(n: number, radius: number, center = 0): { x: number; y: number } {
  const angle = (n / 60) * Math.PI * 2 - Math.PI / 2;
  // Rounded so the server and the browser print the same attribute text; the last float digits differ between engines.
  const round = (value: number): number => Math.round(value * 1000) / 1000;
  return { x: round(center + radius * Math.cos(angle)), y: round(center + radius * Math.sin(angle)) };
}

/** Cycle indices of the four sample pillars. */
export const SAMPLE_CYCLE: readonly number[] = SAMPLE_PILLARS.map((han) => {
  const { stem, branch } = parsePillar(han);
  return cycleIndex(stem, branch) ?? 0;
});
