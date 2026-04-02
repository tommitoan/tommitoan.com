import type { MetadataRoute } from "next";
import { siteContent } from "@/content/site-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteContent.siteMeta.domain;

  return [
    { url: `${baseUrl}/`, priority: 1, lastModified: new Date("2025-06-01"), changeFrequency: "weekly" },
    { url: `${baseUrl}/tech/`, priority: 0.9, lastModified: new Date("2025-06-01"), changeFrequency: "monthly" },
  ];
}
