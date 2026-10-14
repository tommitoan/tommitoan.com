"use client";

import { Reveal } from "@/components/tech/Reveal";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

export function FengShuiIntroSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="fs-band fs-band-paper">
      <div className="fs-wrap fs-narrow">
        <Reveal>
          <div className="fs-panel">
            {copy.intro.map((paragraph) => (
              <p key={paragraph} className="fs-lead">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
