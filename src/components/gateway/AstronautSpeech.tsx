"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { typedText } from "@/components/gateway/gatewayHover";

type Props = {
  /** The portal's name and what the astronaut says about it. Null hides the bubble. */
  portal: { label: string; speech: string } | null;
  /** The side of the screen the astronaut stands on; the bubble sits above him. */
  side: "left" | "right";
  /** A phone: the bubble is centred above the astronaut, as wide as the screen allows, and ends with a hint to tap again. */
  compact?: boolean;
  /** The line under the speech on a phone ("Tap again to enter"). */
  hint?: string;
};

const CHARS_PER_SECOND = 48;

/** The astronaut's speech bubble: the line is typed out, and the tail points down at him. Decoration for the pointer: the portal's own label stays on the frame. */
export function AstronautSpeech({ portal, side, compact = false, hint }: Props) {
  const speech = portal?.speech ?? "";
  // The typing clock belongs to one line; a new line starts from zero without resetting state inside the effect.
  const [clock, setClock] = useState({ speech: "", elapsed: 0 });
  const elapsed = clock.speech === speech ? clock.elapsed : 0;

  useEffect(() => {
    if (!speech) return;
    const start = performance.now();
    const timer = window.setInterval(() => {
      const next = performance.now() - start;
      setClock({ speech, elapsed: next });
      if ((next / 1000) * CHARS_PER_SECOND >= speech.length) window.clearInterval(timer);
    }, 32);
    return () => window.clearInterval(timer);
  }, [speech]);

  return (
    <AnimatePresence>
      {portal ? (
        <motion.div
          key="speech"
          aria-hidden="true"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
          className={`pointer-events-none absolute z-[70] rounded-2xl border border-white/25 bg-[rgba(10,14,32,0.78)] text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md ${
            compact ? "w-[min(20rem,calc(100vw-2rem))] px-4 py-3" : "w-[min(18.5rem,20vw)] px-5 py-4"
          }`}
          style={compact ? { bottom: "27vh", left: "50%", marginLeft: "min(-10rem, calc(-50vw + 1rem))" } : { bottom: "53vh", ...(side === "right" ? { right: "3.5vw" } : { left: "3.5vw" }) }}
        >
          <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-200/80" style={{ fontFamily: "var(--font-gateway-display), var(--font-gateway-body), sans-serif" }}>{portal.label}</p>
          <p className={`${compact ? "min-h-[5.2rem] text-[0.88rem]" : "min-h-[3.9rem] text-[0.95rem]"} leading-relaxed text-white/90`}>
            {typedText(speech, elapsed, CHARS_PER_SECOND)}
            <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-cyan-200/80" />
          </p>
          {compact && hint ? <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-200">{hint}</p> : null}
          <span
            className="absolute -bottom-2 h-4 w-4 rotate-45 border-b border-r border-white/25 bg-[rgba(10,14,32,0.78)]"
            style={compact ? { left: "calc(50% - 0.5rem)" } : side === "right" ? { right: "28%" } : { left: "28%" }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
