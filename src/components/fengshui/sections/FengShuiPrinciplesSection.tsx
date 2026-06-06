"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiContent } from "@/content/fengshui-content";

export function FengShuiPrinciplesSection() {
  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Principles"
          title={
            <>
              How it{" "}
              <span className="cv-gradient-text-primary">gets built</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 cv-panel rounded-[1.75rem] p-6 md:p-8">
        <div className="space-y-5">
          {fengshuiContent.principles.map((principle, index) => (
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
