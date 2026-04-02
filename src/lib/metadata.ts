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
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
};

const BASE = siteContent.siteMeta.domain;
const defaultSocialImage = `${BASE}/social-card.png`;

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const { title, description, path = "/", keywords, robots, image } = options;
  const pageDescription = description ?? siteContent.siteMeta.description;
  const pageUrl = `${BASE}${path}`;
  const displayTitle = title ?? siteContent.siteMeta.title;

  const ogImage = image
    ? { url: `${BASE}${image.url}`, width: image.width, height: image.height, alt: image.alt }
    : { url: defaultSocialImage, width: 1200, height: 630, alt: `${displayTitle} — Tommi Toan` };

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
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: pageDescription,
      site: "@tommitoan",
      creator: "@tommitoan",
      images: [ogImage.url],
    },
  };
}
