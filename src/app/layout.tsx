import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans, Dancing_Script } from "next/font/google";
import { siteContent } from "@/content/site-content";
import "./globals.css";

const BASE = siteContent.siteMeta.domain;
const socialImage = `${BASE}/social-card.png`;
const avatarImage = `${BASE}/profile/avatar-cartoon.png`;

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const brandFont = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: `${siteContent.siteMeta.title} | Toan Ngo`,
    template: `%s | ${siteContent.siteMeta.title}`,
  },
  description: siteContent.siteMeta.description,
  applicationName: siteContent.siteMeta.title,
  authors: [{ name: "Toan Ngo", url: BASE }],
  creator: "Toan Ngo",
  publisher: "Toan Ngo",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Toan Ngo",
    "tommitoan",
    "toanngo",
    "tommitoan.com",
    "Go",
    "Golang",
    "gRPC",
    "Protobuf",
    "gRPC-Gateway",
    "Kafka",
    "RabbitMQ",
    "backend engineer",
    "microservices",
    "Kubernetes",
    "AWS",
    "GCP",
    "ArgoCD",
    "Helm",
    "Jenkins",
    "Jaeger",
    "Prometheus",
    "PostgreSQL",
    "Redis",
    "software engineer",
    "homelab",
    "k3s",
    "GitOps",
    "self-hosting",
    "Feng Shui",
    "bazica",
    "Ho Chi Minh City",
    "Vietnam",
  ],
  openGraph: {
    type: "website",
    url: BASE,
    title: `${siteContent.siteMeta.title} | Toan Ngo`,
    description: siteContent.siteMeta.description,
    siteName: siteContent.siteMeta.title,
    locale: "en_US",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: `${siteContent.siteMeta.title} — Toan Ngo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.siteMeta.title} | Toan Ngo`,
    description: siteContent.siteMeta.description,
    site: "@tommitoan",
    creator: "@tommitoan",
    images: [socialImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Toan Ngo",
    alternateName: ["tommitoan", "toanngo"],
    url: BASE,
    image: avatarImage,
    jobTitle: "Software Engineer",
    description: siteContent.siteMeta.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    sameAs: [
      "https://github.com/tommitoan",
      "https://www.linkedin.com/in/tommitoan/",
      "https://toanngo.cv/",
      "https://www.facebook.com/tommitoan1995/",
    ],
    knowsAbout: [
      "Go",
      "gRPC",
      "Microservices",
      "Kubernetes",
      "AWS",
      "GCP",
      "Event-driven architecture",
      "GitOps",
      "Feng Shui",
      "Homelab",
      "Self-hosting",
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteContent.siteMeta.title,
    url: BASE,
    description: siteContent.siteMeta.description,
    author: { "@type": "Person", name: "Toan Ngo" },
  };

  const jsonLd = [personLd, websiteLd];

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} ${brandFont.variable} m-0 p-0 antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
