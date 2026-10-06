"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

export function FengShuiPrinciplesSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow={copy.principlesHeading.eyebrow}
          title={
            <>
              {copy.principlesHeading.title}{" "}
              <span className="cv-gradient-text-primary">{copy.principlesHeading.accent}</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 cv-panel rounded-[1.75rem] p-6 md:p-8">
        <div className="space-y-5">
          {copy.principles.map((principle, index) => (
            <div key={principle} className="flex gap-4">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10 text-sm font-semibold text-violet-400">
                {index + 1}
              </span>
              <p className="text-lg leading-8 text-slate-300">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
