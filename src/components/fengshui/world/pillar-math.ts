import { SHICHEN_VI } from "@kit/shichen";
import { STEMS_HAN } from "@kit/solar";

/** Names of the ten stems in Vietnamese, Giáp to Quý. The twelve branches are in SHICHEN_VI (Tý to Hợi). */
export const STEM_NAMES_VI = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;

export interface Pillar {
  stem: number;
  branch: number;
}

/** "Bính Dần" for a pillar. */
export const pillarName = (pillar: Pillar): string => `${STEM_NAMES_VI[pillar.stem]} ${SHICHEN_VI[pillar.branch]}`;

/**
 * The Month Pillar for a Ba-zi month. `monthOrder` counts from the Tiger month that Lichun opens (0), and `yearStemHan`
 * is the stem of the Ba-zi year. The month stem follows the "five tigers" rule: the Tiger month of a Giáp or Kỷ year has
 * stem Bính, of Ất or Canh Mậu, of Bính or Tân Canh, of Đinh or Nhâm Nhâm, of Mậu or Quý Giáp, and it advances by one a month.
 */
export function monthPillar(yearStemHan: string, monthOrder: number): Pillar {
  const yearStem = Math.max(0, STEMS_HAN.indexOf(yearStemHan));
  const order = ((monthOrder % 12) + 12) % 12;
  return { stem: ((yearStem % 5) * 2 + 2 + order) % 10, branch: (order + 2) % 12 };
}

/**
 * The Day Pillar of a calendar date (the date at midday, so no time zone question arises). Counting days from the day
 * number of 1 January 2000, a Mậu Ngọ day, the sixty-day cycle gives the stem and branch. A birth from 23:00 may belong to
 * the next day's pillar under some conventions; the chart on Bazica Web applies its own rule.
 */
export function dayPillar(year: number, month: number, day: number): Pillar {
  const julianDayNumber = Math.round(Date.UTC(year, month - 1, day) / 86400000) + 2440588;
  const index = (((julianDayNumber + 49) % 60) + 60) % 60;
  return { stem: index % 10, branch: index % 12 };
}
