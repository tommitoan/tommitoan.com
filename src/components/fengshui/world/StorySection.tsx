"use client";

import { useEffect, useRef, useState } from "react";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { RevealHeading } from "./RevealHeading";
import { easeToward, pinProgress } from "./scene-math";
import { PillarCard } from "./PillarCards";
import { SAMPLE_PILLARS } from "./scene-math";
import { ringRotation, storyView, type StoryView } from "./story-math";
import { useWorldMode } from "./use-world-mode";

/** The four steps of reading a chart. Pinned and driven by scroll on wide screens, a plain grid elsewhere. */
export function StorySection() {
  return useWorldMode() === "scroll" ? <ScrollStory /> : <StaticStory />;
}

function Ring({ glyph, spinRef }: { glyph: string; spinRef?: React.Ref<SVGSVGElement> }) {
  return (
    <div className="fs-ring" aria-hidden="true">
      <svg ref={spinRef} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="76" strokeDasharray="2 6" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="100" y1="4" x2="100" y2="20" transform={`rotate(${i * 45} 100 100)`} />
        ))}
        <circle className="fs-ring-arc" cx="100" cy="100" r="58" strokeDasharray="70 300" />
      </svg>
      <span className="fs-ring-glyph fs-han">{glyph}</span>
    </div>
  );
}

function ScrollStory() {
  const world = useFengShuiWorldCopy();
  const copy = world.story;
  const labels = world.scene.pillarLabels;
  const wrapperRef = useRef<HTMLElement>(null);
  const spinRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<StoryView>({ step: 0, cards: 0 });
  const { step, cards } = view;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const spin = spinRef.current;
    const bar = barRef.current;
    if (!wrapper || !spin || !bar) return;
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
      spin.style.transform = `rotate(${ringRotation(current).toFixed(1)}deg)`;
      bar.style.transform = `scaleX(${current.toFixed(3)})`;
      const next = storyView(current, 4);
      setView((previous) => (previous.step === next.step && previous.cards === next.cards ? previous : next));
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
  }, []);

  return (
    <section ref={wrapperRef} className="fs-story" data-kit-section="Cách đọc / How to read" aria-label={copy.label}>
      <div className="fs-story-stage">
        <div className="fs-wrap fs-story-grid">
          <Ring glyph={copy.steps[step].glyph} spinRef={spinRef} />
          <div>
            <span className="fs-eyebrow">{copy.eyebrow}</span>
            <RevealHeading className="fs-title">{copy.title}</RevealHeading>
            <div className="fs-story-steps">
              {copy.steps.map((item, index) => (
                <article key={item.kicker} className="fs-story-step" data-active={index === step ? "true" : "false"} aria-hidden={index === step ? undefined : true}>
                  <span className="fs-kicker">{item.kicker}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
            <div className="fs-story-cards" aria-hidden="true">
              {SAMPLE_PILLARS.map((han, index) => (
                <div key={han} className="fs-story-slot" data-shown={index < cards ? "true" : "false"}>
                  <PillarCard han={han} label={labels[index]} generic={{ stem: copy.stemWord, branch: copy.branchWord }} />
                </div>
              ))}
            </div>
            <div className="fs-story-count" aria-hidden="true">
              <b>{String(step + 1).padStart(2, "0")}</b>
              <span>/ 04</span>
              <i>
                <u ref={barRef} />
              </i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticStory() {
  const copy = useFengShuiWorldCopy().story;
  return (
    <section className="fs-band fs-band-paper" data-kit-section="Cách đọc / How to read" aria-label={copy.label}>
      <div className="fs-wrap">
        <span className="fs-eyebrow">{copy.eyebrow}</span>
        <RevealHeading className="fs-title">{copy.title}</RevealHeading>
        <div className="fs-grid fs-grid-2">
          {copy.steps.map((item) => (
            <article key={item.kicker} className="fs-panel fs-story-card">
              <span className="fs-han fs-story-card-glyph" aria-hidden="true">
                {item.glyph}
              </span>
              <span className="fs-kicker">{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
