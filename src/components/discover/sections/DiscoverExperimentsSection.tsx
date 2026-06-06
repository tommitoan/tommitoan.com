"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { siteContent } from "@/content/site-content";

const EXPERIMENT_ICONS = ["🧪", "⚙️", "📝"];

export function DiscoverExperimentsSection() {
  const { experiments } = siteContent.discover;

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Experiments"
          title={
            <>
              What keeps the{" "}
              <span className="cv-gradient-text-cyan-blue">stack sharp</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment, index) => (
          <Reveal key={experiment.title} delay={0.08 * (index + 1)}>
            <div className="cv-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8">
              <span className="text-3xl">{EXPERIMENT_ICONS[index]}</span>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {experiment.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {experiment.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
