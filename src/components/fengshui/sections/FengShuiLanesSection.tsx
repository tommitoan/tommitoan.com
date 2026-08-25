"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiContent } from "@/content/fengshui-content";

const LANE_ACCENTS = [
  { border: "border-violet-500/25", dot: "bg-violet-400" },
  { border: "border-cyan-500/25", dot: "bg-cyan-400" },
  { border: "border-blue-500/25", dot: "bg-blue-400" },
];

export function FengShuiLanesSection() {
  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Roadmap"
          title={
            <>
              Where this is{" "}
              <span className="cv-gradient-text-cyan-blue">headed</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fengshuiContent.lanes.map((lane, index) => {
          const accent = LANE_ACCENTS[index % LANE_ACCENTS.length];

          return (
            <Reveal key={lane.title} delay={0.08 * (index + 1)}>
              <div
                className={`cv-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8 ${accent.border}`}
              >
                <h3 className="text-xl font-semibold text-white">
                  {lane.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {lane.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
