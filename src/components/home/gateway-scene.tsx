"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/content/site-content";

type SceneRoute = {
  title: "Portfolio" | "Discover" | "Products";
  badge: string;
  action: string;
  note: string;
  desktopClass: string;
  art: ReactNode;
};

const routes: SceneRoute[] = [
  {
    title: "Portfolio",
    badge: "Launch Pad",
    action: "Board the paper shuttle",
    note: "Resume, experience, and professional proof.",
    desktopClass: "xl:absolute xl:left-[4%] xl:top-[30%] xl:w-[20rem]",
    art: (
      <div className="paper-shuttle-art">
        <div className="paper-shuttle-body" />
        <div className="paper-shuttle-window" />
        <div className="paper-shuttle-fin" />
        <div className="paper-shuttle-flame" />
      </div>
    ),
  },
  {
    title: "Discover",
    badge: "Star Gate",
    action: "Drift beyond the crater",
    note: "The deeper world of homelab, experiments, and signals.",
    desktopClass: "xl:absolute xl:left-1/2 xl:top-[8%] xl:w-[24rem] xl:-translate-x-1/2 xl:z-20",
    art: (
      <div className="paper-gate-art">
        <div className="paper-gate-ring" />
        <div className="paper-gate-core" />
        <div className="paper-gate-star paper-gate-star-1" />
        <div className="paper-gate-star paper-gate-star-2" />
        <div className="paper-gate-star paper-gate-star-3" />
      </div>
    ),
  },
  {
    title: "Products",
    badge: "Dig Site",
    action: "Uncover the moon relics",
    note: "Public tools, launches, and useful things hidden underground.",
    desktopClass: "xl:absolute xl:right-[5%] xl:top-[44%] xl:w-[20rem]",
    art: (
      <div className="paper-relic-art">
        <div className="paper-crater-mouth" />
        <div className="paper-relic-gem" />
        <div className="paper-relic-ray paper-relic-ray-1" />
        <div className="paper-relic-ray paper-relic-ray-2" />
        <div className="paper-relic-ray paper-relic-ray-3" />
      </div>
    ),
  },
];

export function GatewayScene() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="papercraft-scene relative min-h-[calc(100vh-6rem)] overflow-hidden rounded-[2.8rem] border border-[#ebdcc3]/30 px-4 py-4 md:px-6 md:py-6 xl:min-h-[58rem] xl:px-8 xl:py-8">
      <div className="paper-sky absolute inset-0" />
      <div className="paper-stars absolute inset-0" />
      <div className="paper-cloud paper-cloud-left absolute left-[6%] top-[12%] h-20 w-36" />
      <div className="paper-cloud paper-cloud-right absolute right-[10%] top-[18%] h-16 w-32" />
      <div className="paper-planet absolute right-[6%] top-[8%] h-28 w-28 md:h-40 md:w-40" />

      <div className="paper-string paper-string-1 absolute left-[18%] top-0 hidden h-28 w-px xl:block" />
      <div className="paper-string paper-string-2 absolute left-1/2 top-0 hidden h-36 w-px xl:block" />
      <div className="paper-string paper-string-3 absolute right-[22%] top-0 hidden h-24 w-px xl:block" />

      <div className="paper-star paper-star-left absolute left-[16%] top-[14%] hidden h-10 w-10 xl:block" />
      <div className="paper-star paper-star-center absolute left-1/2 top-[16%] hidden h-12 w-12 -translate-x-1/2 xl:block" />
      <div className="paper-star paper-star-right absolute right-[20%] top-[12%] hidden h-9 w-9 xl:block" />

      <div className="paper-hill paper-hill-back absolute inset-x-0 bottom-[19%] h-[24rem]" />
      <div className="paper-hill paper-hill-mid absolute inset-x-[-6%] bottom-[8%] h-[20rem]" />
      <div className="paper-hill paper-hill-front absolute inset-x-[-10%] bottom-[-2%] h-[17rem]" />
      <div className="paper-ground absolute inset-x-0 bottom-0 h-[22%]" />
      <div className="paper-crater paper-crater-left absolute bottom-[10%] left-[8%] h-20 w-28 md:h-24 md:w-36" />
      <div className="paper-crater paper-crater-right absolute bottom-[9%] right-[10%] h-24 w-32 md:h-28 md:w-40" />

      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] flex-col justify-between xl:min-h-[52rem]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="paper-note max-w-md rounded-[1.7rem] px-5 py-5 md:px-6"
          >
            <p className="paper-note-kicker">{siteContent.home.eyebrow}</p>
            <h1 className="mt-3 font-[var(--font-display)] text-5xl font-semibold leading-[0.92] tracking-[-0.08em] text-[#1d1a16] sm:text-6xl md:text-7xl">
              {siteContent.home.heading}
            </h1>
            <p className="mt-4 text-base leading-8 text-[#3d352b]/78 md:text-lg">{siteContent.home.description}</p>
            <p className="mt-5 text-sm leading-7 text-[#5a4f42]/74">{siteContent.home.note}</p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.78, delay: 0.1 }}
            className="paper-patch rounded-[1.6rem] px-5 py-4 md:px-6"
          >
            <p className="paper-patch-kicker">Mission Patch</p>
            <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold tracking-[-0.05em] text-[#1d1a16] md:text-3xl">
              Moon Gateway 01
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {siteContent.home.signals.map((signal) => (
                <div key={signal.label} className="paper-chip rounded-[1rem] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#5d5346]/68">{signal.label}</p>
                  <p className="mt-1.5 text-sm text-[#2e271f]">{signal.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative mt-8 flex-1 xl:mt-0 xl:min-h-[35rem]">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: [0, -4, 0] }}
            transition={reducedMotion ? undefined : { opacity: { duration: 0.8, delay: 0.16 }, y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" } }}
            className="paper-astronaut absolute bottom-[12%] left-1/2 z-20 hidden -translate-x-1/2 xl:block"
          >
            <div className="paper-astronaut-shadow" />
            <div className="paper-astronaut-pack" />
            <div className="paper-astronaut-arm paper-astronaut-arm-left" />
            <div className="paper-astronaut-arm paper-astronaut-arm-right" />
            <div className="paper-astronaut-leg paper-astronaut-leg-left" />
            <div className="paper-astronaut-leg paper-astronaut-leg-right" />
            <div className="paper-astronaut-body" />
            <div className="paper-astronaut-head" />
            <div className="paper-astronaut-visor" />
          </motion.div>

          <div className="grid gap-4 xl:block">
            {routes.map((route, index) => {
              const panel = siteContent.gatewayPanels.find((item) => item.title === route.title);
              if (!panel) return null;

              return (
                <motion.div
                  key={route.title}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 24, scale: 0.96 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  transition={reducedMotion ? undefined : { duration: 0.78, delay: 0.24 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={route.desktopClass}
                >
                  <Link
                    href={panel.href}
                    target={panel.kind === "external" ? "_blank" : undefined}
                    rel={panel.kind === "external" ? "noreferrer" : undefined}
                    className="paper-route block"
                  >
                    <div className="paper-route-art-wrapper">{route.art}</div>
                    <div className="paper-route-label rounded-[1.4rem] px-4 py-4 md:px-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-[#6c5f50]/72">{route.badge}</p>
                          <h2 className="mt-1.5 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#1e1a16] md:text-4xl">
                            {route.title}
                          </h2>
                        </div>
                        <span className="paper-route-arrow">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-[#31281d]">{route.action}</p>
                      <p className="mt-2 text-sm leading-7 text-[#5d5141]/78">{route.note}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={reducedMotion ? undefined : { duration: 0.72, delay: 0.56 }}
          className="mt-8 grid gap-3 md:grid-cols-3"
        >
          {siteContent.home.metrics.map((metric) => (
            <div key={metric.label} className="paper-stamp rounded-[1.2rem] px-4 py-4 md:px-5">
              <p className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.05em] text-[#1d1a16]">{metric.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#625545]/70">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
