"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gatewayHomeConfig } from "@/components/gateway/gatewayHomeConfig";
import { stepProgress } from "@/components/gateway/gatewayLoader";

/** How long the screen takes to fade once the ring is full; the page opens when the fade is over. */
const FADE_MS = 600;

interface GatewayLoadingScreenProps {
  /** How much of the page's work is done, 0 to 100 (see completedWork). At 100 the ring is filled and the screen leaves. */
  completed: number;
  isVisible: boolean;
  /** Called once the ring has reached 100 and the screen has started to fade. */
  onDone: () => void;
}

/**
 * The loading ring. Its progress lives in this component and is written to the page directly, one animation frame at a time
 * (the number as text, the ring as one CSS variable), so the rest of the home page does not render again for every step and
 * the ring moves continuously instead of in jumps. The dashes are drawn once: a second, glowing copy is revealed by a conic
 * mask that sweeps round with the progress.
 */
export function GatewayLoadingScreen({ completed, isVisible, onDone }: GatewayLoadingScreenProps) {
  const loaderConfig = gatewayHomeConfig.loader;
  const dashCount = loaderConfig.dashDensity;
  const ringColor = loaderConfig.color;
  const glowBlur = loaderConfig.glowStrength;
  const scaleSize = loaderConfig.scaleSize;

  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(completed);
  const changedAt = useRef(0);
  const onDoneRef = useRef(onDone);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (completedRef.current !== completed) changedAt.current = performance.now();
    completedRef.current = completed;
    onDoneRef.current = onDone;
  }, [completed, onDone]);

  useEffect(() => {
    if (!isVisible) return;
    let frame = 0;
    let last = 0;
    let shown = 0;
    let shownText = -1;
    let doneTimer = 0;
    const tick = (now: number) => {
      if (!last) {
        last = now;
        changedAt.current = now;
      }
      shown = stepProgress(shown, completedRef.current, now - changedAt.current, now - last);
      last = now;
      ringRef.current?.style.setProperty("--p", shown.toFixed(2));
      const whole = Math.round(shown);
      if (whole !== shownText && textRef.current) {
        shownText = whole;
        textRef.current.textContent = `${whole}%`;
      }
      if (shown >= 100) {
        setFinishing(true);
        doneTimer = window.setTimeout(() => onDoneRef.current(), FADE_MS);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(doneTimer);
    };
  }, [isVisible]);

  const dashes = Array.from({ length: dashCount }, (_, index) => (
    <g key={index} transform={`rotate(${(index / dashCount) * 360} 80 80)`}>
      <line x1="80" y1="11" x2="80" y2="25" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </g>
  ));
  const sweep = "conic-gradient(from 0deg, #000 calc(var(--p, 0) * 1%), transparent calc(var(--p, 0) * 1%))";

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="gateway-loading"
          initial={{ opacity: 1 }}
          animate={finishing ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: FADE_MS / 1000, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center bg-black"
          style={{ zIndex: 140 }}
        >
          <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
            <div
              className="pointer-events-none absolute rounded-full blur-3xl"
              style={{
                width: `${20 * scaleSize}rem`,
                height: `${20 * scaleSize}rem`,
                backgroundColor: `${ringColor}1a`,
              }}
            />

            <div className="relative flex flex-col items-center justify-center text-center">
              <div
                ref={ringRef}
                role="progressbar"
                aria-label="Loading"
                className="relative"
                style={{ width: `${18 * scaleSize}rem`, height: `${18 * scaleSize}rem`, ["--p" as string]: 0 }}
              >
                <svg className="absolute inset-0 -rotate-90 text-white/15" viewBox="0 0 160 160" aria-hidden="true">
                  {dashes}
                </svg>

                {/* A glint that circles the ring on its own: it is moved by the compositor, so it keeps going when the page is busy starting the 3D scene. */}
                <div className="gateway-loader-glint absolute inset-0" aria-hidden="true" />

                <div
                  className="absolute inset-0"
                  style={{ WebkitMaskImage: sweep, maskImage: sweep }}
                  aria-hidden="true"
                >
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160" style={{ color: ringColor }}>
                    <defs>
                      <filter id="gateway-loader-glow" x="-200%" y="-200%" width="400%" height="400%">
                        <feGaussianBlur stdDeviation={glowBlur} result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g filter="url(#gateway-loader-glow)" opacity="0.9">
                      {dashes}
                    </g>
                  </svg>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    ref={textRef}
                    className="font-medium leading-none tracking-[-0.04em] text-cyan-100 [font-family:Inter,ui-sans-serif,system-ui,sans-serif]"
                    style={{
                      fontSize: `clamp(${1.4 * scaleSize}rem, ${3.5 * scaleSize}vw, ${2.2 * scaleSize}rem)`,
                      color: ringColor,
                      filter: `drop-shadow(0 0 18px ${ringColor}80)`,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    0%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
