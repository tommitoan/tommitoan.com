import { SHICHEN_VI, shichen } from "@kit/shichen";
import { BRANCHES_HAN } from "@kit/solar";

/** The footer clock: the current double-hour (canh giờ) with a countdown, and the ones before and after it. */

export interface DoubleHour {
  index: number;
  name: string;
  han: string;
  /** Local clock range, for example "15:00–17:00". Tý runs 23:00–01:00. */
  range: string;
}

export interface ClockView {
  previous: DoubleHour;
  current: DoubleHour & { remainingSeconds: number; progress: number };
  next: DoubleHour;
}

const DOUBLE_HOUR_SECONDS = 7200;
const pad = (value: number): string => String(value).padStart(2, "0");

export function doubleHour(index: number): DoubleHour {
  const i = ((index % 12) + 12) % 12;
  const start = (i * 2 + 23) % 24;
  const end = (i * 2 + 1) % 24;
  return { index: i, name: SHICHEN_VI[i], han: BRANCHES_HAN[i], range: `${pad(start)}:00–${pad(end)}:00` };
}

/** The double-hour for a clock time, the seconds left in it (never 0: at the boundary a new one begins) and how far through it we are. */
export function clockView(date: Date): ClockView {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const index = shichen(hours, minutes).index;
  const endHour = (index * 2 + 1) % 24;
  let remainingSeconds = (endHour * 3600 - (hours * 3600 + minutes * 60 + seconds) + 86400) % 86400;
  if (remainingSeconds === 0) remainingSeconds = DOUBLE_HOUR_SECONDS;
  return {
    previous: doubleHour(index + 11),
    current: { ...doubleHour(index), remainingSeconds, progress: 1 - remainingSeconds / DOUBLE_HOUR_SECONDS },
    next: doubleHour(index + 1),
  };
}

/** Seconds as "mm:ss"; a double-hour has up to 120 minutes, so the minutes may reach three digits. */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`;
}
