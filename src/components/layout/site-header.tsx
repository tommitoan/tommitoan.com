"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "@/lib/theme";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? "border-white/8 bg-[rgba(4,8,20,0.72)]"
          : "border-black/8 bg-[rgba(255,255,255,0.72)]"
      }`}
    >
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex min-w-fit items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500/70 to-cyan-400/40 shadow-[0_0_10px_rgba(139,92,246,0.35)]">
            <Image src="/profile/avatar-cartoon.png" alt="tommitoan" width={36} height={36} className="h-full w-full object-cover" />
          </span>
          <span className={`font-[family-name:var(--font-brand)] text-[2rem] leading-none tracking-normal ${isDark ? "text-white" : "text-gray-900"}`}>
            tommitoan
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className={`flex flex-wrap items-center gap-2 text-sm ${isDark ? "text-white/60" : "text-gray-500"}`}>
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
                  className={`rounded-full px-3 py-2 transition ${
                    isDark
                      ? "hover:bg-white/7 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
                      : "hover:bg-black/5 hover:text-gray-900 aria-[current=page]:bg-black/8 aria-[current=page]:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
