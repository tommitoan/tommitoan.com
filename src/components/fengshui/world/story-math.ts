import { clamp } from "@kit/color";

/** Which of `steps` equal parts of a pinned section's progress (0 to 1) is current. */
export function storyStep(progress: number, steps: number): number {
  if (steps <= 0) return 0;
  return Math.min(steps - 1, Math.floor(clamp(progress, 0, 1) * steps));
}

/** Rotation of the ring in degrees, three quarters of a turn over the whole section. */
export const ringRotation = (progress: number): number => clamp(progress, 0, 1) * 270;
