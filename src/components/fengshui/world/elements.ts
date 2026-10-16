/** Five-element colour of each stem and branch, used to tint Han characters with the kit's --kit-* tokens. */
export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";

const ELEMENT_OF: Record<string, ElementKey> = {
  甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth", 己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water",
  寅: "wood", 卯: "wood", 巳: "fire", 午: "fire", 辰: "earth", 戌: "earth", 丑: "earth", 未: "earth", 申: "metal", 酉: "metal", 亥: "water", 子: "water",
};

export function elementOf(char: string): ElementKey | null {
  return ELEMENT_OF[char] ?? null;
}

/** CSS colour for a stem or branch character; a neutral ink for anything else. */
export function elementColor(char: string): string {
  const element = elementOf(char);
  return element ? `var(--kit-${element})` : "var(--kit-ink)";
}
