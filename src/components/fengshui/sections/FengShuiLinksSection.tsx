"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/tech/Reveal";
import { fengshuiContent } from "@/content/fengshui-content";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function FengShuiLinksSection() {
  return (
    <section className="cv-section-shell">
      <Reveal>
        <div className="cv-panel-strong relative overflow-hidden rounded-[2.25rem] px-6 py-12 md:px-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-purple-500/12 blur-3xl" />
            <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="cv-eyebrow">Get started</span>
            <h2 className="cv-section-title mt-3">
              Try{" "}
              <span className="cv-gradient-text-purple-pink">Bazica</span>
            </h2>
            <p className="cv-section-copy mt-5">
              The first product from this lane — an open-source Go library
              and live demo for Ba-zi Four Pillars calculations.
            </p>

            <motion.div
              className="mt-10 flex flex-wrap justify-center gap-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.a
                href={fengshuiContent.links.demo}
                target="_blank"
                rel="noreferrer"
                variants={pillVariants}
                whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.97 }}
                className="cv-gradient-button"
              >
                Try Live Demo →
              </motion.a>

              <motion.a
                href={fengshuiContent.links.repo}
                target="_blank"
                rel="noreferrer"
                variants={pillVariants}
                whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.97 }}
                className="cv-ghost-button"
              >
                View on GitHub →
              </motion.a>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
