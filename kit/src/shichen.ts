import { BRANCHES_HAN } from "./solar";

/** The twelve double-hours (canh giờ). Tý runs from 23:00 to 01:00. */
export const SHICHEN_VI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;

export interface Shichen {
  index: number;
  name: string;
  han: string;
  minutesLeft: number;
}

/** Double-hour for a local clock time, and the minutes until the next one starts. */
export function shichen(hours: number, minutes: number): Shichen {
  const index = Math.floor(((hours + 1) % 24) / 2);
  const endHour = (index * 2 + 1) % 24;
  let minutesLeft = (endHour * 60 - (hours * 60 + minutes) + 1440) % 1440;
  if (minutesLeft === 0) minutesLeft = 120;
  return { index, name: SHICHEN_VI[index], han: BRANCHES_HAN[index], minutesLeft };
}
