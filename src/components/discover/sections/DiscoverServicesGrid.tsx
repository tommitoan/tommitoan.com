"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { siteContent } from "@/content/site-content";

const CARD_ACCENTS = [
  { border: "border-violet-500/25", glow: "rgba(145,94,255,0.08)" },
  { border: "border-cyan-500/25", glow: "rgba(34,211,238,0.08)" },
  { border: "border-blue-500/25", glow: "rgba(59,130,246,0.08)" },
];

export function DiscoverServicesGrid() {
  const { services } = siteContent.discover;

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              What runs on the{" "}
              <span className="cv-gradient-text-purple-pink">infrastructure</span>
            </>
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((group, index) => {
          const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

          return (
            <Reveal key={group.title} delay={0.08 * (index + 1)}>
              <div
                className={`cv-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8 ${accent.border}`}
                style={{ boxShadow: `0 24px 80px ${accent.glow}` }}
              >
                <h3 className="text-xl font-semibold text-white">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {group.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
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
