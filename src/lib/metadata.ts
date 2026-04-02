import type { Metadata } from "next";
import { siteContent } from "@/content/site-content";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
};

const BASE = siteContent.siteMeta.domain;
const socialImage = `${BASE}/social-card.png`;

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const { title, description, path = "/", keywords, robots } = options;
  const pageDescription = description ?? siteContent.siteMeta.description;
  const pageUrl = `${BASE}${path}`;
  const displayTitle = title ?? siteContent.siteMeta.title;

  return {
    title,
    description: pageDescription,
    metadataBase: new URL(BASE),
    alternates: {
      canonical: path,
    },
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      title: displayTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteContent.siteMeta.title,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${displayTitle} — Tommi Toan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: pageDescription,
      site: "@tommitoan",
      creator: "@tommitoan",
      images: [socialImage],
    },
  };
}
