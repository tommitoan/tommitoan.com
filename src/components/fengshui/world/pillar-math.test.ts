import { describe, expect, it } from "vitest";
import { dayPillar, monthPillar, pillarName } from "./pillar-math";

describe("day pillar", () => {
  it("matches known days", () => {
    expect(pillarName(dayPillar(2000, 1, 1))).toBe("Mậu Ngọ");
    // The sample chart of the Feng Shui page (Ất Hợi, Mậu Tý, Giáp Ngọ, Canh Ngọ) is the one of 29 December 1995.
    expect(pillarName(dayPillar(1995, 12, 29))).toBe("Giáp Ngọ");
    expect(pillarName(dayPillar(1995, 12, 15))).toBe("Canh Thìn");
    // The sixty-day cycle starts again after sixty days.
    expect(pillarName(dayPillar(2000, 3, 1))).toBe(pillarName(dayPillar(2000, 1, 1)));
    expect(dayPillar(2000, 1, 2)).toEqual({ stem: 5, branch: 7 });
  });

  it("steps one stem and one branch a day, across month and year ends", () => {
    const a = dayPillar(2026, 12, 31);
    const b = dayPillar(2027, 1, 1);
    expect(b.stem).toBe((a.stem + 1) % 10);
    expect(b.branch).toBe((a.branch + 1) % 12);
  });

  it("is always a stem 0 to 9 and a branch 0 to 11, and the two share parity", () => {
    for (let day = 1; day <= 60; day++) {
      const p = dayPillar(1990, 6, day);
      expect(p.stem).toBeGreaterThanOrEqual(0);
      expect(p.stem).toBeLessThan(10);
      expect(p.branch).toBeLessThan(12);
      expect(p.stem % 2).toBe(p.branch % 2);
    }
  });
});

describe("month pillar", () => {
  it("follows the five tigers rule for the Tiger month", () => {
    expect(pillarName(monthPillar("甲", 0))).toBe("Bính Dần");
    expect(pillarName(monthPillar("己", 0))).toBe("Bính Dần");
    expect(pillarName(monthPillar("乙", 0))).toBe("Mậu Dần");
    expect(pillarName(monthPillar("丙", 0))).toBe("Canh Dần");
    expect(pillarName(monthPillar("丁", 0))).toBe("Nhâm Dần");
    expect(pillarName(monthPillar("戊", 0))).toBe("Giáp Dần");
  });

  it("advances by one stem and one branch a month and ends in the Ox month", () => {
    expect(pillarName(monthPillar("甲", 1))).toBe("Đinh Mão");
    expect(pillarName(monthPillar("甲", 11))).toBe("Đinh Sửu");
    expect(pillarName(monthPillar("丙", 7))).toBe("Đinh Dậu");
  });

  it("keeps the stem and the branch the same colour of yin and yang", () => {
    for (const year of "甲乙丙丁戊己庚辛壬癸") {
      for (let order = 0; order < 12; order++) {
        const p = monthPillar(year, order);
        expect(p.stem % 2).toBe(p.branch % 2);
      }
    }
  });
});
