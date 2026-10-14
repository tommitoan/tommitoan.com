"use client";

import { useEffect, useRef } from "react";
import {
  GATE_FULL_CLIP,
  PAPER_COLOUR,
  PAPER_GATE_DURATION_MS,
  gateStartClip,
  type GateBox,
} from "@/components/gateway/paperGate";

interface PaperGateProps {
  /** Rectangle of the portal frame at the moment it was chosen. */
  box: GateBox;
  radiusPx: number;
  onOpen: () => void;
}

/** A sheet of paper that grows from the chosen frame to the whole screen and then calls `onOpen`. */
export function PaperGate({ box, radiusPx, onOpen }: PaperGateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onOpenRef = useRef(onOpen);
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const start = gateStartClip(box, { width: window.innerWidth, height: window.innerHeight }, radiusPx);
    // The paper fades in while it grows, so it does not pop over the planet.
    const animation = element.animate(
      [
        { clipPath: start, opacity: 0 },
        { clipPath: start, opacity: 1, offset: 0.18 },
        { clipPath: GATE_FULL_CLIP, opacity: 1 },
      ],
      { duration: PAPER_GATE_DURATION_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
    );
    let cancelled = false;
    animation.finished.then(
      () => {
        if (!cancelled) onOpenRef.current();
      },
      () => undefined,
    );
    return () => {
      cancelled = true;
      animation.cancel();
    };
  }, [box, radiusPx]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 120, background: PAPER_COLOUR, opacity: 0 }}
    />
  );
}
