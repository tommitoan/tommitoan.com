"use client";

import { useEffect, useState } from "react";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { clockView, formatCountdown, type ClockView, type DoubleHour } from "./clock-math";

/**
 * The footer clock: the current double-hour (canh giờ) with a countdown in minutes and seconds, between the one that has just
 * passed and the one that comes next. It renders nothing until the browser knows the time.
 */
export function WorldClock({ className }: { className?: string }) {
  const copy = useFengShuiWorldCopy().clock;
  const [view, setView] = useState<ClockView | null>(null);

  useEffect(() => {
    const update = () => setView(clockView(new Date()));
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  if (!view) return null;
  const { previous, current, next } = view;
  return (
    <div className={`fs-clock ${className ?? ""}`.trim()} role="timer" aria-label={`${copy.hour} ${current.name}, ${copy.left} ${formatCountdown(current.remainingSeconds)}`}>
      <Hour hour={previous} label={copy.previous} />
      <div className="fs-clock-hour" data-now="true" aria-hidden="true">
        <b className="fs-han">{current.han}</b>
        <small>
          {copy.hour} {current.name} · {current.range}
        </small>
        <span className="fs-clock-count">
          {formatCountdown(current.remainingSeconds)} <em>{copy.left}</em>
        </span>
        <i className="fs-clock-bar" style={{ transform: `scaleX(${current.progress.toFixed(4)})` }} />
      </div>
      <Hour hour={next} label={copy.next} />
    </div>
  );
}

function Hour({ hour, label }: { hour: DoubleHour; label: string }) {
  return (
    <div className="fs-clock-hour" aria-hidden="true">
      <b className="fs-han">{hour.han}</b>
      <small>
        {label} · {hour.range}
      </small>
      <span>{hour.name}</span>
    </div>
  );
}
