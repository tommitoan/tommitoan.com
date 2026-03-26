"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-[rgba(247,244,237,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="rounded-full bg-[#f4ea52] px-3 py-1 text-sm font-semibold tracking-[-0.05em] text-[#3a3a10] sm:text-[15px]">
          Tommi Toan
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2 text-sm text-black/60">
          {siteContent.navigation.map((item) => {
            const isHomeItem = item.href === "/#home";
            const isCurrent = !item.external && isHomeItem && pathname === "/";

            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                aria-current={isCurrent ? "page" : undefined}
                className="rounded-full px-3 py-2 transition hover:bg-black/5 hover:text-black aria-[current=page]:bg-black/6 aria-[current=page]:text-black"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
