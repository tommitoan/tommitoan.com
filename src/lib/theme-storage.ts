/** The two looks of the site. */
export type Theme = "dark" | "light";

/** The key the boot scripts of both sites read before the first paint. */
export const THEME_STORAGE_KEY = "tommitoan-theme";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

/** The visitor's saved choice, or null when there is none or storage cannot be read (blocked, or a value that is not a theme). */
export function readStoredTheme(storage: ReadableStorage | null): Theme | null {
  try {
    const stored = storage?.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

/** Saves a deliberate choice. Without storage the choice still applies until the page closes. */
export function saveTheme(storage: WritableStorage | null, theme: Theme): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Blocked storage: nothing to save to.
  }
}

/** The saved choice wins; without one the system setting decides, and dark is the default. */
export function resolveTheme(stored: Theme | null, systemPrefersLight: boolean): Theme {
  return stored ?? (systemPrefersLight ? "light" : "dark");
}

/** The browser's storage, or null where reaching it throws. */
export function safeLocalStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}
