/**
 * Pure rules of the gateway's hover guide: how wide the hovered window grows, which globes dim, where the astronaut stands
 * and how his speech is typed. No DOM here.
 *
 * The hovered window grows where it stands and the other two give way, so the three together always take the same width. The
 * row therefore never moves or widens, the grown window always still covers the pointer, and the astronaut has one place to
 * stand, in the free space beside the row. Moving the pointer out of it brings everything back.
 */

/** Opacity of a globe: full for the active one (and for all when none is), dimmed for the rest. */
export function globeOpacity(slot: number, active: number | null, dimmed: number): number {
  return active === null || slot === active ? 1 : dimmed;
}

/** The astronaut always stands on the right, in the space beside the row, whichever window is under the pointer. */
export function astronautSide(): "right" {
  return "right";
}

/** The resting width of a window in pixels at a window width: the config's clamp(10.5rem, 15.5vw, 20.5rem). */
export function restingWindowWidth(viewportWidth: number): number {
  return Math.min(20.5 * 16, Math.max(10.5 * 16, viewportWidth * 0.155));
}

/**
 * How many times wider the hovered window grows. A grown window needs about `neededPx` to lay out its text, so on a small
 * screen, where the windows are narrow, it grows more (up to `maxFactor`); on a large one `minFactor` is already enough.
 */
export function hoverExpandFactor(viewportWidth: number, minFactor = 1.8, maxFactor = 2, neededPx = 340): number {
  return Math.min(maxFactor, Math.max(minFactor, neededPx / restingWindowWidth(viewportWidth)));
}

/** How wide each of the other two windows is, as a multiple of its resting width, when one grows by `expandFactor`: the three still add up to three windows. */
export function squeezeFactor(expandFactor: number): number {
  return (3 - expandFactor) / 2;
}

/** The width of a window while `hovered` is the window under the pointer (null: none). `base` is a CSS length; the sum of the three widths stays the same. */
export function windowWidth(base: string, slot: number, hovered: number | null, expandFactor: number): string {
  if (hovered === null) return base;
  return multiplied(base, slot === hovered ? expandFactor : squeezeFactor(expandFactor));
}

function multiplied(base: string, factor: number): string {
  return `calc(${base} * ${Number(factor.toFixed(4))})`;
}

/** The width of a window that has grown: `base` is a CSS length (a clamp() is fine) and `factor` how many times wider it gets. */
export function expandedWidth(base: string, factor: number): string {
  return multiplied(base, factor);
}

/** How much of the line is on screen after `elapsedMs` of typing at `charsPerSecond`. */
export function typedText(text: string, elapsedMs: number, charsPerSecond: number): string {
  if (elapsedMs <= 0) return "";
  const count = Math.floor((elapsedMs / 1000) * charsPerSecond);
  return count >= text.length ? text : text.slice(0, count);
}

/**
 * Horizontal squash of the astronaut while he turns round: 1 when he faces away, 0 halfway (the picture is swapped there),
 * 1 again when he faces the visitor. `progress` runs from 0 to 1.
 */
export function turnSquash(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return Math.max(0.04, Math.abs(1 - 2 * p));
}

/** The hover guide needs a pointer, room beside the globes, and motion. Phones and reduced motion keep the plain gateway. */
export function canGuide(viewportWidth: number, reducedMotion: boolean): boolean {
  return !reducedMotion && viewportWidth >= 768;
}

/**
 * How the astronaut is carried while he is pulled into a portal: he keeps facing the visitor, leans a little toward the side of
 * the portal (`direction` is -1, 0 or 1) as the pull grows, and struggles with a small, quickening wobble. Returns the tilt in
 * radians. `progress` is the pull, 0 to 1; `timeSeconds` drives the wobble.
 */
export function pulledTilt(direction: number, progress: number, timeSeconds: number, lean = 0.32, wobble = 0.05): number {
  const p = Math.min(1, Math.max(0, progress));
  return -direction * lean * p + Math.sin(timeSeconds * (10 + 14 * p)) * wobble * p;
}

