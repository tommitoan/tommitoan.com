"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_FENGSHUI_LANGUAGE,
  fengshuiContent,
  type FengShuiCopy,
  type FengShuiLanguage,
} from "@/content/fengshui-content";
import { worldContent, type WorldCopy } from "@/content/fengshui-world";

const STORAGE_KEY = "fengshuiLanguage";

// The choice lives in module state so it still works when storage is blocked;
// localStorage only carries it across visits.
let override: FengShuiLanguage | null = null;
const listeners = new Set<() => void>();

function isLanguage(value: string | null): value is FengShuiLanguage {
  return value === "vi" || value === "en";
}

function readLanguage(): FengShuiLanguage {
  if (override) return override;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
    // Blocked storage: fall back to the default language.
  }
  return DEFAULT_FENGSHUI_LANGUAGE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setLanguage(language: FengShuiLanguage) {
  override = language;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Blocked storage: the choice still applies until the page closes.
  }
  listeners.forEach((listener) => listener());
}

/** Vietnamese is the server and first-render language; a stored choice applies after hydration. */
export function useFengShuiLanguage(): FengShuiLanguage {
  return useSyncExternalStore(subscribe, readLanguage, () => DEFAULT_FENGSHUI_LANGUAGE);
}

export function useFengShuiCopy(): FengShuiCopy {
  return fengshuiContent[useFengShuiLanguage()];
}

/** Copy of the scene, the story, the dial and the marquee, in the visitor's language. */
export function useFengShuiWorldCopy(): WorldCopy {
  return worldContent[useFengShuiLanguage()];
}

export function FengShuiLanguageToggle() {
  const language = useFengShuiLanguage();
  const copy = fengshuiContent[language].language;

  const option = (value: FengShuiLanguage, label: string) => (
    <button type="button" lang={value} aria-pressed={language === value} onClick={() => setLanguage(value)} className="fs-lang-option">
      {label}
    </button>
  );

  return (
    <div role="group" aria-label={copy.label} className="fs-lang">
      {option("vi", copy.vi)}
      {option("en", copy.en)}
    </div>
  );
}
