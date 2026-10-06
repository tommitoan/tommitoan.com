"use client";

import { Reveal } from "@/components/tech/Reveal";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

export function FengShuiIntroSection() {
  const copy = useFengShuiCopy();

  return (
    <section className="cv-section-shell">
      <Reveal>
        <div className="cv-panel rounded-[1.75rem] p-6 md:p-8">
          <div className="space-y-4">
            {copy.intro.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
