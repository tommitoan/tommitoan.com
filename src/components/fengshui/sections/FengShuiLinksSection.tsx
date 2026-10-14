"use client";

import { Reveal } from "@/components/tech/Reveal";
import { fengshuiLinks } from "@/content/fengshui-content";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { RevealHeading } from "@/components/fengshui/world/RevealHeading";

export function FengShuiLinksSection() {
  const copy = useFengShuiCopy().linksSection;

  return (
    <section className="fs-band fs-band-paper fs-links" data-kit-section="Bắt đầu / Begin">
      <div className="fs-wrap fs-narrow">
        <Reveal>
          <div className="fs-panel fs-links-panel">
            <span className="fs-eyebrow">{copy.eyebrow}</span>
            <RevealHeading className="fs-title">{`${copy.title} ${copy.accent}`}</RevealHeading>
            <p className="fs-copy">{copy.description}</p>
            <div className="fs-actions fs-actions-center">
              <a href={fengshuiLinks.app} className="fs-btn" data-kit-magnetic>
                {copy.appCta}
              </a>
              <a href={fengshuiLinks.repo} target="_blank" rel="noreferrer" className="fs-btn fs-btn-ghost" data-kit-magnetic>
                {copy.repoCta}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
