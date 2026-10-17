"use client";

import { useEffect, useRef, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { BRANCHES, branchImage, branchKind, branchName } from "@/content/fengshui-branches";
import { ELEMENT_NAMES, stemName, STEMS } from "@/content/fengshui-stems";
import { TERMS } from "@/content/fengshui-terms";
import { BRANCHES_HAN } from "@kit/solar";
import { liuChong, liuHe, monthTermIndex, ringPercent, sanHe, yearsOf } from "./branch-math";
import { elementColor } from "./elements";
import { RevealHeading } from "./RevealHeading";
import { useReducedMotion } from "./use-reduced-motion";

/** How long each branch stays in focus while the section plays by itself. */
const AUTOPLAY_MS = 4000;

/** Radius of the ring of buttons, in percent of the ring's width. */
const RING = 41;

/**
 * The twelve earthly branches on a ring with Tý at the top, a painting in the middle and the facts of the one in focus
 * beside it. They come into focus one after another; moving the pointer over one (or focusing it) picks it at once and
 * holds the show while the pointer stays in the section. Lines on the ring join the focused branch to the branch it
 * harmonises with (solid) and the one opposite it that clashes (dashed).
 */
export function Branches() {
  const copy = useFengShuiWorldCopy().branches;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
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
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % 12), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected]);

  const info = BRANCHES[selected]!;
  const name = branchName(selected, language);
  const han = BRANCHES_HAN[selected]!;
  const harmony = liuHe(selected);
  const clash = liuChong(selected);
  const triad = sanHe(selected);
  const term = TERMS[monthTermIndex(selected)]!;
  const line = (a: number, b: number) => {
    const from = ringPercent(a, RING);
    const to = ringPercent(b, RING);
    return { x1: from.left - 50, y1: from.top - 50, x2: to.left - 50, y2: to.top - 50 };
  };

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper fs-br" data-kit-section="Địa chi / Earthly branches" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>

        <div
          className="fs-br-grid"
          onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
        >
          <div className="fs-br-ring" role="group" aria-label={copy.pickerLabel}>
            <svg viewBox="-50 -50 100 100" aria-hidden="true">
              <circle className="fs-br-orbit" cx="0" cy="0" r={RING} />
              <line className="fs-br-clash" {...line(selected, clash)} />
              <line className="fs-br-triad" {...line(selected, triad.others[0])} />
              <line className="fs-br-triad" {...line(selected, triad.others[1])} />
              <line className="fs-br-triad" {...line(triad.others[0], triad.others[1])} />
              <line className="fs-br-harmony" {...line(selected, harmony)} />
            </svg>
            {BRANCHES.map((branch, index) => {
              const place = ringPercent(index, RING);
              return (
                <button
                  key={BRANCHES_HAN[index]}
                  type="button"
                  className="fs-br-node"
                  style={{ left: `${place.left}%`, top: `${place.top}%` }}
                  aria-pressed={index === selected}
                  aria-label={`${branchName(index, language)}, ${branch.animal[language]}`}
                  data-link={index === harmony ? "harmony" : index === clash ? "clash" : triad.others.includes(index) ? "triad" : undefined}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(index)}
                  onFocus={() => setSelected(index)}
                  onClick={() => setSelected(index)}
                >
                  <b className="fs-han" style={{ color: elementColor(BRANCHES_HAN[index]!) }} aria-hidden="true">
                    {BRANCHES_HAN[index]}
                  </b>
                  <span>{branchName(index, language)}</span>
                </button>
              );
            })}
            <p className="fs-br-legend" aria-hidden="true">
              <span data-kind="harmony">{copy.harmonyLabel}</span>
              <span data-kind="triad">{copy.triadLabel}</span>
              <span data-kind="clash">{copy.clashLabel}</span>
            </p>
          </div>

          <div className="fs-br-info" aria-live="off">
            <figure className="fs-br-art">
              {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the animal, the export has no image optimiser */}
              <img key={selected} src={branchImage(selected)} alt={copy.imageAlt.replace("{name}", name)} width={296} height={296} decoding="async" />
            </figure>
            <span className="fs-an-eyebrow">
              {branchKind(info, language)} · {info.animal[language]}
            </span>
            <div className="fs-an-head-line">
              <b className="fs-han fs-an-glyph" style={{ color: elementColor(han) }} aria-hidden="true">
                {han}
              </b>
              <div>
                <h3>{name}</h3>
                <p className="fs-an-kind">{info.title[language]}</p>
              </div>
            </div>
            <p className="fs-br-imagery">{info.imagery[language]}</p>
            <dl className="fs-br-facts">
              <div>
                <dt>{copy.hoursLabel}</dt>
                <dd>{info.hours}</dd>
              </div>
              <div>
                <dt>{copy.monthLabel}</dt>
                <dd>{copy.monthText.replace("{term}", term[language]).replace("{from}", String(term.from)).replace("{to}", String(term.to)).replace("{month}", String(term.month))}</dd>
              </div>
              <div>
                <dt>{copy.yearsLabel}</dt>
                <dd>{yearsOf(selected).join(" · ")}</dd>
              </div>
              <div>
                <dt>{copy.hiddenLabel}</dt>
                <dd>{info.hidden.map((stem) => stemName(STEMS[stem]!, language)).join(" · ")}</dd>
              </div>
              <div>
                <dt>{copy.harmonyLabel}</dt>
                <dd>{branchName(harmony, language)}</dd>
              </div>
              <div>
                <dt>{copy.clashLabel}</dt>
                <dd>{branchName(clash, language)}</dd>
              </div>
              <div className="fs-br-wide">
                <dt>{copy.triadLabel}</dt>
                <dd>
                  {copy.triadText
                    .replace("{a}", branchName(triad.others[0], language))
                    .replace("{b}", branchName(triad.others[1], language))
                    .replace("{element}", ELEMENT_NAMES[triad.element][language])}
                </dd>
              </div>
            </dl>
            <p className="fs-br-caution">
              <b>{copy.cautionLabel}.</b> {info.caution[language]}
            </p>
            <p className="fs-note">{copy.note}</p>
          </div>
        </div>
        <p className="fs-note fs-br-hint">{copy.hint}</p>
      </div>
    </section>
  );
}
