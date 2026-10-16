import { describe, expect, it } from "vitest";
import { SOLAR_TERMS_VI } from "@kit/solar";
import { STEM_NAMES_VI } from "@/components/fengshui/world/pillar-math";
import { existsSync } from "node:fs";
import path from "node:path";
import { termDates, termImage, TERMS } from "./fengshui-terms";
import { ELEMENT_NAMES, STEMS, stemImage, stemKind } from "./fengshui-stems";

const publicFile = (url: string): string => path.join(process.cwd(), "public", url);

describe("solar term data", () => {
  it("has the 24 terms in the kit's order, each with a picture, English name and imagery in both languages", () => {
    expect(TERMS).toHaveLength(24);
    TERMS.forEach((info, index) => {
      expect(info.vi).toBe(SOLAR_TERMS_VI[index]);
      expect(info.en.length).toBeGreaterThan(3);
      expect(info.imagery.vi.length).toBeGreaterThan(10);
      expect(info.imagery.en.length).toBeGreaterThan(10);
      expect(existsSync(publicFile(termImage(index)))).toBe(true);
    });
  });

  it("writes the usual dates in each language", () => {
    expect(termDates(TERMS[0]!, "vi")).toBe("20–21/3");
    expect(termDates(TERMS[0]!, "en")).toBe("20–21 Mar");
    expect(termDates(TERMS[21]!, "vi")).toBe("3–5/2");
  });

  it("starts each term on a plausible date", () => {
    for (const info of TERMS) {
      expect(info.month).toBeGreaterThanOrEqual(1);
      expect(info.month).toBeLessThanOrEqual(12);
      expect(info.from).toBeLessThanOrEqual(info.to);
      expect(info.to).toBeLessThanOrEqual(31);
    }
  });
});

describe("heavenly stem data", () => {
  it("has the ten stems in order with a picture and both languages", () => {
    expect(STEMS).toHaveLength(10);
    STEMS.forEach((info, index) => {
      expect(info.vi).toBe(STEM_NAMES_VI[index]);
      expect(info.yang).toBe(index % 2 === 0);
      expect(info.title.vi.length).toBeGreaterThan(5);
      expect(info.title.en.length).toBeGreaterThan(5);
      expect(info.imagery.en.length).toBeGreaterThan(10);
      expect(info.shadow.en.length).toBeGreaterThan(10);
      expect(existsSync(publicFile(stemImage(index)))).toBe(true);
    });
  });

  it("pairs the stems two by two into the five elements", () => {
    const order = STEMS.map((info) => info.element);
    expect(order).toEqual(["wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water"]);
    expect(stemKind(STEMS[0]!, "vi")).toBe("Dương " + ELEMENT_NAMES.wood.vi);
    expect(stemKind(STEMS[9]!, "en")).toBe("Yin Water");
  });
});
