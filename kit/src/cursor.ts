import { clamp } from "./color";
import type { Tier } from "./env";

/** Pure rules of the pointer ring (effect 20). The ring follows the real pointer, which stays visible. No DOM here. */

export interface RingInput {
  /** The pointer is over something that can be clicked or opened. */
  interactive: boolean;
  /** Over a text field, where the real text cursor must stay in charge. */
  overField: boolean;
  pressed: boolean;
}

export interface RingTarget {
  scale: number;
  opacity: number;
}

/** Size and visibility the ring is heading for: larger over clickable things, smaller while pressed, hidden over text fields. */
export function ringTarget({ interactive, overField, pressed }: RingInput): RingTarget {
  if (overField) return { scale: 1, opacity: 0 };
  const base = interactive ? 1.7 : 1;
  return { scale: pressed ? base * 0.8 : base, opacity: interactive ? 1 : 0.75 };
}

/** One step of easing a value toward its target; `rest` is how close counts as arrived. */
export function easeStep(current: number, target: number, factor: number, rest = 0.02): number {
  const next = current + (target - current) * clamp(factor, 0, 1);
  return Math.abs(target - next) < rest ? target : next;
}

/** The ring runs only on the full tier with a mouse-like pointer, and only when the page asks for it. */
export function shouldMountCursor(enabled: boolean, tier: Tier, finePointer: boolean): boolean {
  return enabled && tier === "full" && finePointer;
}

/** What counts as clickable: links, buttons, summaries, form controls and anything marked as a button. */
export const INTERACTIVE_SELECTOR = 'a[href], button, summary, label, select, [role="button"], [data-kit-magnetic]';
/** Where the real text cursor is needed. */
export const FIELD_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable=""], [contenteditable="true"]';

export const SPLASH_FRAMES: Keyframe[] = [
  { transform: "scale(0.2)", opacity: 0.35 },
  { transform: "scale(4.2)", opacity: 0 },
];
export const SPLASH_MS = 520;

export interface Cursor {
  destroy(): void;
}

/** The ring and the ink splash. Everything is removed again by destroy(). */
export function mountCursor(tier: Tier, finePointer: boolean, enabled: boolean): Cursor {
  if (!shouldMountCursor(enabled, tier, finePointer)) return { destroy: () => undefined };
  const ring = document.createElement("div");
  ring.className = "kit-cursor-ring";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  let goal = { x: 0, y: 0 };
  let shown = { x: 0, y: 0 };
  let look = { scale: 1, opacity: 0 };
  let input: RingInput = { interactive: false, overField: false, pressed: false };
  let frame = 0;
  let seen = false;

  const draw = () => {
    ring.style.transform = `translate3d(${shown.x.toFixed(1)}px, ${shown.y.toFixed(1)}px, 0) scale(${look.scale.toFixed(3)})`;
    ring.style.opacity = look.opacity.toFixed(2);
  };
  const tick = () => {
    frame = 0;
    const target = ringTarget(input);
    shown = { x: easeStep(shown.x, goal.x, 0.22, 0.2), y: easeStep(shown.y, goal.y, 0.22, 0.2) };
    look = { scale: easeStep(look.scale, target.scale, 0.2), opacity: easeStep(look.opacity, seen ? target.opacity : 0, 0.2, 0.01) };
    draw();
    const moving = shown.x !== goal.x || shown.y !== goal.y || look.scale !== target.scale || look.opacity !== (seen ? target.opacity : 0);
    if (moving) frame = window.requestAnimationFrame(tick);
  };
  const run = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };
  const classify = (target: EventTarget | null) => {
    const element = target instanceof Element ? target : null;
    input = {
      ...input,
      interactive: Boolean(element?.closest(INTERACTIVE_SELECTOR)),
      overField: Boolean(element?.closest(FIELD_SELECTOR)),
    };
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    goal = { x: event.clientX, y: event.clientY };
    if (!seen) {
      // First sighting: start at the pointer, so the ring does not fly in from a corner.
      seen = true;
      shown = { ...goal };
    }
    classify(event.target);
    run();
  };
  const onDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    input = { ...input, pressed: true };
    const splash = document.createElement("div");
    splash.className = "kit-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.style.left = `${event.clientX}px`;
    splash.style.top = `${event.clientY}px`;
    document.body.appendChild(splash);
    const animation = splash.animate(SPLASH_FRAMES, { duration: SPLASH_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    const remove = () => splash.remove();
    animation.finished.then(remove, remove);
    run();
  };
  const onUp = () => {
    input = { ...input, pressed: false };
    run();
  };
  const onLeave = () => {
    seen = false;
    run();
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerup", onUp, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return {
    destroy() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      ring.remove();
      document.querySelectorAll(".kit-splash").forEach((splash) => splash.remove());
    },
  };
}
