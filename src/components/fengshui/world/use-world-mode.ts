"use client";

import { useSyncExternalStore } from "react";
import { detectTier } from "@kit/env";

/** `scroll` runs the pinned, animated scenes; `static` shows the same story as plain stacked blocks. */
export type WorldMode = "scroll" | "static";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function snapshot(): WorldMode {
  return detectTier() === "full" ? "scroll" : "static";
}

/**
 * The static layout is also what the server renders and what search engines read, so the first render is `static`.
 * The animated scenes replace it after hydration on any screen size with the full motion tier.
 */
export function useWorldMode(): WorldMode {
  return useSyncExternalStore(subscribe, snapshot, () => "static");
}
