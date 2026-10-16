/** The value shown `progress` (0 to 1) of the way through a count-up: fast at first, settling on `value`. */
export function countAt(value: number, progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  return Math.round(value * (1 - Math.pow(1 - t, 3)));
}

/** A whole number with a thousands separator: 518400 becomes "518.400" with "." and "518,400" with ",". */
export function groupDigits(value: number, separator: string): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
