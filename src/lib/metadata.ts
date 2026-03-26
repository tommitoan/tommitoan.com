import type { Metadata } from "next";
import { siteContent } from "@/content/site-content";

type MetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
};

const socialImage = `${siteContent.siteMeta.domain}/social-card.svg`;

export function createMetadata(options: MetadataOptions = {}): Metadata {
  const { title, description, path = "/" } = options;
  const pageTitle = title
    ? `${title} | ${siteContent.siteMeta.title}`
    : `${siteContent.siteMeta.title} | Software Engineer`;

  const pageDescription = description ?? siteContent.siteMeta.description;
  const pageUrl = `${siteContent.siteMeta.domain}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteContent.siteMeta.domain),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      siteName: siteContent.siteMeta.title,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${siteContent.siteMeta.title} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [socialImage],
    },
  };
}
