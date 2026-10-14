/**
 * Apparent position of the Sun and what it means for a Ba-zi chart.
 * The month pillar changes every 30 degrees of ecliptic longitude starting at 315 (Lichun),
 * and the year pillar changes at Lichun. Low-precision series, accurate to about 0.05 degrees
 * (checked against the equinox and both solstices); chart pages should use values from bazica.
 */

export const STEMS_HAN = "甲乙丙丁戊己庚辛壬癸";
export const BRANCHES_HAN = "子丑寅卯辰巳午未申酉戌亥";

/** The 24 solar terms in order of ecliptic longitude, starting at 0 degrees. */
export const SOLAR_TERMS_VI = [
  "Xuân Phân", "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng",
  "Hạ Chí", "Tiểu Thử", "Đại Thử", "Lập Thu", "Xử Thử", "Bạch Lộ",
  "Thu Phân", "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết",
  "Đông Chí", "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập",
] as const;

/** Month branches in the order the Ba-zi months run, starting at Lichun. */
export const MONTH_BRANCHES_VI = ["Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu"] as const;
const MONTH_BRANCHES_HAN = "寅卯辰巳午未申酉戌亥子丑";

export const LICHUN_LONGITUDE = 315;

/** Ecliptic longitude of the Sun in degrees (0 to 360) at a UTC time in milliseconds. */
export function solarLongitude(utcMs: number): number {
  const jd = utcMs / 86400000 + 2440587.5;
  const n = jd - 2451545;
  const meanLongitude = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) * Math.PI) / 180;
  const lambda = meanLongitude + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return ((lambda % 360) + 360) % 360;
}

export interface SolarTerm {
  index: number;
  name: string;
  startsAt: number;
}

/** The solar term that began most recently at this longitude. */
export function solarTerm(longitude: number): SolarTerm {
  const index = Math.floor((((longitude % 360) + 360) % 360) / 15);
  return { index, name: SOLAR_TERMS_VI[index], startsAt: index * 15 };
}

export interface MonthBranch {
  index: number;
  name: string;
  han: string;
}

/** The Ba-zi month branch for a longitude: Tiger from Lichun, then every 30 degrees. */
export function monthBranch(longitude: number): MonthBranch {
  const index = Math.floor((((longitude - LICHUN_LONGITUDE) % 360 + 360) % 360) / 30);
  return { index, name: MONTH_BRANCHES_VI[index], han: MONTH_BRANCHES_HAN[index] };
}

/** The Ba-zi year of a date: the civil year, or the year before when Lichun has not come yet. */
export function baziYear(date: Date): number {
  const longitude = solarLongitude(date.getTime());
  const beforeLichun = date.getUTCMonth() < 2 && longitude >= 270 && longitude < LICHUN_LONGITUDE;
  return date.getUTCFullYear() - (beforeLichun ? 1 : 0);
}

export interface Ganzhi {
  stem: string;
  branch: string;
  han: string;
}

/** Stem and branch of a year (4 CE is Jia Zi). */
export function ganzhiYear(year: number): Ganzhi {
  const stem = STEMS_HAN[(((year - 4) % 10) + 10) % 10];
  const branch = BRANCHES_HAN[(((year - 4) % 12) + 12) % 12];
  return { stem, branch, han: stem + branch };
}
