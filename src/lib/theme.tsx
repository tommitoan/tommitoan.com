"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStoredTheme, resolveTheme, safeLocalStorage, saveTheme, type Theme } from "./theme-storage";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return resolveTheme(readStoredTheme(safeLocalStorage()));
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
