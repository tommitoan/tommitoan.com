"use client";

import { Fragment, useEffect, useRef } from "react";
import { useWorldMode } from "@/components/fengshui/world/use-world-mode";
import { fillProgress, splitWords, wordsFilled } from "./blog-math";

type Props = { text: string; className?: string };

/**
 * A paragraph whose words take their full colour one by one as the reader scrolls past it. Every word is real text in
 * its full colour by default (readable, selectable and indexable without script); after hydration, on the full tier and
 * wide screens, the words are dimmed and filled in through attributes, so React never re-renders them.
 */
export function ScrollFill({ text, className }: Props) {
  const mode = useWorldMode();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = splitWords(text);

  useEffect(() => {
    const root = ref.current;
    if (mode !== "scroll" || !root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".fs-fill-word"));
    root.setAttribute("data-fill", "on");
    let filled = 0;
    let frame = 0;
    const paint = (target: number) => {
      for (let index = filled; index < target; index += 1) nodes[index]?.setAttribute("data-on", "");
      for (let index = filled - 1; index >= target; index -= 1) nodes[index]?.removeAttribute("data-on");
      filled = target;
    };
    const update = () => {
      frame = 0;
      const box = root.getBoundingClientRect();
      paint(wordsFilled(nodes.length, fillProgress(box.top, box.height, window.innerHeight)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      root.removeAttribute("data-fill");
      nodes.forEach((node) => node.removeAttribute("data-on"));
    };
  }, [mode, text]);

  return (
    <p ref={ref} className={`fs-fill${className ? ` ${className}` : ""}`}>
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span className="fs-fill-word">{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
