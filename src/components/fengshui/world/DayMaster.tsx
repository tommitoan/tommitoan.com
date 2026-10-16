"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { stemImage, stemKind, stemName, STEMS } from "@/content/fengshui-stems";
import { maskDmy, parseDmy } from "./date-input";
import { dayPillar, pillarName } from "./pillar-math";
import { RevealHeading } from "./RevealHeading";
import { useReducedMotion } from "./use-reduced-motion";

/** How long each stem stays in the middle while the section plays by itself. */
const AUTOPLAY_MS = 3000;

/**
 * The Day Master: the stem of the day pillar, one of ten. The stems come to the middle one after another every three seconds;
 * moving the pointer over one brings it to the middle at once and holds it there while the pointer stays in the section; and
 * a birth date typed as dd/mm/yyyy picks the matching stem. Everything here is imagery for remembering the ten stems, not a
 * reading of anyone's character.
 */
export function DayMaster() {
  const copy = useFengShuiWorldCopy().dayMaster;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const dateId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  // A visitor who looked up their own date wants that stem to stay, so the show stops for good.
  const [stopped, setStopped] = useState(false);
  const [text, setText] = useState("");
  const [found, setFound] = useState<{ date: string; pillar: string; stem: number } | null>(null);
  const info = STEMS[selected]!;
  const name = stemName(info, language);
  const playing = !reduced && visible && !held && !stopped;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % STEMS.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected]);

  const onDate = (raw: string) => {
    const masked = maskDmy(raw);
    setText(masked);
    const date = parseDmy(masked);
    if (!date) {
      setFound(null);
      return;
    }
    const pillar = dayPillar(date.year, date.month, date.day);
    setSelected(pillar.stem);
    setStopped(true);
    setFound({ date: masked, pillar: pillarName(pillar), stem: pillar.stem });
  };

  const invalid = text.length === 10 && !found;
  const foundInfo = found ? STEMS[found.stem]! : null;
  const foundText =
    found && foundInfo
      ? copy.finderResult
          .replace("{date}", found.date)
          .replace("{pillar}", found.pillar)
          .replace("{stem}", stemName(foundInfo, language))
          .replace("{kind}", stemKind(foundInfo, language))
      : "";

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper fs-dm" data-kit-section="Nhật chủ / Day Master" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>

        <div
          onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          <div className="fs-dm-stage">
            <figure className="fs-dm-art">
              {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the stem, the export has no image optimiser */}
              <img key={selected} src={stemImage(selected)} alt={copy.imageAlt.replace("{name}", name)} width={378} height={369} decoding="async" />
            </figure>
            <div className="fs-dm-info" aria-live="off">
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
            <div className="fs-dm-track" data-paused={held ? "true" : undefined}>
              {[false, true].map((clone) =>
                STEMS.map((stem, index) => (
                  <button
                    key={`${clone ? "b" : "a"}${stem.vi}`}
                    type="button"
                    className="fs-dm-tile"
                    data-clone={clone ? "true" : undefined}
                    aria-hidden={clone ? true : undefined}
                    tabIndex={clone ? -1 : undefined}
                    aria-pressed={index === selected}
                    onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(index)}
                    onFocus={() => setSelected(index)}
                    onClick={() => setSelected(index)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small watercolour of the stem */}
                    <img src={stemImage(index)} alt="" width={56} height={55} loading="lazy" decoding="async" />
                    <span>{stemName(stem, language)}</span>
                    {index === selected ? <i className="fs-dm-timer" data-running={playing ? "true" : "false"} aria-hidden="true" /> : null}
                  </button>
                )),
              )}
            </div>
          </div>
        </div>

        <div className="fs-dm-finder">
          <label htmlFor={dateId}>{copy.finderLabel}</label>
          <input
            id={dateId}
            type="text"
            inputMode="numeric"
            autoComplete="bday"
            placeholder="dd/mm/yyyy"
            maxLength={10}
            value={text}
            aria-invalid={invalid}
            onChange={(event) => onDate(event.target.value)}
            className="fs-dm-date"
          />
          <p className="fs-dm-found" aria-live="polite">
            {invalid ? copy.finderInvalid : foundText}
          </p>
          <p className="fs-note">{copy.finderNote}</p>
        </div>
      </div>
    </section>
  );
}
