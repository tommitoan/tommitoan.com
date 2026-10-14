"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { elementColor } from "./elements";
import { dayIndexOf, daysInYear, dialState, JIE_INDEXES, ringPoint, SOLAR_TERMS_HAN } from "./dial-math";
import { RevealHeading } from "./RevealHeading";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";

const CENTRE = { x: 160, y: 160 };
const RADIUS = 112;

const subscribeNever = (): (() => void) => () => undefined;

/** Today as "year:dayIndex". The server renders a fixed day; the browser swaps in the real one after hydration. */
function todaySnapshot(): string {
  const now = new Date();
  return `${now.getFullYear()}:${dayIndexOf(now.getFullYear(), now.getMonth() + 1, now.getDate())}`;
}

/** The ecliptic ring: drag the date and the Sun moves round it, changing the Ba-zi month and, at Lichun, the year. */
export function SolarDial() {
  const copy = useFengShuiWorldCopy().dial;
  const sliderId = useId();
  const today = useSyncExternalStore(subscribeNever, todaySnapshot, () => "2026:286");
  const [yearText, indexText] = today.split(":");
  const year = Number(yearText);
  const [chosen, setChosen] = useState<number | null>(null);
  const state = dialState(year, chosen ?? Number(indexText));
  const sun = ringPoint(state.longitude, RADIUS, CENTRE);

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Tiết khí / Solar terms" aria-label={copy.title}>
      <div className="fs-wrap fs-dial">
        <svg viewBox="0 0 320 320" role="img" aria-label={copy.ringLabel} className="fs-dial-ring">
          <circle cx={CENTRE.x} cy={CENTRE.y} r={RADIUS} fill="none" stroke="var(--kit-line)" strokeWidth="1" />
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
          {JIE_INDEXES.map((termIndex, i) => {
            const at = ringPoint(termIndex * 15, RADIUS + 28, CENTRE);
            return (
              <text key={termIndex} x={at.x} y={at.y + 4} className="fs-han fs-dial-term" style={i === 0 ? { fill: "var(--kit-seal)" } : undefined}>
                {SOLAR_TERMS_HAN[termIndex]}
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
    </section>
  );
}
