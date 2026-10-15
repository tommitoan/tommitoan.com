"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { BRANCHES_HAN, STEMS_HAN } from "@kit/solar";
import { elementColor } from "./elements";
import {
  arcPath,
  dayForLongitude,
  dayIndexOf,
  daysInYear,
  daysPerSecond,
  dialState,
  type DialState,
  isMonthOpener,
  longitudeAt,
  longitudeAtDay,
  radialLabel,
  ringPoint,
} from "./dial-math";
import { monthPillar, pillarName } from "./pillar-math";
import { RevealHeading } from "./RevealHeading";
import { useReducedMotion } from "./use-reduced-motion";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { termDates, termImage, termName, TERMS } from "@/content/fengshui-terms";

const CENTRE = { x: 230, y: 230 };
const RADIUS = 100;
const LABEL_RADIUS = RADIUS + 15;
const VIEW = 460;
/** The ring answers the pointer between these distances from its centre (view units). */
const HIT_MIN = 28;
const HIT_MAX = 225;
/** The Ba-zi year starts at Lichun (315 degrees); the red arc shows how far the Sun has come since. */
const YEAR_START = 315;

const subscribeNever = (): (() => void) => () => undefined;

/** Today as "year:dayIndex". The server renders a fixed day; the browser swaps in the real one after hydration. */
function todaySnapshot(): string {
  const now = new Date();
  return `${now.getFullYear()}:${dayIndexOf(now.getFullYear(), now.getMonth() + 1, now.getDate())}`;
}

function useToday(): { year: number; dayIndex: number } {
  const today = useSyncExternalStore(subscribeNever, todaySnapshot, () => "2026:286");
  const [year, dayIndex] = today.split(":").map(Number);
  return { year: year ?? 2026, dayIndex: dayIndex ?? 0 };
}

/** Where the Sun and its red arc go for a longitude. */
function sunPlace(longitude: number): { transform: string; trail: string } {
  const sun = ringPoint(longitude, RADIUS, CENTRE);
  return { transform: `translate(${sun.x.toFixed(1)} ${sun.y.toFixed(1)})`, trail: arcPath(YEAR_START, longitude, RADIUS, CENTRE) };
}

/**
 * The ecliptic ring with its 24 solar terms. It runs by itself, the Sun crossing a term about every three seconds and going
 * round and round; moving the pointer over the ring (or dragging a finger, or the date slider) jumps to that term and holds it
 * until the pointer leaves. It shows the Ba-zi month, the Month Pillar and, at Lichun, the year changing.
 */
export function SolarDial() {
  const copy = useFengShuiWorldCopy().dial;
  const language = useFengShuiLanguage();
  const reduced = useReducedMotion();
  const sliderId = useId();
  const { year, dayIndex: today } = useToday();

  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const releaseRef = useRef(0);
  const dayRef = useRef(today);

  const [driven, setDriven] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const day = driven ?? today;
  const playing = !reduced && visible && !held;
  const state = dialState(year, day);
  // Constant, so React never rewrites the Sun's position that the loop and the effect below keep moving.
  const [initial] = useState(() => sunPlace(dialState(year, day).longitude));

  useEffect(() => {
    dayRef.current = day;
  }, [day]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const place = (longitude: number) => {
    const at = sunPlace(longitude);
    sunRef.current?.setAttribute("transform", at.transform);
    trailRef.current?.setAttribute("d", at.trail);
  };

  // Paused (or not yet running): the Sun stands on the chosen day.
  useEffect(() => {
    if (!playing) place(longitudeAtDay(year, day));
  }, [playing, year, day]);

  // Running: the Sun moves every frame and the page re-renders only when the day changes.
  useEffect(() => {
    if (!playing) return;
    let handle = 0;
    let last = performance.now();
    let position = dayRef.current;
    let shown = Math.floor(position);
    const frame = (time: number) => {
      position = (position + ((time - last) / 1000) * daysPerSecond(year)) % daysInYear(year);
      last = time;
      place(longitudeAtDay(year, position));
      if (Math.floor(position) !== shown) {
        shown = Math.floor(position);
        setDriven(shown);
      }
      handle = window.requestAnimationFrame(frame);
    };
    handle = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(handle);
  }, [playing, year]);

  const hold = () => {
    window.clearTimeout(releaseRef.current);
    setHeld(true);
  };
  const release = (delay: number) => {
    window.clearTimeout(releaseRef.current);
    releaseRef.current = window.setTimeout(() => setHeld(false), delay);
  };
  useEffect(() => () => window.clearTimeout(releaseRef.current), []);

  /** Jumps to the term under the pointer; false when the pointer is not on the ring. */
  const pick = (event: React.PointerEvent<SVGSVGElement>): boolean => {
    const svg = svgRef.current;
    if (!svg) return false;
    const box = svg.getBoundingClientRect();
    if (box.width === 0) return false;
    const scale = VIEW / box.width;
    const point = { x: (event.clientX - box.left) * scale, y: (event.clientY - box.top) * scale };
    const distance = Math.hypot(point.x - CENTRE.x, point.y - CENTRE.y);
    if (distance < HIT_MIN || distance > HIT_MAX) return false;
    setDriven(dayForLongitude(year, longitudeAt(point, CENTRE)));
    return true;
  };

  const info = TERMS[state.term.index]!;
  const opens = isMonthOpener(state.term.index);
  const month = monthPillar(state.pillar.stem, state.month.index);
  const monthHan = `${STEMS_HAN[month.stem]}${BRANCHES_HAN[month.branch]}`;
  const role = (opens ? copy.opens : copy.middle).replaceAll("{month}", state.month.name);
  const alt = copy.imageAlt.replace("{name}", termName(info, language));

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper" data-kit-section="Tiết khí / Solar terms" aria-label={copy.title}>
      <div className="fs-wrap fs-dial">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={copy.ringLabel}
          className="fs-dial-ring"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") hold();
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" && pick(event)) hold();
          }}
          onPointerMove={(event) => {
            if (event.pointerType === "mouse" || event.buttons > 0) pick(event);
          }}
          onPointerUp={(event) => event.pointerType !== "mouse" && release(2500)}
          onPointerCancel={() => release(2500)}
          onPointerLeave={(event) => release(event.pointerType === "mouse" ? 250 : 2500)}
        >
          <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke="var(--kit-line)" strokeWidth="1" />
          <path ref={trailRef} d={initial.trail} fill="none" stroke="var(--kit-seal)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
          {Array.from({ length: 24 }, (_, k) => {
            const longitude = k * 15;
            const opener = isMonthOpener(Math.round(longitude / 15));
            const inner = ringPoint(longitude, RADIUS - (opener ? 9 : 4), CENTRE);
            const outer = ringPoint(longitude, RADIUS + (opener ? 9 : 4), CENTRE);
            return <line key={k} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={opener ? "var(--kit-seal)" : "var(--kit-line)"} strokeWidth={opener ? 2.2 : 1} />;
          })}
          {TERMS.map((term, termIndex) => {
            const at = radialLabel(termIndex * 15, LABEL_RADIUS, CENTRE);
            return (
              <text
                key={termIndex}
                x={at.x}
                y={at.y}
                dy="0.35em"
                textAnchor={at.anchor}
                transform={`rotate(${at.rotation.toFixed(2)} ${at.x.toFixed(2)} ${at.y.toFixed(2)})`}
                className="fs-dial-term"
                data-opens={isMonthOpener(termIndex) ? "true" : undefined}
                data-current={termIndex === state.term.index ? "true" : undefined}
              >
                {termName(term, language)}
              </text>
            );
          })}
          <text x={CENTRE.x} y={CENTRE.y - 4} className="fs-dial-centre">
            {state.longitude.toFixed(0)}°
          </text>
          <text x={CENTRE.x} y={CENTRE.y + 14} className="fs-dial-centre-sub">
            {termName(info, language)}
          </text>
          <g ref={sunRef} transform={initial.transform}>
            <circle r="12" fill="#c4543a" opacity="0.22" />
            <circle r="7" fill="#c4543a" />
          </g>
        </svg>

        <div>
          <span className="fs-eyebrow">{copy.eyebrow}</span>
          <RevealHeading className="fs-title">{copy.title}</RevealHeading>
          <p className="fs-copy">{copy.description}</p>
          <figure className="fs-term" data-opens={opens ? "true" : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- watercolour of the term, the export has no image optimiser */}
            <img key={state.term.index} src={termImage(state.term.index)} alt={alt} width={121} height={122} className="fs-term-image" decoding="async" />
            <figcaption>
              <span className="fs-term-badge">{opens ? copy.opensBadge : copy.middleBadge}</span>
              <b className="fs-term-name">{termName(info, language)}</b>
              <small>
                {termDates(info, language)} · {state.term.index * 15}°
              </small>
              <span className="fs-term-imagery">{info.imagery[language]}</span>
              <span className="fs-term-role">{role}</span>
            </figcaption>
          </figure>
          <label htmlFor={sliderId} className="fs-dial-label">
            {copy.dateLabel}: <b>{`${state.calendar.day}/${state.calendar.month}`}</b>
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={daysInYear(year) - 1}
            step={1}
            value={state.dayIndex}
            onChange={(event) => {
              hold();
              setDriven(Number(event.target.value));
              release(2500);
            }}
            aria-valuetext={`${state.calendar.day}/${state.calendar.month}`}
            className="fs-dial-range"
          />
          <p className="fs-dial-hint">{copy.hint}</p>
          <Outputs state={state} month={month} monthHan={monthHan} />
          <p className="fs-note">{copy.note}</p>
        </div>
      </div>
    </section>
  );
}

function Outputs({ state, month, monthHan }: { state: DialState; month: { stem: number; branch: number }; monthHan: string }) {
  const copy = useFengShuiWorldCopy().dial;
  const yearPillar = pillarName({ stem: Math.max(0, STEMS_HAN.indexOf(state.pillar.stem)), branch: Math.max(0, BRANCHES_HAN.indexOf(state.pillar.branch)) });
  return (
    <dl className="fs-dial-out" aria-live="off">
      <div>
        <dt>{copy.month}</dt>
        <dd>
          {copy.monthWord} <b>{state.month.name}</b>
        </dd>
      </div>
      <div>
        <dt>{copy.monthPillar}</dt>
        <dd>
          <b>{pillarName(month)}</b>{" "}
          <span className="fs-han" aria-hidden="true">
            <span style={{ color: elementColor(monthHan[0]!) }}>{monthHan[0]}</span>
            <span style={{ color: elementColor(monthHan[1]!) }}>{monthHan[1]}</span>
          </span>
        </dd>
      </div>
      <div>
        <dt>{copy.year}</dt>
        <dd>
          <b>{yearPillar}</b>{" "}
          <span className="fs-han" aria-hidden="true">
            <span style={{ color: elementColor(state.pillar.stem) }}>{state.pillar.stem}</span>
            <span style={{ color: elementColor(state.pillar.branch) }}>{state.pillar.branch}</span>
          </span>{" "}
          {state.beforeLichun ? copy.beforeLichun : ""}
        </dd>
      </div>
    </dl>
  );
}
