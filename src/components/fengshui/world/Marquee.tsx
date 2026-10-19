"use client";

import { useEffect, useMemo, useRef } from "react";
import { elementColor } from "./elements";
import { marqueeAdvance, marqueeSkew, sixtyCycle, smoothVelocity } from "./marquee-math";
import { RevealHeading } from "./RevealHeading";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { useWorldMode } from "./use-world-mode";

function Row({ items, trackRef, reverse }: { items: string[]; trackRef?: React.Ref<HTMLDivElement>; reverse?: boolean }) {
  return (
    <div className="fs-marquee-row" data-reverse={reverse ? "true" : undefined} aria-hidden="true">
      <div ref={trackRef} className="fs-marquee-track">
        {[0, 1].flatMap((copy) =>
          items.map((han) => {
            const [stem, branch] = han.split("");
            return (
              <span key={`${copy}-${han}`} className="fs-marquee-item fs-han">
                <span style={{ color: elementColor(stem) }}>{stem}</span>
                <span style={{ color: elementColor(branch) }}>{branch}</span>
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}

/** The sixty stem-and-branch pairs in two rows that run in opposite directions and speed up while the page scrolls. */
export function Marquee() {
  const copy = useFengShuiWorldCopy().marquee;
  const mode = useWorldMode();
  const items = useMemo(() => sixtyCycle(), []);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const band = bandRef.current;
    const rows = [firstRef.current, secondRef.current];
    if (mode !== "scroll" || !band || !rows[0] || !rows[1]) return;
    const positions = [0, 0];
    let velocity = 0;
    let lastY = window.scrollY;
    let last = performance.now();
    let handle = 0;
    let visible = false;
    const loop = (time: number) => {
      if (!visible) {
        handle = 0;
        return;
      }
      const dt = Math.min(40, time - last);
      last = time;
      velocity = smoothVelocity(velocity, window.scrollY - lastY);
      lastY = window.scrollY;
      rows.forEach((row, index) => {
        if (!row) return;
        const direction = index === 0 ? -1 : 1;
        positions[index] = marqueeAdvance(positions[index], row.scrollWidth / 2, direction, dt, velocity, true);
        row.style.transform = `translate3d(${positions[index].toFixed(1)}px,0,0) skewX(${marqueeSkew(velocity, direction, true).toFixed(2)}deg)`;
      });
      handle = window.requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible && !handle) {
        last = performance.now();
        lastY = window.scrollY;
        handle = window.requestAnimationFrame(loop);
      }
    });
    observer.observe(band);
    return () => {
      observer.disconnect();
      if (handle) window.cancelAnimationFrame(handle);
      rows.forEach((row) => {
        if (row) row.style.transform = "";
      });
    };
  }, [mode]);

  return (
    <section ref={bandRef} className="fs-band fs-band-paper fs-marquee" data-mode={mode} data-kit-section="Giáp Tý / Cycle" aria-label={copy.title}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <p className="fs-copy">{copy.caption}</p>
      </div>
      <Row items={items} trackRef={firstRef} />
      <Row items={items} trackRef={secondRef} reverse />
    </section>
  );
}
