/** The look of what covers the page (boot guard, opening seal, slats): paper by default, or the night sky. */
export type Theme = "paper" | "night";

export const THEME_ATTRIBUTE = "data-kit-theme";

/** Anything but "night" means paper, so a typo can never leave the cover in an unknown state. */
export function resolveTheme(value: unknown): Theme {
  return value === "night" ? "night" : "paper";
}

/**
 * Sets the theme on <html> and returns a function that puts back what was there. Paper is the stylesheet's default, so
 * it removes the attribute instead of setting it.
 */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): () => void {
  const before = root.getAttribute(THEME_ATTRIBUTE);
  if (theme === "night") root.setAttribute(THEME_ATTRIBUTE, "night");
  else root.removeAttribute(THEME_ATTRIBUTE);
  return () => {
    if (before === null) root.removeAttribute(THEME_ATTRIBUTE);
    else root.setAttribute(THEME_ATTRIBUTE, before);
  };
}
