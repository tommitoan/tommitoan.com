"use client";

import { fengshuiLinks } from "@/content/fengshui-content";
import { useFengShuiCopy, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { HeroPillars } from "@/components/fengshui/world/HeroPillars";
import { InkDust } from "@/components/fengshui/world/InkDust";
import { RevealHeading } from "@/components/fengshui/world/RevealHeading";

export function FengShuiHeroSection() {
  const copy = useFengShuiCopy();
  const world = useFengShuiWorldCopy();

  return (
    <section className="fs-hero" data-kit-section="Mở đầu / Start">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop, the export has no image optimiser */}
      <img className="fs-hero-nebula" src="/fengshui/nebula.webp" alt="" aria-hidden="true" />
      <div className="fs-wrap fs-hero-grid">
        <div>
          <span className="fs-eyebrow">{copy.eyebrow}</span>
          <RevealHeading as="h1" className="fs-hero-title">
            {copy.title}
          </RevealHeading>
          <p className="fs-hero-copy">{copy.description}</p>
          <div className="fs-actions">
            <a href={fengshuiLinks.chart} className="fs-btn" data-kit-magnetic>
              {world.hero.chartCta}
            </a>
            <a href={fengshuiLinks.repo} target="_blank" rel="noreferrer" className="fs-btn fs-btn-ghost" data-kit-magnetic>
              {copy.repoCta}
            </a>
          </div>
          <p className="fs-hint">{world.hero.scrollHint}</p>
        </div>
        <div className="fs-hero-art">
          <InkDust />
          <HeroPillars />
        </div>
      </div>
    </section>
  );
}
