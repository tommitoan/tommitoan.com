import { describe, expect, it } from "vitest";
import { NAYIN, pairName } from "@/content/fengshui-nayin";
import { nayinOfPair, pairsOfNayin } from "./nayin-math";
import { SAMPLE_CYCLE } from "./anatomy-math";

describe("Nạp Âm", () => {
  it("has thirty entries, each covering two pairs", () => {
    expect(NAYIN).toHaveLength(30);
    expect(pairsOfNayin(0)).toEqual([0, 1]);
    expect(pairsOfNayin(29)).toEqual([58, 59]);
    for (let n = 0; n < 60; n += 1) expect(pairsOfNayin(nayinOfPair(n))).toContain(n);
  });

  it("matches the library's table for known entries", () => {
    const pairs = (entry: number) => pairsOfNayin(entry).map((n) => pairName(n, "vi"));
    expect(NAYIN[0]!.name).toBe("Hải Trung Kim");
    expect(pairs(0)).toEqual(["Giáp Tý", "Ất Sửu"]);
    expect(NAYIN[5]!.name).toBe("Sơn Đầu Hỏa");
    expect(pairs(5)).toEqual(["Giáp Tuất", "Ất Hợi"]);
    expect(NAYIN[22]!.name).toBe("Đại Trạch Thổ");
    expect(pairs(22)).toEqual(["Mậu Thân", "Kỷ Dậu"]);
    expect(NAYIN[29]!.name).toBe("Đại Hải Thủy");
    expect(pairs(29)).toEqual(["Nhâm Tuất", "Quý Hợi"]);
  });

  it("gives each entry the element its name ends with", () => {
    const word = { Kim: "metal", Mộc: "wood", Thủy: "water", Hỏa: "fire", Thổ: "earth" } as const;
    for (const entry of NAYIN) expect(entry.element).toBe(word[entry.name.split(" ").pop() as keyof typeof word]);
  });

  it("places the sample chart's pillars", () => {
    // Ất Hợi, Mậu Tý, Giáp Ngọ, Canh Ngọ
    expect(SAMPLE_CYCLE.map(nayinOfPair).map((entry) => NAYIN[entry]!.name)).toEqual(["Sơn Đầu Hỏa", "Tích Lịch Hỏa", "Sa Trung Kim", "Lộ Bàng Thổ"]);
  });

  it("has a picture line and a question in both languages for every entry", () => {
    for (const entry of NAYIN) {
      expect(entry.imagery.vi.length).toBeGreaterThan(20);
      expect(entry.imagery.en.length).toBeGreaterThan(20);
      expect(entry.question.vi.endsWith("?")).toBe(true);
      expect(entry.question.en.endsWith("?")).toBe(true);
    }
  });
});
