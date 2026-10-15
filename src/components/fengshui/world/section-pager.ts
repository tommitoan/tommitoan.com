/**
 * Section by section scrolling for the Feng Shui world. A browser's own scroll snapping pulls a single wheel notch back to the
 * section it came from, so this decides itself: inside a section taller than the window (the pinned scenes) the wheel scrolls
 * freely, and anywhere else one turn of the wheel carries the page all the way to the next (or previous) section.
 */

export interface Block {
  /** Top and bottom of a section in document coordinates. */
  top: number;
  bottom: number;
  /** The rest of the page after the paged sections: the wheel scrolls freely and only the very top hands back to the pager. */
  free?: boolean;
}

const TOLERANCE = 2;

/**
 * A section taller than the window is scrolled through; a shorter one, or one only a little taller (the extra is its own bottom
 * padding), is one page. Without this slack a section 40 px too tall would need a pointless 40 px scroll before the next move.
 */
const PAGE_SLACK = 80;
const isTall = (block: Block, viewport: number): boolean => block.bottom - block.top > viewport + PAGE_SLACK;

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

  if (current.free) {
    // Free scrolling. Only a turn upwards from the very top of this zone goes back to the pager's last screen.
    if (down || scrollY > current.top + TOLERANCE) return null;
    const previous = blocks[index - 1];
    return previous ? settle(restFor(previous, viewport, true)) : null;
  }

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

/** Fast at the start and slowing to a stop, so the page answers the wheel at once: half the distance is covered in the first 16% of the time. */
export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);

const MOVE_MS = 650;
const MIN_DELTA = 4;

/** A wheel event, kept for a moment so a new push can be told from a trackpad that is still coasting. */
export interface WheelRecord {
  time: number;
  size: number;
}

export type WheelIntent = "act" | "queue" | "ignore";

/** A pause this long between wheel events means the visitor has started a new gesture. */
const GESTURE_GAP_MS = 200;
/** After a move ends, a continuing stream is given this long to show whether it is coasting or still being pushed. */
const SETTLE_MS = 150;
/** Within a stream, an event smaller than this share of the recent peak is a coasting tail, not a new push. */
const COAST_RATIO = 0.95;

/**
 * What to do with a wheel event. A new gesture (after a pause) always counts: it moves the page, or while a move is running it
 * is remembered and carried out the moment that move ends, so a visitor who scrolls again is never left waiting. Inside a
 * continuing stream an event counts only when it is not weaker than the recent peak: a trackpad that coasts to a stop makes
 * weaker and weaker events and is ignored, while a wheel spun steadily goes on moving the page section by section.
 */
export function wheelIntent(recent: readonly WheelRecord[], now: number, size: number, moving: boolean, sinceMoveEnd: number): WheelIntent {
  const last = recent[recent.length - 1];
  const newGesture = !last || now - last.time > GESTURE_GAP_MS;
  if (moving) return newGesture ? "queue" : "ignore";
  if (newGesture) return "act";
  if (sinceMoveEnd < SETTLE_MS) return "ignore";
  const peak = recent.filter((record) => now - record.time <= 300).reduce((most, record) => Math.max(most, record.size), 0);
  return size >= peak * COAST_RATIO ? "act" : "ignore";
}

function readBlocks(): Block[] {
  const toBlock = (element: HTMLElement, free = false): Block => {
    const box = element.getBoundingClientRect();
    return { top: box.top + window.scrollY, bottom: box.bottom + window.scrollY, ...(free ? { free: true } : {}) };
  };
  const sections = Array.from(document.querySelectorAll<HTMLElement>("#fs-main > section")).filter((element) => element.getBoundingClientRect().height > 0);
  const freeAt = sections.findIndex((element) => element.hasAttribute("data-pager-free"));
  const paged = freeAt < 0 ? sections : sections.slice(0, freeAt);
  const blocks = paged.map((element) => toBlock(element)).sort((a, b) => a.top - b.top);
  const footer = document.querySelector<HTMLElement>(".fs-footer");
  if (freeAt >= 0) {
    const first = toBlock(sections[freeAt]!);
    blocks.push({ top: first.top, bottom: footer ? toBlock(footer).bottom : document.documentElement.scrollHeight, free: true });
  } else if (footer) {
    blocks.push(toBlock(footer));
  }
  return blocks;
}

/** Starts the pager; the returned function stops it. */
export function mountSectionPager(): () => void {
  let moving = false;
  let moveEnded = 0;
  let frame = 0;
  let cancelled = false;
  let queued = 0;
  let recent: WheelRecord[] = [];

  /** Moves for a wheel of `delta` pixels from where the page is; false when the browser should scroll by itself. */
  const go = (delta: number): boolean => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const target = pagerTarget(readBlocks(), window.scrollY, window.innerHeight, maxScroll, delta);
    if (target === null) return false;
    move(target);
    return true;
  };

  const move = (to: number) => {
    const from = window.scrollY;
    const start = performance.now();
    moving = true;
    cancelled = false;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / MOVE_MS);
      // "instant": the site sets scroll-behavior: smooth on <html>, which would turn each of these steps into its own slow glide.
      window.scrollTo({ top: from + (to - from) * easeOutQuart(t), left: 0, behavior: "instant" });
      if (t < 1 && !cancelled) {
        frame = window.requestAnimationFrame(step);
        return;
      }
      moving = false;
      moveEnded = performance.now();
      // A visitor who scrolled again during the move gets the next move at once.
      const next = queued;
      queued = 0;
      if (next !== 0 && !cancelled) go(next);
    };
    frame = window.requestAnimationFrame(step);
  };

  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey || event.deltaY === 0) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [data-no-pager]")) return;
    const now = performance.now();
    const delta = wheelPixels(event.deltaY, event.deltaMode, window.innerHeight);
    const intent = wheelIntent(recent, now, Math.abs(delta), moving, now - moveEnded);
    recent = [...recent.filter((record) => now - record.time <= 400), { time: now, size: Math.abs(delta) }];
    if (moving) {
      // Never let the browser scroll under a move in progress.
      event.preventDefault();
      if (intent === "queue") queued = delta;
      return;
    }
    if (intent === "ignore") {
      // A coasting tail right after a move: keep the browser from carrying the page on.
      if (now - moveEnded < 400) event.preventDefault();
      return;
    }
    if (Math.abs(delta) < MIN_DELTA) return;
    if (go(delta)) event.preventDefault();
  };
  const cancel = () => {
    cancelled = true;
    queued = 0;
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
