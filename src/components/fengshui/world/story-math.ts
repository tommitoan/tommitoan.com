import { clamp } from "@kit/color";

/** Which of `steps` equal parts of a pinned section's progress (0 to 1) is current. */
export function storyStep(progress: number, steps: number): number {
  if (steps <= 0) return 0;
  return Math.min(steps - 1, Math.floor(clamp(progress, 0, 1) * steps));
}

/** Rotation of the ring in degrees, three quarters of a turn over the whole section. */
export const ringRotation = (progress: number): number => clamp(progress, 0, 1) * 270;

/** Share of the pinned section that each step takes; the rest at the end holds the finished chart before the page moves on. */
export const STEP_SPAN = 0.2;
/** A pillar's card appears this far before its step ends. */
const CARD_LEAD = 0.05;

export interface StoryView {
  /** The step being told, 0 to steps - 1. */
  step: number;
  /** How many pillar cards are on show: one more each time a step is done, all four before the section ends. */
  cards: number;
}

/**
 * The story's timeline: each of `steps` steps takes STEP_SPAN of the progress, the card of a pillar appears just before its
 * step is done, and once all cards are on show the section holds for the last fifth before it lets go.
 */
export function storyView(progress: number, steps = 4): StoryView {
  const p = clamp(progress, 0, 1);
  const step = Math.min(steps - 1, Math.floor(p / STEP_SPAN));
  let cards = 0;
  for (let k = 0; k < steps; k++) if (p >= STEP_SPAN * (k + 1) - CARD_LEAD) cards = k + 1;
  return { step, cards };
}
