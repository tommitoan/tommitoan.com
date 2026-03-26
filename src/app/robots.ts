import type { MetadataRoute } from "next";
import { siteContent } from "@/content/site-content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteContent.siteMeta.domain}/sitemap.xml`,
  };
}
