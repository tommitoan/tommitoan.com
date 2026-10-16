"use client";

import { useSyncExternalStore } from "react";

/** The two languages of the site: Vietnamese and English. */
export type SiteLanguage = "vi" | "en";

/** The key is the one the Feng Shui world has always used, so a choice made there still applies. */
export const LANGUAGE_STORAGE_KEY = "fengshuiLanguage";

/** Time zones of Vietnam: the zone is the only sign of where a visitor is that the browser gives without asking. */
const VIETNAM_ZONES = ["Asia/Ho_Chi_Minh", "Asia/Saigon", "Asia/Hanoi"];

/**
 * Picks a first language for a visitor who has not chosen one: Vietnamese when the browser prefers Vietnamese or the clock is
 * set to a Vietnamese time zone, English otherwise. Nothing leaves the browser: no address lookup, no request.
 */
export function detectLanguage(languages: readonly string[], timeZone: string): SiteLanguage {
  if (languages.some((language) => /^vi(-|$)/i.test(language))) return "vi";
  if (VIETNAM_ZONES.includes(timeZone)) return "vi";
  return "en";
}

// The choice lives in module state so it still works when storage is blocked; localStorage only carries it across visits.
let override: SiteLanguage | null = null;
const listeners = new Set<() => void>();

function isLanguage(value: string | null): value is SiteLanguage {
  return value === "vi" || value === "en";
}

function readLanguage(): SiteLanguage {
  if (override) return override;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // Blocked storage: fall through to detection.
  }
  let zone = "";
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    // No Intl: the language list alone decides.
  }
  return detectLanguage(navigator.languages?.length ? navigator.languages : [navigator.language ?? ""], zone);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Saves the visitor's choice for every page of the site. */
export function setSiteLanguage(language: SiteLanguage) {
  override = language;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Blocked storage: the choice still applies until the page closes.
  }
  listeners.forEach((listener) => listener());
}

/**
 * The visitor's language. `serverDefault` is what the server and the first render show; after hydration a stored choice
 * applies, and without one the language is detected from the browser.
 */
export function useSiteLanguage(serverDefault: SiteLanguage): SiteLanguage {
  return useSyncExternalStore(subscribe, readLanguage, () => serverDefault);
}
