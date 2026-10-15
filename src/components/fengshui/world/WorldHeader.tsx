"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FengShuiLanguageToggle, useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { blogContent } from "@/content/fengshui-blog";
import { siteContent } from "@/content/site-content";

/** A slim fixed bar that stays readable over both the night sky and the paper. */
export function WorldHeader() {
  const pathname = usePathname();
  const copy = blogContent[useFengShuiLanguage()].nav;
  // The Feng Shui pages (blog, About) belong to this world; the first four links are the site's own.
  const items = [
    ...siteContent.navigation.map((item) => ({ key: item.label, label: item.label, href: item.href })),
    { key: "blog", label: copy.blog, href: "/fengshui/blog/" },
    { key: "about", label: copy.about, href: "/fengshui/about/" },
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
            // Blog posts live below /fengshui/blog/, so the Blog link stays current there; /fengshui itself is exact.
            const current = item.key === "blog" ? pathname.startsWith("/fengshui/blog") : pathname === href || pathname === `${base}/`;
            return (
              <Link key={item.key} href={item.href} aria-current={current ? "page" : undefined}>
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
