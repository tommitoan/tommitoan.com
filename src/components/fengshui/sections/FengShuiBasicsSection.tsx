"use client";

import { Reveal } from "@/components/tech/Reveal";
import { fengshuiLinks } from "@/content/fengshui-content";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";
import { FENGSHUI_ART } from "@/content/fengshui-art";

export function FengShuiBasicsSection() {
  const copy = useFengShuiCopy().basics;

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Cơ sở / Basics">
      <div className="fs-wrap">
        <WorldHeading eyebrow={copy.eyebrow} title={`${copy.title} ${copy.titleAccent}`} description={copy.description} art={FENGSHUI_ART.basics} />

        <div className="fs-grid fs-grid-2">
          {copy.cards.map((card, index) => (
            <Reveal key={card.title} delay={0.08 * (index + 1)}>
              <div className="fs-panel fs-card">
                <h3>{card.title}</h3>
                {card.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul className="fs-points">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {index === copy.cards.length - 1 && (
                  <a href={fengshuiLinks.app} className="fs-link">
                    bazi.tommitoan.com →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="fs-panel fs-glossary">
            <h3>{copy.glossaryTitle}</h3>
            <dl>
              {copy.glossary.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.description}</dd>
                </div>
              ))}
            </dl>
            <p className="fs-note">{copy.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
