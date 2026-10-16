import { describe, expect, it } from "vitest";
import { TERMS } from "@/content/fengshui-terms";
import { BRANCHES } from "@/content/fengshui-branches";
import { liuChong, liuHe, monthTermIndex, ringPercent, sanHe, yearsOf } from "./branch-math";

describe("branches", () => {
  it("pairs the six harmonies", () => {
    // Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
    expect([0, 2, 3, 4, 5, 6].map(liuHe)).toEqual([1, 11, 10, 9, 8, 7]);
    for (let b = 0; b < 12; b += 1) expect(liuHe(liuHe(b))).toBe(b);
  });

  it("puts the six clashes opposite each other", () => {
    expect([0, 1, 2, 3, 4, 5].map(liuChong)).toEqual([6, 7, 8, 9, 10, 11]);
    for (let b = 0; b < 12; b += 1) expect(liuChong(liuChong(b))).toBe(b);
  });

  it("opens each Ba-zi month with the right solar term", () => {
    const opening = (b: number) => TERMS[monthTermIndex(b)]!.vi;
    expect(opening(2)).toBe("Lập Xuân"); // Dần
    expect(opening(3)).toBe("Kinh Trập");
    expect(opening(4)).toBe("Thanh Minh");
    expect(opening(5)).toBe("Lập Hạ");
    expect(opening(6)).toBe("Mang Chủng");
    expect(opening(7)).toBe("Tiểu Thử");
    expect(opening(8)).toBe("Lập Thu");
    expect(opening(9)).toBe("Bạch Lộ");
    expect(opening(10)).toBe("Hàn Lộ");
    expect(opening(11)).toBe("Lập Đông");
    expect(opening(0)).toBe("Đại Tuyết"); // Tý
    expect(opening(1)).toBe("Tiểu Hàn");
  });

  it("names the years of a branch twelve years apart", () => {
    expect(yearsOf(0)).toEqual([1996, 2008, 2020]); // Tý
    expect(yearsOf(6)).toEqual([2002, 2014, 2026]); // Ngọ
  });

  it("places Tý at the top and Mão at the right of the ring", () => {
    expect(ringPercent(0, 40)).toEqual({ left: 50, top: 10 });
    const mao = ringPercent(3, 40);
    expect(mao.left).toBeCloseTo(90);
    expect(mao.top).toBeCloseTo(50);
  });

  it("has a row of data for each branch", () => {
    expect(BRANCHES).toHaveLength(12);
    for (const info of BRANCHES) expect(info.hidden.length).toBeGreaterThan(0);
  });

  it("groups the four three-harmony frames", () => {
    // Thân Tý Thìn (Water), Hợi Mão Mùi (Wood), Dần Ngọ Tuất (Fire), Tỵ Dậu Sửu (Metal)
    expect(sanHe(0)).toEqual({ others: [4, 8], element: "water" });
    expect(sanHe(8)).toEqual({ others: [0, 4], element: "water" });
    expect(sanHe(11)).toEqual({ others: [3, 7], element: "wood" });
    expect(sanHe(6)).toEqual({ others: [2, 10], element: "fire" });
    expect(sanHe(9)).toEqual({ others: [1, 5], element: "metal" });
    for (let b = 0; b < 12; b += 1) {
      const { others } = sanHe(b);
      expect(others).not.toContain(b);
      expect(sanHe(others[0]).others).toContain(b);
    }
  });
});
