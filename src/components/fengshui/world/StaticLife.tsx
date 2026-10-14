"use client";

import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { PillarCard } from "./PillarCards";
import { LUCK_PILLARS, SAMPLE_PILLARS } from "./scene-math";

/**
 * The birth scene as three stacked blocks: night, dawn, paper. It is what the server renders and what phones,
 * reduced-motion visitors and search engines see; wide screens with full motion get the pinned scene instead.
 */
export function StaticLife() {
  const copy = useFengShuiWorldCopy().scene;
  return (
    <section className="fs-static" data-kit-section="Cảnh sinh ra / Birth" aria-label={copy.label}>
      <div className="fs-static-band fs-static-night">
        <div className="fs-wrap fs-static-inner">
          <svg viewBox="-40 -40 80 80" width="72" height="72" aria-hidden="true" className="fs-static-star">
            <circle r="26" fill="url(#fs-star-glow)" />
            <defs>
              <radialGradient id="fs-star-glow">
                <stop offset="0" stopColor="rgba(255,240,200,.95)" />
                <stop offset="1" stopColor="rgba(255,214,140,0)" />
              </radialGradient>
            </defs>
            <path d="M-34 0H34M0 -34V34" stroke="rgba(255,246,220,.8)" strokeWidth="1.2" />
            <circle r="3.4" fill="#fffbe9" />
          </svg>
          <h2 className="fs-static-title">{copy.first}</h2>
          <p>{copy.firstSmall}</p>
          <p className="fs-static-label">{copy.starLabel}</p>
        </div>
      </div>

      <div className="fs-static-band fs-static-dawn">
        <div className="fs-wrap fs-static-inner">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative frames, the export has no image optimiser */}
          <img src="/fengshui/char/age-00.webp" alt={copy.frameAlts[0]} width={400} height={600} loading="lazy" className="fs-static-figure fs-static-figure-small" />
          <div className="fs-static-pillars">
            {SAMPLE_PILLARS.map((han, i) => (
              <PillarCard key={han} han={han} label={copy.pillarLabels[i]} />
            ))}
          </div>
          <h2 className="fs-static-title">{copy.second}</h2>
          <p>{copy.secondSmall}</p>
        </div>
      </div>

      <div className="fs-static-band fs-static-paper">
        <div className="fs-wrap fs-static-inner">
          <div className="fs-static-pair">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative frames, the export has no image optimiser */}
            <img src="/fengshui/char/age-22.webp" alt={copy.frameAlts[1]} width={400} height={600} loading="lazy" className="fs-static-figure" />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative frames, the export has no image optimiser */}
            <img src="/fengshui/char/age-80.webp" alt={copy.frameAlts[2]} width={400} height={600} loading="lazy" className="fs-static-figure" />
          </div>
          <ol className="fs-static-luck" aria-label={copy.third}>
            {LUCK_PILLARS.map((pillar) => (
              <li key={pillar.han}>
                <span>
                  {pillar.from}–{pillar.to} {copy.ageUnit}
                </span>
                <b className="fs-han">{pillar.han}</b>
              </li>
            ))}
          </ol>
          <h2 className="fs-static-title">{copy.third}</h2>
          <p>{copy.thirdSmall}</p>
          <p className="fs-static-note">{copy.sampleNote}</p>
        </div>
      </div>
    </section>
  );
}
