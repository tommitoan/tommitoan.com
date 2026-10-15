"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BRANCHES_HAN, STEMS_HAN } from "@kit/solar";
import { elementColor } from "./elements";
import { arcPath, dayIndexOf, daysInYear, dialDay, dialState, type DialState, isMonthOpener, radialLabel, ringPoint } from "./dial-math";
import { monthPillar, pillarName } from "./pillar-math";
import { RevealHeading } from "./RevealHeading";
import { easeToward, pinProgress } from "./scene-math";
import { useWorldMode } from "./use-world-mode";
import { useFengShuiLanguage, useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { termDates, termImage, termName, TERMS } from "@/content/fengshui-terms";

const CENTRE = { x: 230, y: 230 };
const RADIUS = 100;
const LABEL_RADIUS = RADIUS + 15;

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

/**
 * The ecliptic ring with its 24 solar terms. On wide screens it is pinned and the Sun makes one full turn while you scroll,
 * passing every term; elsewhere you drag the date. Either way it shows the Ba-zi month and, at Lichun, the year changing.
 */
export function SolarDial() {
  return useWorldMode() === "scroll" ? <ScrollDial /> : <DraggableDial />;
}

function DraggableDial() {
  const copy = useFengShuiWorldCopy().dial;
  const sliderId = useId();
  const { year, dayIndex } = useToday();
  const [chosen, setChosen] = useState<number | null>(null);
  const state = dialState(year, chosen ?? dayIndex);
  return (
    <section className="fs-band fs-band-paper" data-kit-section="Tiết khí / Solar terms" aria-label={copy.title}>
      <DialLayout
        year={year}
        state={state}
        control={
          <>
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
              onChange={(event) => setChosen(Number(event.target.value))}
              aria-valuetext={`${state.calendar.day}/${state.calendar.month}`}
              className="fs-dial-range"
            />
          </>
        }
      />
    </section>
  );
}

function ScrollDial() {
  const copy = useFengShuiWorldCopy().dial;
  const { year } = useToday();
  const wrapperRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [day, setDay] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const bar = barRef.current;
    if (!wrapper || !bar) return;
    let current = 0;
    let handle = 0;
    let active = false;
    const loop = () => {
      if (!active) {
        handle = 0;
        return;
      }
      const box = wrapper.getBoundingClientRect();
      current = easeToward(current, pinProgress(box.top, box.height, window.innerHeight));
      bar.style.transform = `scaleX(${current.toFixed(3)})`;
      // The ring is redrawn only when the day changes, not on every frame.
      setDay(dialDay(current, year));
      handle = window.requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        active = entries[0]?.isIntersecting ?? false;
        if (active && !handle) handle = window.requestAnimationFrame(loop);
      },
      { rootMargin: "50% 0px" },
    );
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      if (handle) window.cancelAnimationFrame(handle);
    };
  }, [year]);

  const state = dialState(year, day);
  return (
    <section ref={wrapperRef} className="fs-dial-scroll" data-kit-section="Tiết khí / Solar terms" aria-label={copy.title}>
      <div className="fs-dial-stage">
        <DialLayout
          year={year}
          state={state}
          control={
            <>
              <p className="fs-dial-label">
                {copy.dateLabel}: <b>{`${state.calendar.day}/${state.calendar.month}`}</b>
              </p>
              <div className="fs-dial-progress" aria-hidden="true">
                <u ref={barRef} />
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}

function DialLayout({ year, state, control }: { year: number; state: DialState; control: ReactNode }) {
  const copy = useFengShuiWorldCopy().dial;
  const language = useFengShuiLanguage();
  const sun = ringPoint(state.longitude, RADIUS, CENTRE);
  const start = dialState(year, 0).longitude;
  const trail = arcPath(start, state.longitude, RADIUS, CENTRE);
  const info = TERMS[state.term.index]!;
  const opens = isMonthOpener(state.term.index);
  const month = monthPillar(state.pillar.stem, state.month.index);
  const monthHan = `${STEMS_HAN[month.stem]}${BRANCHES_HAN[month.branch]}`;
  const role = (opens ? copy.opens : copy.middle).replaceAll("{month}", state.month.name);
  const alt = copy.imageAlt.replace("{name}", termName(info, language));
  return (
    <div className="fs-wrap fs-dial">
      <svg viewBox="0 0 460 460" role="img" aria-label={copy.ringLabel} className="fs-dial-ring">
        <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke="var(--kit-line)" strokeWidth="1" />
        {trail ? <path d={trail} fill="none" stroke="var(--kit-seal)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" /> : null}
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
        <g transform={`translate(${sun.x.toFixed(1)} ${sun.y.toFixed(1)})`}>
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
        {control}
        <dl className="fs-dial-out" aria-live="polite">
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
              <b>{yearName(state)}</b>{" "}
              <span className="fs-han" aria-hidden="true">
                <span style={{ color: elementColor(state.pillar.stem) }}>{state.pillar.stem}</span>
                <span style={{ color: elementColor(state.pillar.branch) }}>{state.pillar.branch}</span>
              </span>{" "}
              {state.beforeLichun ? copy.beforeLichun : ""}
            </dd>
          </div>
        </dl>
        <p className="fs-note">{copy.note}</p>
      </div>
    </div>
  );
}

/** "Bính Ngọ" for the Ba-zi year of the dial's state. */
function yearName(state: DialState): string {
  return pillarName({ stem: Math.max(0, STEMS_HAN.indexOf(state.pillar.stem)), branch: Math.max(0, BRANCHES_HAN.indexOf(state.pillar.branch)) });
}
