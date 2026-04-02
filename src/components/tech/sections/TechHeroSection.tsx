"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/tech/Reveal";
import { heroShowcaseConfig } from "@/components/tech/hero-showcase/config";
import { portfolio } from "@/content/portfolio";

const HeroLabelOrbitScene = dynamic(
  () => import("@/components/tech/HeroLabelOrbitScene").then((m) => m.HeroLabelOrbitScene),
  { ssr: false }
);

export function TechHeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="cv-section-shell relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-16 hidden h-[32rem] w-[32rem] rounded-full bg-violet-500/6 blur-3xl lg:block" />
      </div>

      <div className="grid min-h-[calc(100vh-9rem)] gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <Reveal className="relative pl-8 md:pl-14">
          <div className="absolute left-0 top-6 h-[18rem] w-px bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent md:left-4" />
          <div className="absolute left-[-7px] top-0 h-4 w-4 rounded-full bg-violet-500 md:left-0" style={{ boxShadow: "0 0 20px rgba(145,94,255,0.5)" }} />

          <span className="cv-eyebrow">{portfolio.hero.eyebrow}</span>
          <motion.h1
            initial={reducedMotion ? undefined : { opacity: 0, x: -32 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.8, delay: 0.08 }}
            className="mt-4 max-w-4xl text-6xl font-extrabold leading-[0.98] tracking-[-0.06em] text-white sm:text-7xl md:text-[6.35rem]"
          >
            <span className="block">{portfolio.hero.lead}</span>
            <span className="block pb-[0.08em] cv-accent-text">{portfolio.hero.name}</span>
          </motion.h1>

          <motion.p
            initial={reducedMotion ? undefined : { opacity: 0, x: -32 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.82, delay: 0.18 }}
            className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-slate-200 md:text-[2rem]"
          >
            Building <span className="cv-gradient-text-purple-pink">Scalable Systems</span> with{" "}
            <span className="cv-gradient-text-blue-purple">Precision & Passion</span>
          </motion.p>

          <motion.p
            initial={reducedMotion ? undefined : { opacity: 0, x: -32 }}
            animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.84, delay: 0.28 }}
            className="mt-5 max-w-2xl text-lg leading-8 text-slate-300"
          >
            {portfolio.hero.description}
          </motion.p>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.8, delay: 0.38 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {portfolio.hero.highlights.map((highlight) => (
              <span key={highlight} className="cv-pill-gradient">
                {highlight}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reducedMotion ? undefined : { duration: 0.82, delay: 0.48 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            {portfolio.hero.ctas.map((cta) => {
              const isExternal = cta.href.startsWith("http") || cta.href.endsWith(".pdf");
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className={cta.variant === "primary" ? "cv-gradient-button" : "cv-ghost-button"}
                >
                  {cta.label}
                </a>
              );
            })}
          </motion.div>
        </Reveal>

        <Reveal className="hidden lg:block lg:pl-4" delay={0.14}>
          <div
            className="relative mx-auto"
            style={{ maxWidth: `${heroShowcaseConfig.layout.frameMaxWidthRem}rem` }}
          >
            <HeroLabelOrbitScene />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
