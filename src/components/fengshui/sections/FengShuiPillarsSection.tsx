"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiContent } from "@/content/fengshui-content";

const PILLAR_ACCENTS = [
  "cv-gradient-text-primary",
  "cv-gradient-text-purple-pink",
  "cv-gradient-text-cyan-blue",
];

export function FengShuiPillarsSection() {
  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Pillars"
          title={
            <>
              Why{" "}
              <span className="cv-gradient-text-purple-pink">this matters</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fengshuiContent.pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={0.08 * (index + 1)}>
            <div className="cv-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8">
              <span className="text-2xl font-bold text-white/20">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">
                <span className={PILLAR_ACCENTS[index % PILLAR_ACCENTS.length]}>
                  {pillar.title}
                </span>
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {pillar.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
