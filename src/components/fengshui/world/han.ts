import { BRANCHES_HAN, STEMS_HAN } from "@kit/solar";
import { SOLAR_TERMS_HAN } from "./dial-math";
import { LUCK_PILLARS, SAMPLE_PILLARS } from "./scene-math";

/**
 * Every Han character the Feng Shui world draws. The font request asks Google Fonts for exactly these glyphs,
 * so it stays a few kilobytes. A test scans the world's source files and fails when a new character is missing here.
 */
const FIXED = "命八字年月日時地春";

export const HAN_GLYPHS: string = Array.from(
  new Set(
    [STEMS_HAN, BRANCHES_HAN, FIXED, ...SOLAR_TERMS_HAN, ...LUCK_PILLARS.map((p) => p.han), ...SAMPLE_PILLARS].join("").split(""),
  ),
).join("");

/** Stylesheet URL for Noto Serif SC limited to the glyphs above. */
export function hanFontHref(glyphs: string = HAN_GLYPHS): string {
  return `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&text=${encodeURIComponent(glyphs)}&display=swap`;
}

/** Font stack for Han text: the subset font first, then common system CJK serif fonts. */
export const HAN_FONT_STACK = '"Noto Serif SC", "Noto Serif CJK SC", "Songti SC", "Source Han Serif SC", serif';
