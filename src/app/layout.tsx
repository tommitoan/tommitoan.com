import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteContent } from "@/content/site-content";
import "./globals.css";

const socialImage = `${siteContent.siteMeta.domain}/social-card.svg`;

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteContent.siteMeta.domain),
  title: {
    default: `${siteContent.siteMeta.title} | Software Engineer`,
    template: `%s | ${siteContent.siteMeta.title}`,
  },
  description: siteContent.siteMeta.description,
  applicationName: siteContent.siteMeta.title,
  authors: [{ name: "Toan Ngo" }],
  creator: "Toan Ngo",
  publisher: "Toan Ngo",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "tommitoan",
    "Toan Ngo",
    "software engineering",
    "homelab",
    "self-hosting",
    "digital products",
  ],
  openGraph: {
    type: "website",
    url: siteContent.siteMeta.domain,
    title: `${siteContent.siteMeta.title} | Software Engineer`,
    description: siteContent.siteMeta.description,
    siteName: siteContent.siteMeta.title,
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
    title: `${siteContent.siteMeta.title} | Software Engineer`,
    description: siteContent.siteMeta.description,
    creator: "@tommitoan",
    images: [socialImage],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Toan Ngo",
    alternateName: "tommitoan",
    url: siteContent.siteMeta.domain,
    description: siteContent.siteMeta.description,
    sameAs: [
      "https://github.com/tommitoan",
      "https://www.linkedin.com/in/tommitoan/",
    ],
  };

  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased m-0 p-0 overflow-hidden`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main id="main-content" className="w-full h-screen relative bg-[#f7f4ed]">
          {children}
        </main>
      </body>
    </html>
  );
}
