"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { elementColor } from "./elements";
import { arcPath, dayIndexOf, daysInYear, dialDay, dialState, type DialState, ringPoint, SOLAR_TERMS_HAN } from "./dial-math";
import { RevealHeading } from "./RevealHeading";
import { easeToward, pinProgress } from "./scene-math";
import { useWorldMode } from "./use-world-mode";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";

const CENTRE = { x: 160, y: 160 };
const RADIUS = 108;

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
  const sun = ringPoint(state.longitude, RADIUS, CENTRE);
  const start = dialState(year, 0).longitude;
  const trail = arcPath(start, state.longitude, RADIUS, CENTRE);
  return (
    <div className="fs-wrap fs-dial">
      <svg viewBox="0 0 320 320" role="img" aria-label={copy.ringLabel} className="fs-dial-ring">
        <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke="var(--kit-line)" strokeWidth="1" />
        {trail ? <path d={trail} fill="none" stroke="var(--kit-seal)" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" /> : null}
        <circle cx={CENTRE.x} cy={CENTRE.y} r="18" fill="none" stroke="var(--kit-ink)" strokeWidth="1.6" />
        <text x={CENTRE.x} y={CENTRE.y + 6} className="fs-han fs-dial-earth">
          地
        </text>
        {Array.from({ length: 24 }, (_, k) => {
          const longitude = k * 15;
          const opens = (longitude - 315 + 360) % 30 === 0;
          const inner = ringPoint(longitude, RADIUS - (opens ? 10 : 5), CENTRE);
          const outer = ringPoint(longitude, RADIUS + (opens ? 10 : 5), CENTRE);
          return <line key={k} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={opens ? "var(--kit-seal)" : "var(--kit-line)"} strokeWidth={opens ? 2.2 : 1} />;
        })}
        {SOLAR_TERMS_HAN.map((han, termIndex) => {
          const at = ringPoint(termIndex * 15, RADIUS + 27, CENTRE);
          const opens = (termIndex * 15 - 315 + 360) % 30 === 0;
          return (
            <text key={termIndex} x={at.x} y={at.y + 3.5} className="fs-han fs-dial-term" data-opens={opens ? "true" : undefined} data-current={termIndex === state.term.index ? "true" : undefined}>
              {han}
            </text>
          );
        })}
        <g transform={`translate(${sun.x.toFixed(1)} ${sun.y.toFixed(1)})`}>
          <circle r="13" fill="#c4543a" opacity="0.22" />
          <circle r="7.5" fill="#c4543a" />
        </g>
      </svg>

      <div>
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.description}</p>
        {control}
        <dl className="fs-dial-out" aria-live="polite">
          <div>
            <dt>{copy.sunAt}</dt>
            <dd>
              <b>{state.longitude.toFixed(1)}</b>
              {copy.degreesUnit}
            </dd>
          </div>
          <div>
            <dt>{copy.lastTerm}</dt>
            <dd>
              <b className="fs-han">{state.term.han}</b> {state.term.name}
            </dd>
          </div>
          <div>
            <dt>{copy.month}</dt>
            <dd>
              {copy.monthWord} <b>{state.month.name}</b> (<span className="fs-han">{state.month.han}</span>)
            </dd>
          </div>
          <div>
            <dt>{copy.year}</dt>
            <dd>
              <b className="fs-han">
                <span style={{ color: elementColor(state.pillar.stem) }}>{state.pillar.stem}</span>
                <span style={{ color: elementColor(state.pillar.branch) }}>{state.pillar.branch}</span>
              </b>{" "}
              {state.beforeLichun ? copy.beforeLichun : ""}
            </dd>
          </div>
        </dl>
        <p className="fs-note">{copy.note}</p>
      </div>
    </div>
  );
}
