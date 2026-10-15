/** A birth date typed as dd/mm/yyyy: a mask that adds the slashes while typing, and a strict reader. */

/** Keeps the digits (at most eight) and puts a slash after the day and after the month, so typing 29121995 reads 29/12/1995. */
export function maskDmy(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter((part) => part !== "");
  return parts.join("/");
}

export interface DmyDate {
  year: number;
  month: number;
  day: number;
}

const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** The date in "dd/mm/yyyy", or null unless it is a real calendar date from 1900 to 2100. */
export function parseDmy(text: string): DmyDate | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}
