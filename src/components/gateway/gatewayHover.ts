/**
 * Pure rules of the gateway's hover guide: how wide the hovered window grows, which globes dim, where the astronaut stands
 * and how his speech is typed. No DOM here.
 *
 * The hovered window grows where it stands (the row is centred, so it widens on both sides and always still covers the
 * pointer) and the other two are pushed aside. Moving the pointer out of it brings everything back.
 */

/** Opacity of a globe: full for the active one (and for all when none is), dimmed for the rest. */
export function globeOpacity(slot: number, active: number | null, dimmed: number): number {
  return active === null || slot === active ? 1 : dimmed;
}

/** The astronaut stands on the side away from the hovered window, so he never covers it. The middle window sends him right. */
export function astronautSide(active: number | null): "left" | "right" {
  return active === 2 ? "left" : "right";
}

/** The width of a window that has grown: `base` is a CSS length (a clamp() is fine) and `factor` how many times wider it gets. */
export function expandedWidth(base: string, factor: number): string {
  return `calc(${base} * ${factor})`;
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

