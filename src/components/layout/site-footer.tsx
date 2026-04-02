"use client";

import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="border-t border-white/8 py-8 text-sm text-white/46">
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>{siteContent.footer.note}</p>
        <p>Built as a multi-route space gateway with Next.js.</p>
      </div>
    </footer>
  );
}
