/**
 * Section by section scrolling for the Feng Shui world. A browser's own scroll snapping pulls a single wheel notch back to the
 * section it came from, so this decides itself: inside a section taller than the window (the pinned scenes) the wheel scrolls
 * freely, and anywhere else one turn of the wheel carries the page all the way to the next (or previous) section.
 */

export interface Block {
  /** Top and bottom of a section in document coordinates. */
  top: number;
  bottom: number;
}

const TOLERANCE = 2;

/** A section taller than the window is scrolled through; a shorter one is one page. */
const isTall = (block: Block, viewport: number): boolean => block.bottom - block.top > viewport + 4;

/** Where the page should rest to show a section: its top, or for a tall one entered from below, its last screen. */
const restFor = (block: Block, viewport: number, fromBelow: boolean): number => (fromBelow && isTall(block, viewport) ? block.bottom - viewport : block.top);

/**
 * What one turn of the wheel does at scroll position `scrollY`. Returns the scroll position to move to, or null to let the
 * browser scroll as it normally would. `delta` is the wheel's vertical movement in pixels (positive is down). A tall section
 * is left alone until the wheel would carry the page past one of its ends: then the page stops exactly at that end, and the
 * next turn crosses to the neighbouring section.
 */
export function pagerTarget(blocks: readonly Block[], scrollY: number, viewport: number, maxScroll: number, delta: number): number | null {
  if (delta === 0 || blocks.length === 0) return null;
  const down = delta > 0;
  let index = 0;
  blocks.forEach((block, i) => {
    if (block.top <= scrollY + 1) index = i;
  });
  const current = blocks[index]!;
  const clamp = (value: number): number => Math.min(maxScroll, Math.max(0, value));
  const settle = (value: number): number | null => {
    const target = clamp(value);
    return Math.abs(target - scrollY) < TOLERANCE ? null : target;
  };

  if (isTall(current, viewport)) {
    if (down) {
      const end = current.bottom - viewport;
      if (scrollY < end - TOLERANCE) return scrollY + delta >= end - TOLERANCE ? settle(end) : null;
      const next = blocks[index + 1];
      return next ? settle(restFor(next, viewport, false)) : null;
    }
    if (scrollY > current.top + TOLERANCE) return scrollY + delta <= current.top + TOLERANCE ? settle(current.top) : null;
    const previous = blocks[index - 1];
    return previous ? settle(restFor(previous, viewport, true)) : null;
  }

  if (down) {
    const next = blocks[index + 1];
    return next ? settle(restFor(next, viewport, false)) : settle(maxScroll);
  }
  if (scrollY > current.top + TOLERANCE) return settle(current.top);
  const previous = blocks[index - 1];
  return previous ? settle(restFor(previous, viewport, true)) : null;
}

/** Wheel movement in pixels whatever the unit the browser reports it in. */
export function wheelPixels(deltaY: number, deltaMode: number, viewport: number): number {
  if (deltaMode === 1) return deltaY * 16;
  if (deltaMode === 2) return deltaY * viewport;
  return deltaY;
}

export const easeInOutCubic = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const MOVE_MS = 900;
/** After a move, wheel events are ignored until this long after the last one, so a trackpad's coasting does not start another. */
const QUIET_MS = 140;
const MIN_DELTA = 4;

function readBlocks(): Block[] {
  const found: Block[] = [];
  const elements = document.querySelectorAll<HTMLElement>("#fs-main > section, .fs-footer");
  elements.forEach((element) => {
    const box = element.getBoundingClientRect();
    if (box.height > 0) found.push({ top: box.top + window.scrollY, bottom: box.bottom + window.scrollY });
  });
  return found.sort((a, b) => a.top - b.top);
}

/** Starts the pager; the returned function stops it. */
export function mountSectionPager(): () => void {
  let moving = false;
  let lastWheel = 0;
  let frame = 0;
  let cancelled = false;

  const move = (to: number) => {
    const from = window.scrollY;
    const start = performance.now();
    moving = true;
    cancelled = false;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / MOVE_MS);
      window.scrollTo(0, from + (to - from) * easeInOutCubic(t));
      if (t < 1 && !cancelled) {
        frame = window.requestAnimationFrame(step);
        return;
      }
      moving = false;
      lastWheel = performance.now();
    };
    frame = window.requestAnimationFrame(step);
  };

  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey || event.deltaY === 0) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [data-no-pager]")) return;
    const now = performance.now();
    if (moving || now - lastWheel < QUIET_MS) {
      // Still carrying the last move, or the wheel is still coasting: swallow it, and wait for it to go quiet.
      lastWheel = now;
      event.preventDefault();
      return;
    }
    lastWheel = now;
    const delta = wheelPixels(event.deltaY, event.deltaMode, window.innerHeight);
    if (Math.abs(delta) < MIN_DELTA) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const target = pagerTarget(readBlocks(), window.scrollY, window.innerHeight, maxScroll, delta);
    if (target === null) return;
    event.preventDefault();
    move(target);
  };
  const cancel = () => {
    cancelled = true;
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", cancel);
  window.addEventListener("pointerdown", cancel);
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", cancel);
    window.removeEventListener("pointerdown", cancel);
    cancelled = true;
    if (frame) window.cancelAnimationFrame(frame);
  };
}
