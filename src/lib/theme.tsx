"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStoredTheme, resolveTheme, safeLocalStorage, saveTheme, type Theme } from "./theme-storage";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersLight(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  } catch {
    return false;
  }
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return resolveTheme(readStoredTheme(safeLocalStorage()), systemPrefersLight());
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Without a saved choice the page follows the system setting while it is open.
  useEffect(() => {
    let query: MediaQueryList;
    try {
      query = window.matchMedia("(prefers-color-scheme: light)");
    } catch {
      return;
    }
    const handler = (event: MediaQueryListEvent) => {
      if (readStoredTheme(safeLocalStorage()) === null) setThemeState(event.matches ? "light" : "dark");
    };
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  // Only a deliberate choice is saved, so the first visit does not turn the system's pick into the visitor's.
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    saveTheme(safeLocalStorage(), next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "dark" as Theme, setTheme: () => {}, toggleTheme: () => {} };
  }
  return ctx;
}
