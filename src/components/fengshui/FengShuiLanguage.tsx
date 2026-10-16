"use client";

import {
  DEFAULT_FENGSHUI_LANGUAGE,
  fengshuiContent,
  type FengShuiCopy,
  type FengShuiLanguage,
} from "@/content/fengshui-content";
import { worldContent, type WorldCopy } from "@/content/fengshui-world";
import { setSiteLanguage, useSiteLanguage } from "@/lib/site-language";

/** Vietnamese is the server and first-render language; after hydration a stored choice applies, or the browser's own language and time zone decide (see site-language.ts). */
export function useFengShuiLanguage(): FengShuiLanguage {
  return useSiteLanguage(DEFAULT_FENGSHUI_LANGUAGE);
}

export function useFengShuiCopy(): FengShuiCopy {
  return fengshuiContent[useFengShuiLanguage()];
}

/** Copy of the scene, the story, the dial and the marquee, in the visitor's language. */
export function useFengShuiWorldCopy(): WorldCopy {
  return worldContent[useFengShuiLanguage()];
}

export function FengShuiLanguageToggle() {
  const language = useFengShuiLanguage();
  const copy = fengshuiContent[language].language;

  const option = (value: FengShuiLanguage, label: string) => (
    <button type="button" lang={value} aria-pressed={language === value} onClick={() => setSiteLanguage(value)} className="fs-lang-option">
      {label}
    </button>
  );

  return (
    <div role="group" aria-label={copy.label} className="fs-lang">
      {option("vi", copy.vi)}
      {option("en", copy.en)}
    </div>
  );
}
