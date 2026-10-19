import { describe, expect, it } from "vitest";
import { DEFAULT_DARK_SNIPPET, readStoredTheme, resolveTheme, safeLocalStorage, saveTheme, THEME_STORAGE_KEY } from "./theme-storage";

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

  it("lets a saved choice win, and is dark without one", () => {
    expect(resolveTheme("dark")).toBe("dark");
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme(null)).toBe("dark");
  });

  it("gives the head script the same rule: saved light or dark, else dark, even when storage throws", () => {
    const run = (stored: string | null | "throw") => {
      const attributes: Record<string, string> = {};
      const localStorage = {
        getItem: () => {
          if (stored === "throw") throw new Error("blocked");
          return stored;
        },
      };
      const document = { documentElement: { setAttribute: (name: string, value: string) => void (attributes[name] = value) } };
      new Function("localStorage", "document", DEFAULT_DARK_SNIPPET)(localStorage, document);
      return attributes["data-theme"];
    };
    expect(run(null)).toBe("dark");
    expect(run("sepia")).toBe("dark");
    expect(run("throw")).toBe("dark");
    expect(run("light")).toBe("light");
    expect(run("dark")).toBe("dark");
  });

  it("has no browser storage outside a browser", () => {
    expect(safeLocalStorage()).toBeNull();
  });
});
