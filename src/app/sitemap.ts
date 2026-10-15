import type { MetadataRoute } from "next";
import { siteContent } from "@/content/site-content";
import { blogSitemap } from "@/lib/blog/sitemap";
import { loadEntries } from "@/lib/blog/load";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteContent.siteMeta.domain;

  return [
    { url: `${baseUrl}/`, priority: 1, lastModified: new Date("2025-06-01"), changeFrequency: "weekly" },
    { url: `${baseUrl}/tech/`, priority: 0.9, lastModified: new Date("2025-06-01"), changeFrequency: "monthly" },
    { url: `${baseUrl}/fengshui/`, priority: 0.9, lastModified: new Date("2026-10-14"), changeFrequency: "monthly" },
    { url: `${baseUrl}/fengshui/about/`, priority: 0.7, lastModified: new Date("2026-10-15"), changeFrequency: "yearly" },
    ...blogSitemap(loadEntries(), baseUrl),
  ];
}
