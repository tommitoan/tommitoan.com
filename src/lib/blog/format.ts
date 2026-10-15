import type { BlogLanguage } from "./posts";

const LOCALE: Record<BlogLanguage, string> = { vi: "vi-VN", en: "en-GB" };

/** A post date (YYYY-MM-DD) as a long date in the post's language. The zone is fixed so server and browser agree. */
export function formatPostDate(date: string, lang: BlogLanguage): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
