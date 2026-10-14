"use client";

import { Reveal } from "@/components/tech/Reveal";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";

export function FengShuiPrinciplesSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Nguyên tắc / Principles">
      <div className="fs-wrap fs-narrow">
        <WorldHeading eyebrow={copy.principlesHeading.eyebrow} title={`${copy.principlesHeading.title} ${copy.principlesHeading.accent}`} />
        <Reveal>
          <ol className="fs-panel fs-principles">
            {copy.principles.map((principle, index) => (
              <li key={principle}>
                <span className="fs-number">{index + 1}</span>
                <p>{principle}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
