"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiContent } from "@/content/fengshui-content";

export function FengShuiHeroSection() {
  return (
    <section className="cv-section-shell pt-10 md:pt-14">
      <Reveal>
        <SectionHeading
          eyebrow={fengshuiContent.eyebrow}
          title={
            <span className="cv-gradient-text-purple-pink">
              {fengshuiContent.title}
            </span>
          }
          description={fengshuiContent.description}
        />
      </Reveal>
    </section>
  );
}
