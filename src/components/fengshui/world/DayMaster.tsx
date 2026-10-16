"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { stemImage, stemKind, stemName, STEMS } from "@/content/fengshui-stems";
import { maskDmy, parseDmy } from "./date-input";
import { dayPillar, pillarName } from "./pillar-math";
import { RevealHeading } from "./RevealHeading";
import { useReducedMotion } from "./use-reduced-motion";

/** How long a stem takes to cross the middle of the belt: the belt moves one tile in this time. */
const TILE_MS = 3000;

/** The stems in the order of the belt: it runs from left to right, so the next stem arrives from the left. */
const BELT_ORDER = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const;
const ASCENDING = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Copies of the ten stems laid side by side: enough to fill the widest window while the belt moves by one copy. */
const COPIES = 3;

const mod = (value: number, size: number): number => ((value % size) + size) % size;

/**
 * The Day Master: the stem of the day pillar, one of ten. The stems run along a belt from left to right without stopping, one
 * tile every three seconds, and the one passing the middle is the one shown above, so the card always follows the belt. Moving
 * the pointer over a stem picks it and holds the belt still while the pointer stays in the section; a birth date typed as
 * dd/mm/yyyy picks the matching stem, brings it to the middle and keeps the belt still. Everything here is imagery for
 * remembering the ten stems, not a reading of anyone's character.
 */
export function DayMaster() {
  const copy = useFengShuiWorldCopy().dayMaster;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const dateId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Where the belt stands (pixels, 0 down to minus one copy), kept while it is held still.
  const beltX = useRef<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  // A visitor who looked up their own date wants that stem to stay, so the show stops for good.
  const [stopped, setStopped] = useState(false);
  const [text, setText] = useState("");
  const [found, setFound] = useState<{ date: string; pillar: string; stem: number } | null>(null);
  const info = STEMS[selected]!;
  const name = stemName(info, language);
  const running = !reduced && visible && !held && !stopped;
  const order = reduced ? ASCENDING : BELT_ORDER;
  const copies = reduced ? 1 : COPIES;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The belt: one animation frame moves it by its share of the tile time and the stem in the middle becomes the selected one.
  useEffect(() => {
    const track = trackRef.current;
    const box = boxRef.current;
    if (reduced || !track || !box || track.children.length < 2) return;
    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;
    const step = second.offsetLeft - first.offsetLeft;
    const half = first.offsetWidth / 2;
    const period = step * 10;
    const centre = box.clientWidth / 2;
    // The belt position that puts tile `index` in the middle, kept inside one copy so the tiles always cover the window.
    const centreOn = (index: number): number => {
      const low = (centre - half) / step;
      const at = index + 10 * Math.ceil((low - index) / 10);
      return centre - half - at * step;
    };
    let x = beltX.current ?? centreOn(BELT_ORDER.indexOf(selected as (typeof BELT_ORDER)[number]));
    let shown = selected;
    let last = 0;
    let frame = 0;
    const paint = () => {
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };
    const tick = (now: number) => {
      const elapsed = last ? Math.min(now - last, 64) : 0;
      last = now;
      x += (elapsed * step) / TILE_MS;
      if (x > 0) x -= period;
      paint();
      const stem = BELT_ORDER[mod(Math.round((centre - half - x) / step), 10)]!;
      if (stem !== shown) {
        shown = stem;
        setSelected(stem);
      }
      frame = window.requestAnimationFrame(tick);
    };
    paint();
    if (running) frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      beltX.current = x;
    };
    // `selected` only seeds the first position, so it is read here without re-running the belt on every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, running]);

  // A date typed into the finder stops the belt: bring the matching stem to the middle with a short glide.
  useEffect(() => {
    const track = trackRef.current;
    const box = boxRef.current;
    if (!stopped || reduced || !track || !box || track.children.length < 2) return;
    const first = track.children[0] as HTMLElement;
    const step = (track.children[1] as HTMLElement).offsetLeft - first.offsetLeft;
    const half = first.offsetWidth / 2;
    const centre = box.clientWidth / 2;
    const index = BELT_ORDER.indexOf(selected as (typeof BELT_ORDER)[number]);
    const low = (centre - half) / step;
    const at = index + 10 * Math.ceil((low - index) / 10);
    const target = centre - half - at * step;
    beltX.current = target;
    track.style.transition = "transform 0.6s ease-out";
    track.style.transform = `translate3d(${target.toFixed(2)}px, 0, 0)`;
    const clear = window.setTimeout(() => {
      track.style.transition = "";
    }, 650);
    return () => window.clearTimeout(clear);
  }, [stopped, selected, reduced]);

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
              <div className="fs-dm-frame">
                {STEMS.map((stem, index) => (
                  // eslint-disable-next-line @next/next/no-img-element -- watercolours of the stems, stacked and cross-faded; the export has no image optimiser
                  <img
                    key={stem.vi}
                    src={stemImage(index)}
                    alt={index === selected ? copy.imageAlt.replace("{name}", name) : ""}
                    aria-hidden={index === selected ? undefined : true}
                    data-shown={index === selected ? "true" : undefined}
                    width={378}
                    height={369}
                    decoding="async"
                  />
                ))}
              </div>
            </figure>
            <div key={selected} className="fs-dm-info" aria-live="off">
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

          <div ref={boxRef} className="fs-dm-picker" role="group" aria-label={copy.pickerLabel}>
            <div ref={trackRef} className="fs-dm-track">
              {Array.from({ length: copies }, (_, round) =>
                order.map((stemIndex) => (
                  <button
                    key={`${round}-${stemIndex}`}
                    type="button"
                    className="fs-dm-tile"
                    data-clone={round > 0 ? "true" : undefined}
                    aria-hidden={round > 0 ? true : undefined}
                    tabIndex={round > 0 ? -1 : undefined}
                    aria-pressed={stemIndex === selected}
                    onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(stemIndex)}
                    onFocus={() => setSelected(stemIndex)}
                    onClick={() => setSelected(stemIndex)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small watercolour of the stem */}
                    <img src={stemImage(stemIndex)} alt="" width={56} height={55} loading="lazy" decoding="async" />
                    <span>{stemName(STEMS[stemIndex]!, language)}</span>
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
