"use client";

import { useFengShuiLanguage } from "@/components/fengshui/FengShuiLanguage";
import { errorContent } from "@/content/fengshui-errors";

/** The first stop of the keyboard: jumps past the header to the page content. Hidden until it has the focus. */
export function SkipLink() {
  const copy = errorContent[useFengShuiLanguage()];
  return (
    <a href="#fs-main" className="fs-skip">
      {copy.skip}
    </a>
  );
}
