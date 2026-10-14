"use client";

import { useEffect, useRef } from "react";
import { clamp } from "@kit/color";
import { useFengShuiWorldCopy } from "@/components/fengshui/FengShuiLanguage";
import { PillarCard } from "./PillarCards";
import { SAMPLE_PILLARS } from "./scene-math";
import { useWorldMode } from "./use-world-mode";

/** How far each card drifts, in percent of its height, while the hero scrolls away. */
const DRIFT = [-22, -8, -34, -14] as const;
const TILT = [-6, 4, -3, 5] as const;

/** The four pillars of the sample chart. On wide screens they fly in and then drift at different speeds as you scroll. */
export function HeroPillars() {
  const copy = useFengShuiWorldCopy().scene;
  const mode = useWorldMode();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (mode !== "scroll" || !root) return;
    const cards = Array.from(root.children) as HTMLElement[];
    const entrances = cards.map((card, index) =>
      card.animate([{ opacity: 0, transform: `translateY(70px) rotate(${TILT[index]}deg)` }, { opacity: 1, transform: "none" }], {
        duration: 1000,
        delay: 900 + index * 120,
        easing: "cubic-bezier(0.22, 1, 0.3, 1)",
        fill: "backwards",
      }),
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = clamp(window.scrollY / (window.innerHeight * 0.9), 0, 1);
      cards.forEach((card, index) => {
        card.style.translate = `0 ${(DRIFT[index] * progress).toFixed(2)}%`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      entrances.forEach((animation) => animation.cancel());
      cards.forEach((card) => {
        card.style.translate = "";
      });
    };
  }, [mode]);

  return (
    <div ref={rootRef} className="fs-hero-pillars" role="group" aria-label={copy.label}>
      {SAMPLE_PILLARS.map((han, index) => (
        <PillarCard key={han} han={han} label={copy.pillarLabels[index]} />
      ))}
    </div>
  );
}
