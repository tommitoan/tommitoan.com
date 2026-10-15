"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FengShuiLanguageToggle } from "@/components/fengshui/FengShuiLanguage";
import { siteContent } from "@/content/site-content";

/**
 * Routes with large bundles (the gateway and the Tech and Discover pages load the 3D and CV code). Next prefetches every
 * visible link, so these are left to load when clicked instead of being downloaded on every Feng Shui page.
 */
const HEAVY_ROUTES = new Set(["/", "/tech", "/discover"]);

/** A slim fixed bar that stays readable over both the night sky and the paper. */
export function WorldHeader() {
  const pathname = usePathname();
  // Only this site's own pages: the blog and the About page belong to the Ba-zi site and are reached from there.
  const items = siteContent.navigation.map((item) => ({ key: item.label, label: item.label, href: item.href }));
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
        </nav>
        <FengShuiLanguageToggle />
      </div>
    </header>
  );
}
