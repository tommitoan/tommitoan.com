import type { MetadataRoute } from "next";
import { BLOG_LANGUAGES, postPath, type PostEntry } from "./entries";

/** Sitemap rows for the blog: the list, then every post version. A post that exists in both languages names the other one. */
export function blogSitemap(entries: readonly PostEntry[], baseUrl: string): MetadataRoute.Sitemap {
  const newest = entries.reduce((latest, entry) => (entry.date > latest ? entry.date : latest), "");
  const rows: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/fengshui/blog/`, priority: 0.7, changeFrequency: "weekly", ...(newest ? { lastModified: new Date(`${newest}T00:00:00Z`) } : {}) },
  ];
  for (const entry of entries) {
    const versions = BLOG_LANGUAGES.flatMap((code) => (entry.versions[code] ? [entry.versions[code]] : []));
    const languages = versions.length > 1 ? Object.fromEntries(versions.map((post) => [post.lang, `${baseUrl}${postPath(post)}`])) : undefined;
    for (const post of versions) {
      rows.push({
        url: `${baseUrl}${postPath(post)}`,
        priority: 0.6,
        lastModified: new Date(`${post.date}T00:00:00Z`),
        changeFrequency: "yearly",
        ...(languages ? { alternates: { languages } } : {}),
      });
    }
  }
  return rows;
}
