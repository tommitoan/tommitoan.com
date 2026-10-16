import { describe, expect, it } from "vitest";
import { readAppearance } from "./appearance";

const root = (dataset: Record<string, string>) => ({ dataset: dataset as DOMStringMap });

describe("readAppearance", () => {
  it("follows data-theme and defaults to dark", () => {
    expect(readAppearance(root({ theme: "light" }))).toBe("light");
    expect(readAppearance(root({ theme: "dark" }))).toBe("dark");
    expect(readAppearance(root({}))).toBe("dark");
    expect(readAppearance(root({ theme: "sepia" }))).toBe("dark");
  });

  it("lets data-kit-appearance win over data-theme", () => {
    expect(readAppearance(root({ kitAppearance: "light", theme: "dark" }))).toBe("light");
    expect(readAppearance(root({ kitAppearance: "dark", theme: "light" }))).toBe("dark");
  });
});
