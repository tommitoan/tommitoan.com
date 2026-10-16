import { clamp } from "./color";
import type { Tier } from "./env";

/** Drifting cards (effect 4): the children of a container move at different speeds while it scrolls out of view. */

/** How far each child drifts, in percent of its own height, by default. */
export const DEFAULT_DRIFT = [-22, -8, -34, -14] as const;
const TILT = [-6, 4, -3, 5] as const;

/** Reads "-22,-8,-34" into numbers; missing or invalid entries fall back to the defaults, then cycle. */
export function parseDrift(value: string | null, count: number): number[] {
  const parsed = (value ?? "")
    .split(",")
    .map((part) => Number.parseFloat(part))
    .filter((amount) => Number.isFinite(amount));
  const source = parsed.length > 0 ? parsed : [...DEFAULT_DRIFT];
  return Array.from({ length: count }, (_, index) => source[index % source.length] ?? 0);
}

/** How far a container has scrolled out of view: 0 while it sits at its start, 1 once it has fully passed the window top. */
export function driftProgress(top: number, height: number, viewport: number): number {
  const range = Math.max(1, height + viewport * 0.2);
  return clamp(-top / range, 0, 1);
}

export function shouldMountDrift(tier: Tier): boolean {
  return tier === "full";
}

export interface Drift {
  destroy(): void;
}

/**
 * Containers with data-kit-drift (optionally "a,b,c,d" percentages). On the full tier the children fly in one after
 * another once `after` resolves, then drift as the page scrolls. Other tiers leave them where the stylesheet put them.
 */
export function mountDrift(tier: Tier, after: Promise<void> = Promise.resolve(), root: ParentNode = document): Drift {
  if (!shouldMountDrift(tier)) return { destroy: () => undefined };
  const cleanups: Array<() => void> = [];
  for (const host of Array.from(root.querySelectorAll<HTMLElement>("[data-kit-drift]"))) {
    const cards = Array.from(host.children) as HTMLElement[];
    if (cards.length === 0) continue;
    const amounts = parseDrift(host.getAttribute("data-kit-drift"), cards.length);
    const entrances: Animation[] = [];
    let cancelled = false;
    void after.then(() => {
      if (cancelled) return;
      cards.forEach((card, index) => {
        entrances.push(
          card.animate([{ opacity: 0, transform: `translateY(60px) rotate(${TILT[index % TILT.length]}deg)` }, { opacity: 1, transform: "none" }], {
            duration: 900,
            delay: 150 + index * 120,
            easing: "cubic-bezier(0.22, 1, 0.3, 1)",
            fill: "backwards",
          }),
        );
      });
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = host.getBoundingClientRect();
      if (box.height === 0) return;
      const progress = driftProgress(box.top, box.height, window.innerHeight);
      cards.forEach((card, index) => {
        card.style.translate = `0 ${((amounts[index] ?? 0) * progress).toFixed(2)}%`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      entrances.forEach((animation) => animation.cancel());
      cards.forEach((card) => {
        card.style.translate = "";
      });
    });
  }
  return { destroy: () => cleanups.forEach((cleanup) => cleanup()) };
}
