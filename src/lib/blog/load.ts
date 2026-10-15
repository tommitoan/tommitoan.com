import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { groupEntries, parsePostFile, type BlogLanguage, type Post, type PostEntry } from "./posts";

const DIRECTORY = path.join(process.cwd(), "content", "blog");

/** Reads every post at build time. A malformed post stops the build with its file name. */
export function loadPosts(directory: string = DIRECTORY): Post[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => parsePostFile(file, readFileSync(path.join(directory, file), "utf8")))
    .filter((post): post is Post => post !== null);
}

export const loadEntries = (): PostEntry[] => groupEntries(loadPosts());

export function findEntry(slug: string): PostEntry | undefined {
  return loadEntries().find((entry) => entry.slug === slug);
}

export function findPost(lang: BlogLanguage, slug: string): { entry: PostEntry; post: Post } | undefined {
  const entry = findEntry(slug);
  const post = entry?.versions[lang];
  return entry && post ? { entry, post } : undefined;
}
