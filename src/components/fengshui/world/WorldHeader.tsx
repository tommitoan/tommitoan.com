"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FengShuiLanguageToggle } from "@/components/fengshui/FengShuiLanguage";
import { siteContent } from "@/content/site-content";

/** A slim fixed bar that stays readable over both the night sky and the paper. */
export function WorldHeader() {
  const pathname = usePathname();
  return (
    <header className="fs-header">
      <div className="fs-header-inner">
        <Link href="/" className="fs-brand">
          tommitoan
        </Link>
        <nav aria-label="Primary" className="fs-nav">
          {siteContent.navigation.map((item) => {
            const href = item.href === "/#home" ? "/" : item.href;
            const current = pathname === href || pathname === `${href}/`;
            return (
              <Link key={item.label} href={item.href} aria-current={current ? "page" : undefined}>
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
