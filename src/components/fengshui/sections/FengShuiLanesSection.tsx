"use client";

import { Reveal } from "@/components/tech/Reveal";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";

export function FengShuiLanesSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Lộ trình / Roadmap">
      <div className="fs-wrap">
        <WorldHeading eyebrow={copy.lanesHeading.eyebrow} title={`${copy.lanesHeading.title} ${copy.lanesHeading.accent}`} />
        <div className="fs-grid fs-grid-3">
          {copy.lanes.map((lane, index) => (
            <Reveal key={lane.title} delay={0.08 * (index + 1)}>
              <div className="fs-panel fs-card">
                <h3>{lane.title}</h3>
                <ul className="fs-points">
                  {lane.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
