"use client";

import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";
import { useTheme } from "@/lib/theme";

export function SiteFooter() {
  const pathname = usePathname();
  const { theme } = useTheme();

  if (pathname === "/") {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <footer className={`border-t py-8 text-sm transition-colors duration-300 ${
      isDark ? "border-white/8 text-white/46" : "border-black/8 text-gray-400"
    }`}>
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>{siteContent.footer.note}</p>
        <p>Built as a multi-route space gateway with Next.js.</p>
      </div>
    </footer>
  );
}
