"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(4,8,20,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex min-w-fit items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500/70 to-cyan-400/40 shadow-[0_0_10px_rgba(139,92,246,0.35)]">
            <Image src="/profile/avatar-cartoon.png" alt="tommitoan" width={36} height={36} className="h-full w-full object-cover" />
          </span>
          <span className="font-[family-name:var(--font-brand)] text-[2rem] leading-none tracking-normal text-white">tommitoan</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2 text-sm text-white/60">
          {siteContent.navigation.map((item) => {
            const href = item.href === "/#home" ? "/" : item.href;
            const isExternal = "external" in item && item.external;
            const isCurrent = !isExternal && pathname === href;

            return (
              <Link
                key={item.label}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                aria-current={isCurrent ? "page" : undefined}
                className="rounded-full px-3 py-2 transition hover:bg-white/7 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
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
