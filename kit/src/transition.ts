import type { Tier } from "./env";
import { shouldCoverNavigation, shouldRevealArrival } from "./navigation";

const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const FLAG_KEY = "kit:cover";
const FLAG_MAX_AGE_MS = 10000;
const FALLBACK_NAVIGATE_MS = 1500;

export interface Transitions {
  /** Cover the page with the slats. */
  cover(): Promise<void>;
  /** Lift the slats; call after `showCovered` when arriving. */
  reveal(): Promise<void>;
  /** Put the slats fully over the page with no animation (the arrival state). */
  showCovered(): void;
  /**
   * Arrival logic: decides at once (synchronously) whether this page opens with the reveal, because the visitor
   * came from the sister site or from this site's own cover. When it does, the slats already cover the page.
   */
  prepareArrival(): Arrival;
  destroy(): void;
}

export interface Arrival {
  /** True when the reveal will play; the slats are already covering the page. */
  plays: boolean;
  /** Lifts the slats. Resolves when they are gone. Does nothing when `plays` is false. */
  run(): Promise<void>;
}

export interface TransitionOptions {
  family: readonly string[];
  tier: Tier;
  /** Storage for the same-site flag. Defaults to sessionStorage; falls back silently when it is blocked. */
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
}

function safeStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem"> | undefined {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

const settle = (animation: Animation): Promise<void> => animation.finished.then(() => undefined, () => undefined);

/** The bamboo-slat page transition: cover, navigate, reveal on the next page (also across the two sites). */
export function createTransitions(options: TransitionOptions): Transitions {
  const storage = options.storage ?? safeStorage();
  const count = window.innerWidth < 520 ? 8 : 12;
  const overlay = document.createElement("div");
  overlay.className = "kit-slats";
  overlay.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  const slats = Array.from({ length: count }, () => document.createElement("i"));
  overlay.append(...slats);
  document.body.appendChild(overlay);

  const delayFor = (index: number, fromCentre: boolean): number => {
    const distance = Math.abs(index - (count - 1) / 2) / ((count - 1) / 2);
    return (fromCentre ? distance : 1 - distance) * 140;
  };

  const run = (direction: "cover" | "reveal"): Promise<void> => {
    overlay.hidden = false;
    overlay.classList.add("is-covering");
    const animations = slats.map((slat, index) => {
      slat.style.transformOrigin = direction === "cover" ? "50% 100%" : "50% 0%";
      const keyframes = direction === "cover" ? [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }] : [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }];
      return slat.animate(keyframes, { duration: 480, delay: delayFor(index, direction === "cover"), easing: EASE, fill: "forwards" });
    });
    return Promise.all(animations.map(settle)).then(() => {
      if (direction === "reveal") reset();
    });
  };

  const reset = (): void => {
    slats.forEach((slat) => {
      slat.getAnimations().forEach((animation) => animation.cancel());
      slat.style.transform = "";
    });
    overlay.classList.remove("is-covering");
    overlay.hidden = true;
  };

  const showCovered = (): void => {
    overlay.hidden = false;
    overlay.classList.add("is-covering");
    slats.forEach((slat) => {
      slat.style.transform = "scaleY(1)";
    });
  };

  const onClick = (event: MouseEvent): void => {
    const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const info = {
      href: anchor.href,
      currentHref: window.location.href,
      family: options.family,
      tier: options.tier,
      button: event.button,
      ctrl: event.ctrlKey,
      meta: event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey,
      target: anchor.getAttribute("target"),
      download: anchor.hasAttribute("download"),
      defaultPrevented: event.defaultPrevented,
    };
    if (!shouldCoverNavigation(info)) return;
    event.preventDefault();
    try {
      storage?.setItem(FLAG_KEY, String(Date.now()));
    } catch {
      /* storage blocked: the sister site still reveals through the referrer */
    }
    let navigated = false;
    const go = () => {
      if (navigated) return;
      navigated = true;
      window.location.assign(anchor.href);
    };
    void run("cover").then(go);
    window.setTimeout(go, FALLBACK_NAVIGATE_MS);
  };

  // A page restored from the back/forward cache must not keep the slats over it.
  const onPageShow = (event: PageTransitionEvent): void => {
    if (event.persisted) reset();
  };

  document.addEventListener("click", onClick, true);
  window.addEventListener("pageshow", onPageShow);

  const startedHere = (): boolean => {
    try {
      const stored = Number(storage?.getItem(FLAG_KEY));
      storage?.removeItem(FLAG_KEY);
      return Number.isFinite(stored) && stored > 0 && Date.now() - stored < FLAG_MAX_AGE_MS;
    } catch {
      return false;
    }
  };

  return {
    cover: () => run("cover"),
    reveal: () => run("reveal"),
    showCovered,
    prepareArrival() {
      const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type ?? "navigate";
      const plays = shouldRevealArrival({
        referrer: document.referrer,
        currentHref: window.location.href,
        family: options.family,
        navType,
        tier: options.tier,
        startedHere: startedHere(),
      });
      if (plays) showCovered();
      return {
        plays,
        run: async () => {
          if (!plays) return;
          await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
          await run("reveal");
        },
      };
    },
    destroy() {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
      reset();
      overlay.remove();
    },
  };
}
