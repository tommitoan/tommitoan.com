"use client";

import { Moon, Sun } from "lucide-react";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { useAppearance } from "@/lib/appearance";
import { useTheme } from "@/lib/theme";

const LABELS = {
  vi: { toLight: "Chuyển sang giao diện sáng", toDark: "Chuyển sang giao diện tối" },
  en: { toLight: "Switch to the light look", toDark: "Switch to the dark look" },
} as const;

/** A sun or a moon: switches the look of the whole site, the choice is remembered (and shared with the Tech and Discover pages). */
export function WorldThemeToggle() {
  const language = useFengShuiLanguage();
  const appearance = useAppearance();
  const { toggleTheme } = useTheme();
  const dark = appearance === "dark";
  return (
    <button type="button" className="fs-theme" onClick={toggleTheme} aria-label={dark ? LABELS[language].toLight : LABELS[language].toDark}>
      {dark ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
    </button>
  );
}
