"use client";

import { useSyncExternalStore } from "react";
import { detectTier } from "@kit/env";

const FINE = "(pointer: fine)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(FINE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True with a mouse-like pointer on the full motion tier. The server and the first render say false. */
export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => detectTier() === "full" && window.matchMedia(FINE).matches,
    () => false,
  );
}
