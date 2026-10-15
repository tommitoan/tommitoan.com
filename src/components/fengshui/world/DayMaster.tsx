"use client";

import { useId, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { fengshuiLinks } from "@/content/fengshui-content";
import { stemImage, stemKind, stemName, STEMS } from "@/content/fengshui-stems";
import { dayPillar, pillarName } from "./pillar-math";
import { RevealHeading } from "./RevealHeading";

/**
 * The Day Master: the stem of the day pillar, one of ten. Pick a stem to see its picture and a few lines, or enter a birth date
 * and the matching stem is chosen. Everything here is imagery for remembering the ten stems, not a reading of anyone's character.
 */
export function DayMaster() {
  const copy = useFengShuiWorldCopy().dayMaster;
  const language = useFengShuiLanguage();
  const dateId = useId();
  const [selected, setSelected] = useState(0);
  const [found, setFound] = useState<{ date: string; pillar: string } | null>(null);
  const info = STEMS[selected]!;
  const name = stemName(info, language);

  const onDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
      setFound(null);
      return;
    }
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const pillar = dayPillar(year, month, day);
    setSelected(pillar.stem);
    setFound({ date: `${day}/${month}/${year}`, pillar: pillarName(pillar) });
  };

  const foundText = found
    ? copy.finderResult
        .replace("{date}", found.date)
        .replace("{pillar}", found.pillar)
        .replace("{stem}", stemName(STEMS[selected]!, language))
        .replace("{kind}", stemKind(STEMS[selected]!, language))
    : "";

  return (
    <section className="fs-band fs-band-paper fs-dm" data-kit-section="Nhật chủ / Day Master" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>

        <div className="fs-dm-stage">
          <figure className="fs-dm-art">
            {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the stem, the export has no image optimiser */}
            <img key={selected} src={stemImage(selected)} alt={copy.imageAlt.replace("{name}", name)} width={378} height={369} decoding="async" />
          </figure>
          <div className="fs-dm-info" aria-live="polite">
            <span className="fs-dm-kind">{stemKind(info, language)}</span>
            <h3 className="fs-dm-name">{name}</h3>
            <p className="fs-dm-title">{info.title[language]}</p>
            <p>
              <b>{copy.imagery}.</b> {info.imagery[language]}
            </p>
            <p>
              <b>{copy.shadow}.</b> {info.shadow[language]}
            </p>
            <p className="fs-note">{copy.disclaimer}</p>
          </div>
        </div>

        <div className="fs-dm-picker" role="group" aria-label={copy.pickerLabel}>
          {STEMS.map((stem, index) => (
            <button key={stem.vi} type="button" className="fs-dm-tile" aria-pressed={index === selected} onClick={() => setSelected(index)}>
              {/* eslint-disable-next-line @next/next/no-img-element -- small watercolour of the stem */}
              <img src={stemImage(index)} alt="" width={56} height={55} loading="lazy" decoding="async" />
              <span>{stemName(stem, language)}</span>
            </button>
          ))}
        </div>

        <div className="fs-dm-finder">
          <label htmlFor={dateId}>{copy.finderLabel}</label>
          <input id={dateId} type="date" min="1900-01-01" max="2100-12-31" onChange={(event) => onDate(event.target.value)} className="fs-dm-date" />
          <p className="fs-dm-found" aria-live="polite">
            {foundText}
          </p>
          <p className="fs-note">{copy.finderNote}</p>
          <div className="fs-actions">
            <a href={fengshuiLinks.chart} className="fs-btn">
              {copy.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
