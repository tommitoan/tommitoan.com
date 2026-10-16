"use client";

import { useSyncExternalStore } from "react";
import type { Appearance } from "@kit/color";

export type { Appearance };

function subscribe(listener: () => void): () => void {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-kit-appearance"] });
  return () => observer.disconnect();
}

function snapshot(): Appearance {
  const root = document.documentElement;
  return (root.dataset.kitAppearance ?? root.dataset.theme) === "light" ? "light" : "dark";
}

/**
 * The look the page is in, read from the attribute the page sets before its first paint (the visitor's choice, or the system's).
 * The server and the first render say "dark", which is also what the site is when nothing says otherwise.
 */
export function useAppearance(): Appearance {
  return useSyncExternalStore(subscribe, snapshot, () => "dark");
}
