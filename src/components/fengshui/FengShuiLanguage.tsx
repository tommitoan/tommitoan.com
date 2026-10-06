"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_FENGSHUI_LANGUAGE,
  fengshuiContent,
  type FengShuiCopy,
  type FengShuiLanguage,
} from "@/content/fengshui-content";
import { useTheme } from "@/lib/theme";

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

export function FengShuiLanguageToggle() {
  const language = useFengShuiLanguage();
  const copy = fengshuiContent[language].language;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const option = (value: FengShuiLanguage, label: string) => {
    const active = language === value;
    return (
      <button
        type="button"
        lang={value}
        aria-pressed={active}
        onClick={() => setLanguage(value)}
        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition ${
          active
            ? "bg-violet-500/80 text-white shadow-[0_0_12px_rgba(139,92,246,0.45)]"
            : isDark
              ? "text-white/60 hover:text-white"
              : "text-gray-500 hover:text-gray-900"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="group"
      aria-label={copy.label}
      className={`inline-flex items-center gap-1 rounded-full border p-1 ${
        isDark ? "border-white/12 bg-white/4" : "border-black/10 bg-black/4"
      }`}
    >
      {option("vi", copy.vi)}
      {option("en", copy.en)}
    </div>
  );
}
