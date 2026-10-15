"use client";

import Link from "next/link";
import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { blogContent } from "@/content/fengshui-blog";
import type { BlogLanguage } from "@/lib/blog/posts";

type Props = { lang: BlogLanguage; translation: { href: string; lang: BlogLanguage } | null };

/**
 * A post is in one language, fixed by its address. When the visitor's chosen language differs, say so and link to the
 * translation if there is one; the page itself is never switched under the reader.
 */
export function PostNotice({ lang, translation }: Props) {
  const current = useFengShuiLanguage();
  if (current === lang) return null;
  const copy = blogContent[current].post;
  return (
    <p className="fs-notice" role="note" lang={current}>
      {translation ? (
        <>
          {copy.translation(copy.languageName[translation.lang])}{" "}
          <Link href={translation.href} hrefLang={translation.lang} className="fs-link">
            {copy.readIn} →
          </Link>
        </>
      ) : (
        copy.onlyInThisLanguage
      )}
    </p>
  );
}
