import type { Tier } from "./env";

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

export interface RevealOptions {
  tier: Tier;
  /** Headings to animate. Defaults to every element with data-kit-reveal. */
  selector?: string;
  root?: ParentNode;
  /** Words start rising only after this resolves (for example when the opening seal has lifted). */
  after?: Promise<void>;
}

export interface Revealer {
  destroy(): void;
}

/** Splits the text of an element into words wrapped in masks. Returns a function that restores the original markup. */
export function splitWords(element: HTMLElement): { words: HTMLElement[]; restore: () => void } {
  const original = element.innerHTML;
  if (!element.hasAttribute("aria-label")) element.setAttribute("aria-label", (element.textContent ?? "").replace(/\s+/g, " ").trim());
  const nodes = Array.from(element.childNodes);
  element.textContent = "";
  const words: HTMLElement[] = [];
  for (const node of nodes) {
    if (node.nodeType !== Node.TEXT_NODE) {
      element.appendChild(node);
      continue;
    }
    for (const piece of (node.textContent ?? "").split(/(\s+)/)) {
      if (piece === "") continue;
      if (piece.trim() === "") {
        element.appendChild(document.createTextNode(piece));
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "kit-word";
      const inner = document.createElement("span");
      inner.setAttribute("aria-hidden", "true");
      inner.textContent = piece;
      mask.appendChild(inner);
      element.appendChild(mask);
      words.push(inner);
    }
  }
  return {
    words,
    restore: () => {
      element.innerHTML = original;
    },
  };
}

/**
 * Heading reveal: each word rises out of its mask when the heading scrolls into view.
 * With reduced motion (tier off) the headings are left untouched and fully visible.
 */
export function mountReveal(options: RevealOptions): Revealer {
  const root = options.root ?? document;
  const elements = options.tier === "off" ? [] : Array.from(root.querySelectorAll<HTMLElement>(options.selector ?? "[data-kit-reveal]"));
  const restores: Array<() => void> = [];
  const byElement = new Map<Element, HTMLElement[]>();
  const subtle = options.tier === "subtle";

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        const words = byElement.get(element) ?? [];
        void (options.after ?? Promise.resolve()).then(() => {
          words.forEach((word, index) => {
            word.animate(subtle ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }], {
              duration: subtle ? 300 : 800,
              delay: subtle ? 0 : index * 50,
              easing: EASE_OUT,
              fill: "backwards",
            });
          });
          element.setAttribute("data-kit-revealed", "");
        });
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );

  for (const element of elements) {
    const { words, restore } = splitWords(element);
    restores.push(restore);
    byElement.set(element, words);
    element.setAttribute("data-kit-ready", "");
    observer.observe(element);
  }

  return {
    destroy() {
      observer.disconnect();
      restores.forEach((restore) => restore());
      for (const element of elements) {
        element.removeAttribute("data-kit-ready");
        element.removeAttribute("data-kit-revealed");
      }
    },
  };
}
