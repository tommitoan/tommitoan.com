"use client";

import { useEffect, useRef } from "react";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";

const REDUCED = "(prefers-reduced-motion: reduce)";

/** The roadmap as one line with three stops: what exists, what comes next, what is further out. */
export function FengShuiLanesSection() {
  const copy = useFengShuiCopy();
  const lineRef = useRef<HTMLOListElement>(null);

  // The line and its stops are drawn in once, the first time the roadmap is well on screen. Without script, or for a
  // visitor who asked for less motion, they are simply there.
  useEffect(() => {
    const line = lineRef.current;
    if (!line || window.matchMedia(REDUCED).matches) return;
    line.dataset.armed = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        line.dataset.drawn = "true";
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(line);
    return () => {
      observer.disconnect();
      delete line.dataset.armed;
      delete line.dataset.drawn;
    };
  }, []);

  return (
    <section className="fs-band fs-band-paper" data-kit-section="Lộ trình / Roadmap">
      <div className="fs-wrap">
        <WorldHeading eyebrow={copy.lanesHeading.eyebrow} title={`${copy.lanesHeading.title} ${copy.lanesHeading.accent}`} />
        <ol ref={lineRef} className="fs-road">
          {copy.lanes.map((lane, index) => (
            <li key={lane.title} className="fs-road-stop" data-status={lane.status} style={{ "--i": index } as React.CSSProperties}>
              <span className="fs-road-node" aria-hidden="true">
                {lane.status === "done" ? "✓" : ""}
              </span>
              <span className="fs-road-badge">{lane.badge}</span>
              <h3>{lane.title}</h3>
              <ul className="fs-road-items">
                {lane.items.map((item, itemIndex) => (
                  <li key={item} style={{ "--j": itemIndex } as React.CSSProperties}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
