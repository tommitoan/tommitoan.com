"use client";

import { Reveal } from "@/components/tech/Reveal";
import { fengshuiContent } from "@/content/fengshui-content";

export function FengShuiIntroSection() {
  return (
    <section className="cv-section-shell">
      <Reveal>
        <div className="cv-panel rounded-[1.75rem] p-6 md:p-8">
          <div className="space-y-4">
            {fengshuiContent.intro.map((paragraph) => (
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
