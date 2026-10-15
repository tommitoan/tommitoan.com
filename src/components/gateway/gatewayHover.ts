/**
 * Pure rules of the gateway's hover guide: which portal is active, where the three globes go, and how the astronaut's
 * speech is typed. No DOM here.
 *
 * The three portals sit in static slots (left, centre, right). The slot under the pointer picks the active portal, so the
 * choice does not flicker when a globe glides away from under the cursor. The active globe moves to the centre and the
 * globe that was in the centre takes its place; the others dim.
 */

export const CENTRE_SLOT = 1;

/**
 * The portal a pointer in `slot` means. While another portal is active, its globe stands in the centre slot, so a pointer
 * moving there to click it must keep it active instead of switching to the portal that used to sit in the centre.
 */
export function resolveHoverTarget(slot: number, current: number | null): number {
  if (slot === CENTRE_SLOT && current !== null && current !== CENTRE_SLOT) return current;
  return slot;
}

/**
 * How far each globe moves sideways, in the same unit as `centres` (the x of each slot's middle). The active globe goes to the
 * centre, the centre globe goes to the active slot, and the third stays. With nothing active, or the centre active, nothing moves.
 */
export function slotOffsets(active: number | null, centres: readonly number[]): number[] {
  const offsets = centres.map(() => 0);
  if (active === null || active === CENTRE_SLOT || active < 0 || active >= centres.length) return offsets;
  const centre = centres[CENTRE_SLOT];
  const own = centres[active];
  if (centre === undefined || own === undefined) return offsets;
  offsets[active] = centre - own;
  offsets[CENTRE_SLOT] = own - centre;
  return offsets;
}

/** Opacity of a globe: full for the active one (and for all when none is), dimmed for the rest. */
export function globeOpacity(slot: number, active: number | null, dimmed: number): number {
  return active === null || slot === active ? 1 : dimmed;
}

/** The astronaut stands on the side away from the active globe, so he never covers it. The centre globe sends him right. */
export function astronautSide(active: number | null): "left" | "right" {
  return active === 2 ? "left" : "right";
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
