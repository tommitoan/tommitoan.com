"use client";

import { useEffect, useRef, useState } from "react";
import { useFengShuiCopy } from "@/components/fengshui/FengShuiLanguage";
import { useReducedMotion } from "@/components/fengshui/world/use-reduced-motion";
import { WorldHeading } from "@/components/fengshui/world/WorldHeading";

/** How long each principle stays in focus while the section plays by itself. */
const AUTOPLAY_MS = 5000;

/**
 * The principles one at a time: the one in focus is lit and fills a thin bar, then the next takes over. Moving the pointer
 * over a principle (or focusing it) lights it at once and holds it while the pointer stays in the list. All three are always
 * on the page in full, so nothing depends on the show.
 */
export function FengShuiPrinciplesSection() {
  const copy = useFengShuiCopy();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const count = copy.principles.length;
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
    const timer = window.setTimeout(() => setSelected((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, selected, count]);

  return (
    <section ref={sectionRef} className="fs-band fs-band-paper" data-kit-section="Nguyên tắc / Principles">
      <div className="fs-wrap fs-narrow">
        <WorldHeading eyebrow={copy.principlesHeading.eyebrow} title={`${copy.principlesHeading.title} ${copy.principlesHeading.accent}`} />
        <div className="fs-pr-stage">
          <span key={selected} className="fs-pr-mark" aria-hidden="true">
            {String(selected + 1).padStart(2, "0")}
          </span>
          <ol
            className="fs-pr-list"
            onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
          >
            {copy.principles.map((principle, index) => (
              <li key={principle}>
                <button
                  type="button"
                  className="fs-pr-item"
                  aria-pressed={index === selected}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setSelected(index)}
                  onFocus={() => setSelected(index)}
                  onClick={() => setSelected(index)}
                >
                  <span className="fs-pr-num">{index + 1}</span>
                  <span className="fs-pr-text">{principle}</span>
                  {index === selected ? <i className="fs-pr-timer" data-running={playing ? "true" : "false"} aria-hidden="true" /> : null}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
