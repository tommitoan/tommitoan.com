"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FengShuiLanguageToggle, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { siteContent } from "@/content/site-content";
import { BAZI_ORIGIN } from "@/lib/sister-site";

/**
 * Routes with large bundles (the gateway and the Tech and Discover pages load the 3D and CV code). Next prefetches every
 * visible link, so these are left to load when clicked instead of being downloaded on every Feng Shui page.
 */
const HEAVY_ROUTES = new Set(["/", "/tech", "/discover"]);

/** A slim fixed bar that stays readable over both the night sky and the paper. */
export function WorldHeader() {
  const pathname = usePathname();
  const copy = useFengShuiWorldCopy().nav;
  // The blog and the About page live on the Ba-zi site, so those two are plain links to it (the kit covers the page
  // change with the same slats as between any two pages of the family); the first four links are this site's own.
  const items = siteContent.navigation.map((item) => ({ key: item.label, label: item.label, href: item.href }));
  const baziLinks = [
    { key: "blog", label: copy.blog, href: `${BAZI_ORIGIN}/blog` },
    { key: "about", label: copy.about, href: `${BAZI_ORIGIN}/about` },
  ];
  return (
    <header className="fs-header">
      <div className="fs-header-inner">
        <Link href="/" className="fs-brand">
          tommitoan
        </Link>
        <nav aria-label="Primary" className="fs-nav">
          {items.map((item) => {
            const href = item.href === "/#home" ? "/" : item.href;
            const base = href.replace(/\/$/, "");
            const current = pathname === href || pathname === `${base}/`;
            return (
              <Link key={item.key} href={item.href} prefetch={HEAVY_ROUTES.has(href) ? false : undefined} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          {baziLinks.map((link) => (
            <a key={link.key} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <FengShuiLanguageToggle />
      </div>
    </header>
  );
}
