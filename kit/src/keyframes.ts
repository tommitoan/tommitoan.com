import { seg, smoothstep } from "./color";

export interface FrameBlend {
  from: number;
  to: number;
  /** 0 shows `from` only, 1 shows `to` only. */
  t: number;
}

/**
 * Which two keyframes to show for an age, and how much of the second.
 * The crossfade only happens in the middle of each interval (`hold` is the share where it starts and ends),
 * so very different poses do not stay overlapped for long.
 * `ages` must be sorted ascending.
 */
export function blendFrames(age: number, ages: readonly number[], hold: readonly [number, number] = [0.38, 0.62]): FrameBlend {
  const last = ages.length - 1;
  if (last < 0) throw new Error("blendFrames needs at least one keyframe age");
  if (age <= ages[0]) return { from: 0, to: 0, t: 0 };
  if (age >= ages[last]) return { from: last, to: last, t: 0 };
  let i = 0;
  for (let k = 0; k < last; k++) if (age >= ages[k]) i = k;
  const raw = (age - ages[i]) / (ages[i + 1] - ages[i]);
  return { from: i, to: i + 1, t: smoothstep(seg(raw, hold[0], hold[1])) };
}
