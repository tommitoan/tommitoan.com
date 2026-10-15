import { parseFrontMatter, FrontMatterError } from "./front-matter";
import { countWords, readingMinutes, renderMarkdown } from "./markdown";

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

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE = /^(.+)\.(vi|en)\.md$/;

export class PostError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
  }
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/**
 * Turns one file into a post. The file name is `<slug>.<lang>.md`; the front matter needs `title`, `date` and
 * `description`. A post marked `draft: true` is left out (returns null). Anything wrong stops the build with the file name.
 */
export function parsePostFile(file: string, raw: string): Post | null {
  const name = FILE.exec(file);
  if (!name) throw new PostError(file, "the file name must be <slug>.<vi|en>.md");
  const [, slug, lang] = name;
  if (!SLUG.test(slug)) throw new PostError(file, `the slug "${slug}" must be lowercase letters, digits and single hyphens`);
  let parsed;
  try {
    parsed = parseFrontMatter(raw);
  } catch (error) {
    if (error instanceof FrontMatterError) throw new PostError(file, error.message);
    throw error;
  }
  const { data, body } = parsed;
  for (const key of ["title", "date", "description"]) {
    if (!data[key]) throw new PostError(file, `the front matter lacks "${key}"`);
  }
  if (!validDate(data.date)) throw new PostError(file, `the date "${data.date}" must be a real date as YYYY-MM-DD`);
  if (data.draft === "true") return null;
  if (!body.trim()) throw new PostError(file, "the post has no text");
  return {
    slug,
    lang: lang as BlogLanguage,
    title: data.title,
    date: data.date,
    description: data.description,
    html: renderMarkdown(body),
    minutes: readingMinutes(countWords(body)),
  };
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
