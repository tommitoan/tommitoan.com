import type { Tier } from "./env";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** The seal can never hold the page longer than this, even if an animation stalls. */
const HARD_TIMEOUT_MS = 4000;

export interface SealOptions {
  tier: Tier;
  glyph?: string;
  tagline?: string;
}

export interface SealPlayback {
  /** Resolves when the paper starts lifting: the page underneath can start its own entrance now. */
  lifting: Promise<void>;
  /** Resolves when the overlay is gone. */
  done: Promise<void>;
}

const settle = (animation: Animation): Promise<void> => animation.finished.then(() => undefined, () => undefined);

/** The opening screen: a red seal is stamped onto paper, then the paper lifts away. */
export function playSeal(options: SealOptions): SealPlayback {
  const overlay = document.createElement("div");
  overlay.className = "kit-seal";
  overlay.setAttribute("aria-hidden", "true");
  const inner = document.createElement("div");
  const mark = document.createElement("div");
  mark.className = "kit-seal-mark";
  mark.textContent = options.glyph ?? "命";
  const tag = document.createElement("div");
  tag.className = "kit-seal-tag";
  tag.textContent = options.tagline ?? "";
  inner.append(mark, tag);
  overlay.append(inner);
  document.body.appendChild(overlay);

  let finished = false;
  let resolveLifting: () => void = () => undefined;
  let resolveDone: () => void = () => undefined;
  const lifting = new Promise<void>((resolve) => (resolveLifting = resolve));
  const done = new Promise<void>((resolve) => (resolveDone = resolve));
  const finish = () => {
    if (finished) return;
    finished = true;
    overlay.remove();
    resolveLifting();
    resolveDone();
  };
  window.setTimeout(finish, HARD_TIMEOUT_MS);

  const subtle = options.tier === "subtle";
  void (async () => {
    if (!subtle) {
      await Promise.all([
        settle(mark.animate([{ opacity: 0, transform: "scale(2.8) rotate(-16deg)" }, { opacity: 1, transform: "scale(1) rotate(-6deg)" }], { duration: 450, easing: SPRING, fill: "forwards" })),
        settle(tag.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: 300, easing: EASE, fill: "backwards" })),
      ]);
    }
    await new Promise<void>((resolve) => window.setTimeout(resolve, subtle ? 200 : 450));
    resolveLifting();
    await settle(overlay.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: subtle ? 400 : 750, easing: EASE, fill: "forwards" }));
    finish();
  })();

  return { lifting, done };
}
