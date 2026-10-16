"use client";

import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

/**
 * The page's main heading. The page opens straight into the birth scene, whose text is painted on a canvas stage and
 * is not a heading, so the title stays in the document for screen readers and search engines without being drawn.
 */
export function FengShuiPageTitle() {
  const copy = useFengShuiCopy();
  return <h1 className="sr-only">{copy.title}</h1>;
}
