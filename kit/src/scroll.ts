import Lenis from "lenis";

export interface SmoothScroll {
  readonly lenis: Lenis;
  stop(): void;
  start(): void;
  /** Scroll to an element or a pixel position with the smooth engine. */
  scrollTo(target: HTMLElement | number, offset?: number): void;
  destroy(): void;
}

/** Smooth, inertial scrolling. Only create it on devices with a fine pointer and without reduced motion. */
export function createSmoothScroll(win: Window = window): SmoothScroll {
  const lenis = new Lenis({ lerp: 0.09 });
  let frame = 0;
  const loop = (time: number) => {
    lenis.raf(time);
    frame = win.requestAnimationFrame(loop);
  };
  frame = win.requestAnimationFrame(loop);
  return {
    lenis,
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    scrollTo: (target, offset = 0) => lenis.scrollTo(target, { offset, duration: 1.2 }),
    destroy: () => {
      win.cancelAnimationFrame(frame);
      lenis.destroy();
    },
  };
}

const MODAL_SELECTOR = 'dialog[open], [aria-modal="true"]';

/**
 * Tells you when a modal (an open <dialog> or an element with aria-modal) appears or disappears,
 * so smooth scrolling can pause while a dialog is open. Returns a cleanup.
 */
export function watchModals(onChange: (open: boolean) => void, doc: Document = document): () => void {
  let open = doc.querySelector(MODAL_SELECTOR) !== null;
  const check = () => {
    const now = doc.querySelector(MODAL_SELECTOR) !== null;
    if (now !== open) {
      open = now;
      onChange(open);
    }
  };
  const observer = new MutationObserver(check);
  observer.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "aria-modal"] });
  if (open) onChange(true);
  return () => observer.disconnect();
}
