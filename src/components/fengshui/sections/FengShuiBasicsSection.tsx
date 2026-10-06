"use client";

import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { fengshuiLinks } from "@/content/fengshui-content";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";

const CARD_ACCENTS = [
  { border: "border-violet-500/25", dot: "bg-violet-400" },
  { border: "border-cyan-500/25", dot: "bg-cyan-400" },
];

export function FengShuiBasicsSection() {
  const copy = useFengShuiCopy().basics;

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={
            <>
              {copy.title}{" "}
              <span className="cv-gradient-text-primary">{copy.titleAccent}</span>
            </>
          }
          description={copy.description}
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {copy.cards.map((card, index) => {
          const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

          return (
            <Reveal key={card.title} delay={0.08 * (index + 1)}>
              <div
                className={`cv-panel flex h-full flex-col rounded-[1.75rem] p-6 md:p-8 ${accent.border}`}
              >
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                <div className="mt-4 space-y-3">
                  {card.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-6 text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <ul className="mt-5 space-y-2">
                  {card.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-6 text-slate-300">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                {index === copy.cards.length - 1 && (
                  <a
                    href={fengshuiLinks.app}
                    className="mt-6 inline-flex w-fit text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    bazi.tommitoan.com →
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-5 cv-panel rounded-[1.75rem] p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white">{copy.glossaryTitle}</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {copy.glossary.map((item) => (
              <div key={item.term}>
                <dt className="text-sm font-semibold text-violet-300">{item.term}</dt>
                <dd className="mt-1 text-sm leading-6 text-slate-400">{item.description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-white/8 pt-4 text-xs leading-5 text-slate-500">
            {copy.note}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
