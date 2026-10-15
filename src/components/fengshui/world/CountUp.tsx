"use client";

import { useEffect, useRef } from "react";
import { countAt } from "./count-math";

type Props = {
  value: number;
  /** Length of the count in milliseconds. */
  duration?: number;
};

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * A number that counts up from zero the first time it is mostly on screen. The server and visitors who asked for less
 * motion get the final value at once, so the page is complete without any script.
 */
export function CountUp({ value, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia(REDUCED).matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const progress = (now - start) / duration;
          element.textContent = String(countAt(value, progress));
          if (progress < 1) frame = window.requestAnimationFrame(step);
        };
        element.textContent = "0";
        frame = window.requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      element.textContent = String(value);
    };
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}
