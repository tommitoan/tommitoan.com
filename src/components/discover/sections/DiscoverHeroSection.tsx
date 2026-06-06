"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { siteContent } from "@/content/site-content";

export function DiscoverHeroSection() {
  const { heading, intro } = siteContent.discover;

  return (
    <section className="cv-section-shell pt-10 md:pt-14">
      <Reveal>
        <SectionHeading
          eyebrow="Discover"
          title={
            <span className="cv-gradient-text-cyan-blue">{heading}</span>
          }
          description={intro}
        />
      </Reveal>
    </section>
  );
}
