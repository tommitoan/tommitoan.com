import { clamp } from "@kit/color";
import { baziYear, ganzhiYear, monthBranch, solarLongitude, solarTerm, SOLAR_TERMS_VI, type Ganzhi } from "@kit/solar";
import type { Point } from "./scene-math";

/** Han names of the 24 solar terms, in the same order as the kit's Vietnamese names (starting at 0 degrees). */
export const SOLAR_TERMS_HAN = [
  "春分", "清明", "穀雨", "立夏", "小滿", "芒種",
  "夏至", "小暑", "大暑", "立秋", "處暑", "白露",
  "秋分", "寒露", "霜降", "立冬", "小雪", "大雪",
  "冬至", "小寒", "大寒", "立春", "雨水", "驚蟄",
] as const;

/** Indexes of the 12 "jie" terms that open a Ba-zi month, from Lichun (315 degrees) round the ring. */
export const JIE_INDEXES = [21, 23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19] as const;

export interface DialState {
  year: number;
  dayIndex: number;
  longitude: number;
  term: { index: number; name: string; han: string };
  month: { index: number; name: string; han: string };
  baziYear: number;
  pillar: Ganzhi;
  beforeLichun: boolean;
  calendar: { month: number; day: number };
}

export const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export const daysInYear = (year: number): number => (isLeapYear(year) ? 366 : 365);

/** Noon UTC of the nth day of a year (0 is 1 January), the moment the dial reads the Sun at. */
export const noonUtc = (year: number, dayIndex: number): number => Date.UTC(year, 0, 1 + dayIndex, 12);

/** Day index (0 is 1 January) of a calendar date, using its own year, month and day. */
export function dayIndexOf(year: number, month: number, day: number): number {
  return Math.round((Date.UTC(year, month - 1, day, 12) - Date.UTC(year, 0, 1, 12)) / 86400000);
}

export function dialState(year: number, dayIndex: number): DialState {
  const index = clamp(Math.round(dayIndex), 0, daysInYear(year) - 1);
  const ms = noonUtc(year, index);
  const longitude = solarLongitude(ms);
  const date = new Date(ms);
  const term = solarTerm(longitude);
  const month = monthBranch(longitude);
  const byear = baziYear(date);
  return {
    year,
    dayIndex: index,
    longitude,
    term: { index: term.index, name: term.name, han: SOLAR_TERMS_HAN[term.index] },
    month: { index: month.index, name: month.name, han: month.han },
    baziYear: byear,
    pillar: ganzhiYear(byear),
    beforeLichun: byear < year,
    calendar: { month: date.getUTCMonth() + 1, day: date.getUTCDate() },
  };
}

/** Point on a ring for an ecliptic longitude, with 0 degrees to the right and angles running counter-clockwise. */
export function ringPoint(longitude: number, radius: number, centre: Point): Point {
  const angle = (longitude * Math.PI) / 180;
  return { x: centre.x + radius * Math.cos(angle), y: centre.y - radius * Math.sin(angle) };
}

export const termName = (index: number): string => SOLAR_TERMS_VI[index];

/** The day of the year (0 is 1 January) the pinned dial shows for a scroll progress from 0 to 1: one turn of the Sun over the whole section. */
export function dialDay(progress: number, year: number): number {
  return Math.round(clamp(progress, 0, 1) * (daysInYear(year) - 1));
}

/**
 * SVG path of the arc the Sun has travelled, from one ecliptic longitude to another, going the way longitudes increase
 * (counter-clockwise on the ring). Empty while the Sun has hardly moved; it stops just short of a full circle.
 */
export function arcPath(fromLongitude: number, toLongitude: number, radius: number, centre: Point): string {
  const sweep = (((toLongitude - fromLongitude) % 360) + 360) % 360;
  if (sweep < 0.2) return "";
  const start = ringPoint(fromLongitude, radius, centre);
  const end = ringPoint(fromLongitude + Math.min(sweep, 359.9), radius, centre);
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 0 ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}
