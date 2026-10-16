"use client";

import { useSyncExternalStore } from "react";
import type { Appearance } from "@kit/color";

export type { Appearance };

function subscribe(listener: () => void): () => void {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-kit-appearance"] });
  return () => observer.disconnect();
}

/** The look a page root says it is in: `data-kit-appearance` wins over `data-theme`; anything but "light" is dark. */
export function readAppearance(root: { dataset: DOMStringMap }): Appearance {
  return (root.dataset.kitAppearance ?? root.dataset.theme) === "light" ? "light" : "dark";
}

function snapshot(): Appearance {
  return readAppearance(document.documentElement);
}

/**
 * The look the page is in, read from the attribute the page sets before its first paint (the visitor's choice, or the system's).
 * The server and the first render say "dark", which is also what the site is when nothing says otherwise.
 */
export function useAppearance(): Appearance {
  return useSyncExternalStore(subscribe, snapshot, () => "dark");
}
