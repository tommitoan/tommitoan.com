"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import { siteContent, type GatewayPanel } from "@/content/site-content";

const panelAccent = {
  ice: {
    beam: "from-sky-100/46 via-sky-200/12 to-transparent",
    glow: "shadow-[0_28px_90px_rgba(156,214,255,0.12)]",
    label: "text-sky-100",
  },
  cyan: {
    beam: "from-cyan-300/56 via-sky-300/16 to-transparent",
    glow: "shadow-[0_34px_110px_rgba(87,231,255,0.16)]",
    label: "text-cyan-100",
  },
  amber: {
    beam: "from-amber-200/54 via-orange-300/16 to-transparent",
    glow: "shadow-[0_30px_100px_rgba(255,193,108,0.14)]",
    label: "text-amber-100",
  },
} as const;

const layoutClasses: Record<GatewayPanel["layout"], string> = {
  compact: "xl:min-h-[22rem]",
  feature: "xl:min-h-[31rem] xl:row-span-2",
  medium: "xl:min-h-[26rem]",
};

export function GatewayPanels() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="grid gap-4 xl:grid-cols-[0.84fr_1.18fr]">
      <div className="grid gap-4 xl:grid-rows-[1fr_1fr]">
        {siteContent.gatewayPanels
          .filter((panel) => panel.layout !== "feature")
          .map((panel, index) => (
            <PanelCard key={panel.title} panel={panel} index={index} reducedMotion={reducedMotion} />
          ))}
      </div>

      <div>
        {siteContent.gatewayPanels
          .filter((panel) => panel.layout === "feature")
          .map((panel, index) => (
            <PanelCard key={panel.title} panel={panel} index={index + 1} reducedMotion={reducedMotion} />
          ))}
      </div>
    </section>
  );
}

function PanelCard({
  panel,
  index,
  reducedMotion,
}: {
  panel: GatewayPanel;
  index: number;
  reducedMotion: boolean | null;
}) {
  const Icon = panel.kind === "external" ? ArrowUpRight : CornerDownRight;
  const accent = panelAccent[panel.accent];

  return (
    <motion.div
      initial={reducedMotion ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={reducedMotion ? undefined : { duration: 0.72, delay: 0.12 * index }}
      className={layoutClasses[panel.layout]}
    >
      <Link
        href={panel.href}
        target={panel.kind === "external" ? "_blank" : undefined}
        rel={panel.kind === "external" ? "noreferrer" : undefined}
        aria-label={`${panel.title}: ${panel.description}`}
        className={`route-panel route-panel-${panel.layout} ${accent.glow} block h-full overflow-hidden rounded-[2rem]`}
      >
        <div className="route-panel-inner h-full p-6 md:p-7 xl:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                {panel.eyebrow}
              </span>
              <div>
                <h2 className={`font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-white md:text-[2.45rem] ${panel.layout === "feature" ? "xl:text-[3.4rem]" : ""}`}>
                  {panel.title}
                </h2>
                <p className={`mt-3 max-w-md leading-7 text-white/68 ${panel.layout === "feature" ? "text-base md:text-lg" : "text-sm md:text-[15px]"}`}>
                  {panel.description}
                </p>
              </div>
            </div>

            <div className={`gateway-icon-wrap ${accent.label}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-8 max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">Route intent</p>
            <p className="mt-3 text-sm leading-7 text-white/76 md:text-[15px]">{panel.detail}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {panel.metrics.map((metric) => (
              <span key={metric} className="status-chip inline-flex rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] text-white/72">
                {metric}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-4 pt-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">Path cue</p>
              <p className="mt-2 max-w-[16rem] text-sm leading-7 text-white/66">{panel.cue}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">Route state</p>
              <p className="mt-2 text-sm font-medium text-white/82">{panel.status}</p>
            </div>
          </div>

          <div className={`route-beam bg-gradient-to-r ${accent.beam}`} />
        </div>
      </Link>
    </motion.div>
  );
}
