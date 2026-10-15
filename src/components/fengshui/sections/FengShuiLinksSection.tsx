"use client";

import { Reveal } from "@/components/tech/Reveal";
import { fengshuiLinks } from "@/content/fengshui-content";
import { useFengShuiCopy, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";

/** The call to try Bazica Web: a night card with a light running round its edge, a pulsing badge and a gold button. */
export function FengShuiLinksSection() {
  const copy = useFengShuiCopy().linksSection;
  const cta = useFengShuiWorldCopy().cta;

  return (
    <section className="fs-band fs-band-paper fs-links" data-kit-section="Bắt đầu / Begin">
      <div className="fs-wrap fs-narrow">
        <Reveal>
          <div className="fs-cta">
            <span className="fs-cta-badge">
              <i aria-hidden="true" />
              {cta.badge}
            </span>
            <span className="fs-eyebrow">{copy.eyebrow}</span>
            <h2 className="fs-title fs-cta-title">
              {copy.title} <span className="fs-cta-accent">{copy.accent}</span>
            </h2>
            <p className="fs-copy">{copy.description}</p>
            <p className="fs-cta-free">{cta.free}</p>
            <div className="fs-actions fs-actions-center">
              <a href={fengshuiLinks.app} className="fs-btn fs-btn-cta" data-kit-magnetic>
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
