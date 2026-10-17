"use client";

import { useEffect, useRef, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { ELEMENT_NAMES } from "@/content/fengshui-stems";
import { NAYIN, nayinImage, pairName } from "@/content/fengshui-nayin";
import { SAMPLE_CYCLE } from "./anatomy-math";
import { nayinOfPair, pairsOfNayin } from "./nayin-math";
import { RevealHeading } from "./RevealHeading";
import { useReducedMotion } from "./use-reduced-motion";

/** How long each Nạp Âm stays in focus while the section plays by itself. */
const AUTOPLAY_MS = 3000;

/** The entries of the sample chart's pillars: Year, Month, Day and Hour in turn. */
const SAMPLE_ENTRIES = SAMPLE_CYCLE.map(nayinOfPair);

/**
 * The thirty Nạp Âm as a grid of paintings in the order of the sixty-pair cycle, with the one in focus explained beside it.
 * They come into focus one after another; moving the pointer over one (or focusing it) picks it at once and holds the show
 * while the pointer stays in the section. When the focused entry holds a pillar of the sample chart, the card says so.
 */
export function NaYin() {
  const world = useFengShuiWorldCopy();
  const copy = world.nayin;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(15);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const playing = !reduced && visible && !held;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.4 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % NAYIN.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected]);

  const info = NAYIN[selected]!;
  const pairs = pairsOfNayin(selected).map((n) => pairName(n, language));
  const samplePillar = SAMPLE_ENTRIES.indexOf(selected);
  const element = ELEMENT_NAMES[info.element][language];

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper fs-ny" data-kit-section="Nạp Âm / Nayin" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>

        <div
          className="fs-ny-grid"
          onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          <div className="fs-ny-tiles" role="group" aria-label={copy.pickerLabel}>
            {NAYIN.map((entry, index) => {
              return (
                <button
                  key={entry.name}
                  type="button"
                  className="fs-ny-tile"
                  data-element={entry.element}
                  aria-pressed={index === selected}
                  aria-label={`${entry.name}: ${pairsOfNayin(index).map((n) => pairName(n, language)).join(", ")}`}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(index)}
                  onFocus={() => setSelected(index)}
                  onClick={() => setSelected(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the sound, the export has no image optimiser */}
                  <img src={nayinImage(index)} alt="" width={200} height={200} loading="lazy" decoding="async" />
                </button>
              );
            })}
          </div>

          <div className="fs-ny-info" aria-live="off">
            <figure className="fs-ny-art">
              {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the sound, the export has no image optimiser */}
              <img key={selected} src={nayinImage(selected)} alt={info.name} width={200} height={200} decoding="async" />
            </figure>
            <span className="fs-an-eyebrow">{copy.kindLabel.replace("{element}", element)}</span>
            <h3>{info.name}</h3>
            {language === "en" ? <p className="fs-an-kind">{info.label}</p> : null}
            <p className="fs-ny-pairs">
              <b>{copy.pairsLabel}:</b> {pairs.join(" · ")}
            </p>
            <p>{info.imagery[language]}</p>
            <p className="fs-ny-question">
              <b>{copy.questionLabel}.</b> {info.question[language]}
            </p>
            {samplePillar >= 0 ? (
              <p className="fs-ny-sample">{copy.sampleLine.replace("{pillar}", world.anatomy.pillarTitles[samplePillar]!.toLowerCase()).replace("{pair}", pairName(SAMPLE_CYCLE[samplePillar]!, language))}</p>
            ) : null}
            <p className="fs-note">{copy.note}</p>
          </div>
        </div>
        <p className="fs-note fs-br-hint">{copy.hint}</p>
      </div>
    </section>
  );
}
