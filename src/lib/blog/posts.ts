import { FrontMatterError, parseFrontMatter } from "./front-matter";
import { countWords, readingMinutes, renderMarkdown } from "./markdown";
import { PostError, type BlogLanguage, type Post } from "./entries";

export { PostError } from "./entries";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FILE = /^(.+)\.(vi|en)\.md$/;

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
