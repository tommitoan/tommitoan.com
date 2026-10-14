"use client";

import { useSyncExternalStore } from "react";
import { detectTier } from "@kit/env";

/** `scroll` runs the pinned, animated scenes; `static` shows the same story as plain stacked blocks. */
export type WorldMode = "scroll" | "static";

const WIDE = "(min-width: 760px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const queries = [window.matchMedia(WIDE), window.matchMedia(REDUCED)];
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}

function snapshot(): WorldMode {
  return detectTier() === "full" && window.matchMedia(WIDE).matches ? "scroll" : "static";
}

/**
 * The static layout is also what the server renders and what search engines read, so the first render is `static`.
 * The animated scenes replace it after hydration on wide screens with the full motion tier.
 */
export function useWorldMode(): WorldMode {
  return useSyncExternalStore(subscribe, snapshot, () => "static");
}
