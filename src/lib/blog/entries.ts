/** Client-safe parts of the blog: types, grouping, language fallbacks and addresses. Nothing here imports the Markdown renderer. */

export const BLOG_LANGUAGES = ["vi", "en"] as const;
export type BlogLanguage = (typeof BLOG_LANGUAGES)[number];

export type Post = {
  slug: string;
  lang: BlogLanguage;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  description: string;
  html: string;
  minutes: number;
};

/** One entry of the list: a slug with every language it exists in. */
export type PostEntry = { slug: string; date: string; versions: Partial<Record<BlogLanguage, Post>> };

export class PostError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
  }
}

/** Groups posts by slug, newest first; a slug's date is the newest date of its versions. Same date: by slug. */
export function groupEntries(posts: readonly Post[]): PostEntry[] {
  const bySlug = new Map<string, PostEntry>();
  for (const post of posts) {
    const entry = bySlug.get(post.slug) ?? { slug: post.slug, date: post.date, versions: {} };
    if (entry.versions[post.lang]) throw new PostError(`${post.slug}.${post.lang}.md`, "the same post exists twice");
    entry.versions[post.lang] = post;
    if (post.date > entry.date) entry.date = post.date;
    bySlug.set(post.slug, entry);
  }
  return [...bySlug.values()].sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));
}

/** The version to show for a language: its own when it exists, otherwise the other language. */
export function versionFor(entry: PostEntry, lang: BlogLanguage): Post {
  const own = entry.versions[lang];
  if (own) return own;
  const other = BLOG_LANGUAGES.map((code) => entry.versions[code]).find((post): post is Post => post !== undefined);
  if (!other) throw new Error(`the entry ${entry.slug} has no version`);
  return other;
}

export const postPath = (post: Pick<Post, "lang" | "slug">): string => `/fengshui/blog/${post.lang}/${post.slug}/`;

/** The other language of a post, when it exists. */
export function translationOf(entry: PostEntry, post: Post): Post | null {
  const otherLang: BlogLanguage = post.lang === "vi" ? "en" : "vi";
  return entry.versions[otherLang] ?? null;
}

/** A post without its HTML: what a list page needs, small enough to send to the browser. */
export type PostSummary = Omit<Post, "html">;
export type SummaryEntry = { slug: string; date: string; versions: Partial<Record<BlogLanguage, PostSummary>> };

export function toSummaryEntry(entry: PostEntry): SummaryEntry {
  const versions: SummaryEntry["versions"] = {};
  for (const lang of BLOG_LANGUAGES) {
    const post = entry.versions[lang];
    if (post) {
      const { html: _html, ...rest } = post;
      void _html;
      versions[lang] = rest;
    }
  }
  return { slug: entry.slug, date: entry.date, versions };
}

/** The summary to show for a language, falling back to the other language. */
export function summaryFor(entry: SummaryEntry, lang: BlogLanguage): PostSummary {
  const found = entry.versions[lang] ?? BLOG_LANGUAGES.map((code) => entry.versions[code]).find((post) => post !== undefined);
  if (!found) throw new Error(`the entry ${entry.slug} has no version`);
  return found;
}
