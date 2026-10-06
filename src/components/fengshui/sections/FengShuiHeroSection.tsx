"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiLinks } from "@/content/fengshui-content";
import { FengShuiLanguageToggle, useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

export function FengShuiHeroSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="cv-section-shell pt-10 md:pt-14">
      <div className="mb-8 flex justify-end">
        <FengShuiLanguageToggle />
      </div>
      <Reveal>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <span className="cv-gradient-text-purple-pink">{copy.title}</span>
          }
          description={copy.description}
        />
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={fengshuiLinks.app} className="cv-gradient-button">
            {copy.primaryCta}
          </a>
          <a
            href={fengshuiLinks.repo}
            target="_blank"
            rel="noreferrer"
            className="cv-ghost-button"
          >
            {copy.repoCta}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
