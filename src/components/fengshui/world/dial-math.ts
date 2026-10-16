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

/** True for the twelve "opening" terms (jie) that start a Ba-zi month; the other twelve fall in the middle of a month. */
export const isMonthOpener = (termIndex: number): boolean => (JIE_INDEXES as readonly number[]).includes(termIndex);

/**
 * Where a label goes on the ring and how it is turned, so that it runs along the radius and stays readable: on the left
 * half it is flipped and anchored at its end.
 */
export function radialLabel(longitude: number, radius: number, centre: Point): { x: number; y: number; rotation: number; anchor: "start" | "end" } {
  const point = ringPoint(longitude, radius, centre);
  const onLeft = Math.cos((longitude * Math.PI) / 180) < -1e-9;
  return { x: point.x, y: point.y, rotation: onLeft ? 180 - longitude : -longitude, anchor: onLeft ? "end" : "start" };
}

/** Days per second that make the Sun cross one solar term in about three seconds: 24 terms in 72 seconds. */
export const SECONDS_PER_TERM = 3;
export const daysPerSecond = (year: number): number => daysInYear(year) / (24 * SECONDS_PER_TERM);

/** The ecliptic longitude of a point seen from the ring's centre, 0 to the right and counter-clockwise, like ringPoint. */
export function longitudeAt(point: Point, centre: Point): number {
  const degrees = (Math.atan2(centre.y - point.y, point.x - centre.x) * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
}

const tables = new Map<number, number[]>();

/** The Sun's longitude at noon on every day of a year (cached, 365 or 366 entries). */
export function longitudeTable(year: number): number[] {
  const known = tables.get(year);
  if (known) return known;
  const table = Array.from({ length: daysInYear(year) }, (_, day) => solarLongitude(noonUtc(year, day)));
  tables.set(year, table);
  return table;
}

/** The day of the year on which the Sun is nearest to a longitude, so the pointer can pick a day by where it is on the ring. */
export function dayForLongitude(year: number, longitude: number): number {
  const table = longitudeTable(year);
  let best = 0;
  let bestGap = 360;
  table.forEach((value, day) => {
    const gap = Math.abs((((value - longitude) % 360) + 540) % 360 - 180);
    if (gap < bestGap) {
      best = day;
      bestGap = gap;
    }
  });
  return best;
}

/** The Sun's longitude at a fractional day of the year (day 3.5 is noon plus half a day after 4 January's noon), for smooth movement. */
export function longitudeAtDay(year: number, day: number): number {
  const whole = Math.floor(day);
  return solarLongitude(noonUtc(year, whole) + (day - whole) * 86400000);
}

/** The twelve calendar months of a year: where each starts (a day index, 0 is 1 January) and how many days it has. */
export function monthSpans(year: number): Array<{ month: number; start: number; days: number }> {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return { month, start: dayIndexOf(year, month, 1), days: new Date(Date.UTC(year, month, 0)).getUTCDate() };
  });
}

