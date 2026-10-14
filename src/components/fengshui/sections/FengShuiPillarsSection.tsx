"use client";

import { Reveal } from "@/components/tech/Reveal";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";

export function FengShuiPillarsSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Lý do / Why">
      <div className="fs-wrap">
        <WorldHeading eyebrow={copy.pillarsHeading.eyebrow} title={`${copy.pillarsHeading.title} ${copy.pillarsHeading.accent}`} />
        <div className="fs-grid fs-grid-3">
          {copy.pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={0.08 * (index + 1)}>
              <div className="fs-panel fs-card">
                <span className="fs-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
