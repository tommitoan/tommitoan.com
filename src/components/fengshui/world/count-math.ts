/** The value shown `progress` (0 to 1) of the way through a count-up: fast at first, settling on `value`. */
export function countAt(value: number, progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  return Math.round(value * (1 - Math.pow(1 - t, 3)));
}
