import { describe, expect, it } from "vitest";
import { readStoredTheme, resolveTheme, safeLocalStorage, saveTheme, THEME_STORAGE_KEY } from "./theme-storage";

const blocked = {
  getItem() {
    throw new DOMException("blocked", "SecurityError");
  },
  setItem() {
    throw new DOMException("blocked", "SecurityError");
  },
};

describe("theme storage", () => {
  it("reads only a saved light or dark", () => {
    expect(readStoredTheme({ getItem: () => "light" })).toBe("light");
    expect(readStoredTheme({ getItem: () => "dark" })).toBe("dark");
    expect(readStoredTheme({ getItem: () => "sepia" })).toBeNull();
    expect(readStoredTheme({ getItem: () => null })).toBeNull();
    expect(readStoredTheme(null)).toBeNull();
  });

  it("does not throw when storage is blocked", () => {
    expect(readStoredTheme(blocked)).toBeNull();
    expect(() => saveTheme(blocked, "light")).not.toThrow();
    expect(() => saveTheme(null, "dark")).not.toThrow();
  });

  it("saves a choice under the key both sites read", () => {
    const written: Record<string, string> = {};
    saveTheme({ setItem: (key, value) => void (written[key] = value) }, "light");
    expect(written).toEqual({ [THEME_STORAGE_KEY]: "light" });
  });

  it("lets a saved choice win over the system, and defaults to dark", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme(null, false)).toBe("dark");
  });

  it("has no browser storage outside a browser", () => {
    expect(safeLocalStorage()).toBeNull();
  });
});
