import type { MetadataRoute } from "next";
import { siteContent } from "@/content/site-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteContent.siteMeta.domain;

  return [
    { url: `${baseUrl}/`, priority: 1 },
    { url: `${baseUrl}/tech/`, priority: 0.9 },
    { url: `${baseUrl}/discover/`, priority: 0.85 },
    { url: `${baseUrl}/fengshui/`, priority: 0.8 },
  ];
}
