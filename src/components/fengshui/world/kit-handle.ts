import type { Kit } from "@kit";

/**
 * The running kit, kept here so a button far from KitMount can ask for a smooth scroll without owning the engine. It is
 * set when the Feng Shui world mounts and cleared when it unmounts.
 */
let current: Kit | null = null;

export function setKit(kit: Kit | null): void {
  current = kit;
}

/** Scrolls back to the top: with the kit's smooth engine over a few seconds when it runs, otherwise the browser's own way. */
export function scrollToTop(reducedMotion: boolean = false): void {
  const smooth = current?.smooth;
  if (smooth && !reducedMotion) {
    smooth.lenis.scrollTo(0, { duration: 3.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
}
