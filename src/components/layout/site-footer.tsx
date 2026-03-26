"use client";

import { usePathname } from "next/navigation";
import { siteContent } from "@/content/site-content";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="border-t border-black/6 py-8 text-sm text-black/48">
      <div className="mx-auto flex w-[min(1120px,calc(100%-1.5rem))] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>{siteContent.footer.note}</p>
        <p>Built with Next.js and a simple one-page layout.</p>
      </div>
    </footer>
  );
}
