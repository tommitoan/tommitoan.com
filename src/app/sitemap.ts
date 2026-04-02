import type { MetadataRoute } from "next";
import { siteContent } from "@/content/site-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteContent.siteMeta.domain;
  const now = new Date();

  return [
    { url: `${baseUrl}/`, priority: 1, lastModified: now, changeFrequency: "weekly" },
    { url: `${baseUrl}/tech/`, priority: 0.9, lastModified: now, changeFrequency: "monthly" },
    { url: `${baseUrl}/discover/`, priority: 0.7, lastModified: now, changeFrequency: "monthly" },
    { url: `${baseUrl}/fengshui/`, priority: 0.7, lastModified: now, changeFrequency: "monthly" },
  ];
}
