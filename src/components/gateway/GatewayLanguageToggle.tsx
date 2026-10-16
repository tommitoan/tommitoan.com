"use client";

import { setSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { GATEWAY_UI } from "@/components/gateway/gatewayCopy";

type Props = {
  language: SiteLanguage;
};

/** The language switch of the home page: a small pill in the top right corner that stays above the loading screen. */
export function GatewayLanguageToggle({ language }: Props) {
  const option = (value: SiteLanguage, label: string) => (
    <button
      type="button"
      lang={value}
      aria-pressed={language === value}
      onClick={() => setSiteLanguage(value)}
      className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider transition-colors ${
        language === value ? "bg-white text-slate-900" : "text-white/80 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label={GATEWAY_UI[language].languageLabel}
      className="fixed right-4 top-4 z-[300] flex gap-0.5 rounded-full border border-white/25 bg-black/45 p-0.5 backdrop-blur-md"
    >
      {option("en", "EN")}
      {option("vi", "VI")}
    </div>
  );
}
