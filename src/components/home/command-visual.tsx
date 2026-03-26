"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteContent } from "@/content/site-content";

const nodePositions = [
  { title: "Portfolio", left: "18%", top: "28%" },
  { title: "Discover", left: "50%", top: "20%" },
  { title: "Products", left: "76%", top: "58%" },
];

const nodeAccent = {
  Portfolio: "rgba(191, 225, 255, 0.95)",
  Discover: "rgba(99, 236, 255, 0.95)",
  Products: "rgba(255, 202, 124, 0.95)",
};

export function CommandVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="command-stage deck-frame relative overflow-hidden rounded-[2.2rem] p-5 md:p-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,211,255,0.14),transparent_26%),radial-gradient(circle_at_80%_30%,rgba(255,197,109,0.12),transparent_24%)]" />
      <div className="relative h-[27rem] md:h-[31rem]">
        <div className="absolute inset-x-[14%] top-[14%] h-[54%] rounded-full border border-cyan-200/10" />
        <div className="absolute inset-x-[24%] top-[23%] h-[36%] rounded-full border border-white/8" />
        <div className="absolute left-1/2 top-1/2 h-[11rem] w-[11rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(12,24,38,0.96),rgba(8,12,18,0.94))] shadow-[0_0_120px_rgba(86,206,255,0.12)]" />

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0.5, scale: 0.92 }}
          animate={reducedMotion ? undefined : { opacity: [0.38, 0.82, 0.38], scale: [0.96, 1.04, 0.96] }}
          transition={reducedMotion ? undefined : { duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,224,255,0.26),rgba(110,224,255,0.06),transparent)] blur-sm"
        />

        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(13,23,38,0.96),rgba(6,9,16,0.98))]">
          <div>
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-white/42">Core</p>
            <p className="mt-1 text-center font-[var(--font-display)] text-lg font-semibold tracking-[-0.04em] text-white">
              TOMMI
            </p>
          </div>
        </div>

        {nodePositions.map((node, index) => (
          <motion.div
            key={node.title}
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={
              reducedMotion
                ? undefined
                : {
                    opacity: { duration: 0.5, delay: 0.18 + index * 0.12 },
                    scale: { duration: 0.5, delay: 0.18 + index * 0.12 },
                    y: { duration: 3.8 + index * 0.7, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: node.left, top: node.top }}
          >
            <div className="command-node min-w-[8rem] rounded-[1.2rem] px-4 py-3">
              <div
                className="mb-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: nodeAccent[node.title as keyof typeof nodeAccent], boxShadow: `0 0 18px ${nodeAccent[node.title as keyof typeof nodeAccent]}` }}
              />
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Route Node</p>
              <p className="mt-1 font-[var(--font-display)] text-xl font-semibold text-white">{node.title}</p>
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 grid gap-3 md:grid-cols-4">
          {siteContent.home.signals.map((signal, index) => (
            <motion.div
              key={signal.label}
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={reducedMotion ? undefined : { duration: 0.55, delay: 0.42 + index * 0.08 }}
              className="telemetry-cell rounded-[1.2rem] px-4 py-4"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">{signal.label}</p>
              <p className="mt-2 text-sm font-medium text-white/78">{signal.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
