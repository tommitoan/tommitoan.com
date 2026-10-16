"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { BRANCHES, branchKind, branchName } from "@/content/fengshui-branches";
import { NAYIN } from "@/content/fengshui-nayin";
import { ELEMENT_NAMES, stemKind, stemName, STEMS } from "@/content/fengshui-stems";
import { parsePillar, ringPoint, SAMPLE_CYCLE, SLOTS } from "./anatomy-math";
import { elementColor } from "./elements";
import { nayinOfPair } from "./nayin-math";
import { RevealHeading } from "./RevealHeading";
import { SAMPLE_PILLARS } from "./scene-math";
import { useReducedMotion } from "./use-reduced-motion";

/** How long each of the eight characters stays in focus while the section plays by itself. */
const AUTOPLAY_MS = 4000;

/**
 * The anatomy of a chart: the eight characters of the sample chart, one in focus at a time. They come into focus one after
 * another; moving the pointer over one (or focusing it) picks it at once and holds the show while the pointer stays in the
 * section. Beside the chart, a ring of the sixty stem and branch pairs shows where the focused pillar stands in the cycle.
 */
export function Anatomy() {
  const world = useFengShuiWorldCopy();
  const copy = world.anatomy;
  const labels = world.scene.pillarLabels;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(2);
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
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % SLOTS.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected]);

  const pillars = SAMPLE_PILLARS.map(parsePillar);
  const slot = SLOTS[selected]!;
  const pillar = pillars[slot.pillar]!;
  const isStem = slot.part === "stem";
  const char = SAMPLE_PILLARS[slot.pillar]![isStem ? 0 : 1]!;
  const stemInfo = STEMS[pillar.stem]!;
  const branchInfo = BRANCHES[pillar.branch]!;
  const name = isStem ? stemName(stemInfo, language) : branchName(pillar.branch, language);
  const kind = isStem ? stemKind(stemInfo, language) : branchKind(branchInfo, language);
  const role = copy.roles[slot.pillar]![slot.part];
  const pillarLabel = `${stemName(stemInfo, language)} ${branchName(pillar.branch, language)}`;
  const focus = SAMPLE_CYCLE[slot.pillar]!;
  const nayinInfo = NAYIN[nayinOfPair(focus)]!;

  const renderRow = (part: "stem" | "branch") => (
      <Fragment key={part}>
        <span className="fs-an-rowlabel">{part === "stem" ? copy.stemRow : copy.branchRow}</span>
        {SAMPLE_PILLARS.map((han, pillarIndex) => {
          const index = pillarIndex * 2 + (part === "stem" ? 0 : 1);
          const character = han[part === "stem" ? 0 : 1]!;
          const parsed = pillars[pillarIndex]!;
          const tileName = part === "stem" ? stemName(STEMS[parsed.stem]!, language) : branchName(parsed.branch, language);
          return (
            <button
              key={han + part}
              type="button"
              className="fs-an-tile"
              aria-pressed={index === selected}
              aria-label={`${part === "stem" ? copy.stemRow : copy.branchRow}, ${copy.pillarTitles[pillarIndex]}: ${tileName}`}
              onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(index)}
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
            >
              <b className="fs-han" style={{ color: elementColor(character) }} aria-hidden="true">
                {character}
              </b>
              <span>{tileName}</span>
              {pillarIndex === 2 && part === "stem" ? <em>{copy.dayMasterBadge}</em> : null}
            </button>
          );
        })}
      </Fragment>
  );

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper fs-an" data-kit-section="Luận giải / Reading" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>

        <div
          className="fs-an-grid"
          onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          <div>
            <div className="fs-an-chart" role="group" aria-label={copy.chartLabel}>
              <span aria-hidden="true" />
              {labels.map((label) => (
                <span key={label} className="fs-an-head">
                  {label}
                </span>
              ))}
              {renderRow("stem")}
              {renderRow("branch")}
            </div>
            <div className="fs-an-info" aria-live="off">
              <span className="fs-an-eyebrow">
                {isStem ? copy.stemRow : copy.branchRow} · {copy.pillarTitles[slot.pillar]}
              </span>
              <div className="fs-an-head-line">
                <b className="fs-han fs-an-glyph" style={{ color: elementColor(char) }} aria-hidden="true">
                  {char}
                </b>
                <div>
                  <h3>{name}</h3>
                  <p className="fs-an-kind">{kind}</p>
                </div>
              </div>
              <p>{role}</p>
              {isStem ? null : (
                <p className="fs-an-facts">
                  <span>
                    <b>{copy.animalLabel}:</b> {branchInfo.animal[language]}
                  </span>
                  <span>
                    <b>{copy.hoursLabel}:</b> {branchInfo.hours}
                  </span>
                </p>
              )}
              <p className="fs-note">{copy.note}</p>
            </div>
          </div>

          <figure className="fs-an-ring">
            <svg viewBox="-110 -110 220 220" role="img" aria-label={copy.ringLabel}>
              <g className="fs-an-hand" style={{ transform: `rotate(${focus * 6}deg)` }}>
                <line x1="0" y1="-38" x2="0" y2="-70" />
              </g>
              {Array.from({ length: 60 }, (_, n) => {
                const point = ringPoint(n, 80);
                const sampleIndex = SAMPLE_CYCLE.indexOf(n);
                const state = n === focus ? "focus" : sampleIndex >= 0 ? "sample" : "plain";
                return <circle key={n} cx={point.x} cy={point.y} data-state={state} />;
              })}
              {SAMPLE_CYCLE.map((n, index) => {
                const point = ringPoint(n, 98);
                return (
                  <text key={n} x={point.x} y={point.y} className="fs-an-mark" data-active={n === focus ? "true" : "false"} textAnchor="middle" dominantBaseline="central">
                    {labels[index]}
                  </text>
                );
              })}
              <text className="fs-an-center" x="0" y="-9" textAnchor="middle">
                {pillarLabel}
              </text>
              <text className="fs-an-center-nayin" x="0" y="8" textAnchor="middle">
                {language === "en" ? nayinInfo.label : nayinInfo.name}
              </text>
              <text className="fs-an-center-sub" x="0" y="21" textAnchor="middle">
                {copy.ringElement.replace("{element}", ELEMENT_NAMES[nayinInfo.element][language])}
              </text>
            </svg>
            <figcaption className="fs-note">{copy.hint}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
