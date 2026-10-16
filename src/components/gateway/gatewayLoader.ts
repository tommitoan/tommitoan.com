/**
 * The progress of the home page's loading ring. It follows what has really happened: the pictures and the script (a quarter),
 * the astronaut's scene (a seventh) and each of the three planets (a fifth each). Between two real steps it creeps forward a
 * little, so the ring never stands still, but it never claims more than has been done: it reaches 100 only when everything the
 * visitor is about to see is ready. It moves by time, one animation frame at a time, so a slow frame never makes it jump.
 */

/** What each part of the page adds to the ring when it is ready; the weights add up to 100. */
export const PART_WEIGHTS = { assets: 25, astronaut: 15, planet: 20 } as const;

/** How far past the finished parts the ring may creep while it waits for the next one, in percent. */
export const CREEP_RANGE = 10;

/** The ring never shows this much or more until every part is ready. */
export const WAITING_CEILING = 97;

/** A frame longer than this counts as this long, so a stalled main thread (the 3D scene starting) cannot make the ring leap. */
export const MAX_FRAME_MS = 50;

/** The fastest the ring may move, in percent per millisecond: the whole ring in about four tenths of a second. */
export const MAX_RATE = 0.25;

/** The percentage of the work that is done, from which parts are ready (`planets` counts the planets that are ready, 0 to 3). */
export function completedWork(parts: { assets: boolean; astronaut: boolean; planets: number }): number {
  const planets = Math.min(3, Math.max(0, Math.round(parts.planets)));
  return (parts.assets ? PART_WEIGHTS.assets : 0) + (parts.astronaut ? PART_WEIGHTS.astronaut : 0) + planets * PART_WEIGHTS.planet;
}

/** Where the ring is heading: the finished work plus a slow creep that restarts each time another part is done. */
export function loaderTarget(completed: number, sinceChangeMs: number): number {
  if (completed >= 100) return 100;
  const creep = CREEP_RANGE * (1 - Math.exp(-Math.max(0, sinceChangeMs) / 2500));
  return Math.min(WAITING_CEILING, completed + creep);
}

/** The next value of the ring: eases towards its target, only ever upwards, and snaps to exactly 100 when it is close. */
export function stepProgress(shown: number, completed: number, sinceChangeMs: number, frameMs: number): number {
  const dt = Math.min(Math.max(frameMs, 0), MAX_FRAME_MS);
  const target = loaderTarget(completed, sinceChangeMs);
  const tau = completed >= 100 ? 100 : 380;
  const eased = (target - shown) * (1 - Math.exp(-dt / tau));
  // Easing alone would move a long way in the first frame after a part arrives; the rate cap spreads that over a few frames.
  const next = shown + Math.min(eased, MAX_RATE * dt);
  if (completed >= 100 && next > 99.6) return 100;
  return Math.min(100, Math.max(shown, next));
}

/**
 * The number shown inside the ring: one decimal, rounded down so it never shows 100 before the ring is full ("37.4", "99.9"),
 * and a plain "100" at the end. The decimal changes several times a second while the ring moves, so it reads as continuous.
 */
export function formatPercent(shown: number): string {
  if (shown >= 100) return "100";
  const tenths = Math.floor(Math.max(0, shown) * 10) / 10;
  return tenths.toFixed(1);
}

