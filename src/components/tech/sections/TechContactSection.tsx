"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/tech/Reveal";
import { portfolio } from "@/content/portfolio";

const LINK_META: Record<string, { icon: string; accent: string; accentBg: string; accentBorder: string; accentText: string }> = {
  Email: {
    icon: "✉",
    accent: "from-violet-500/20 to-blue-500/20",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-400",
  },
  GitHub: {
    icon: "⌥",
    accent: "from-slate-500/20 to-slate-400/10",
    accentBg: "bg-white/8",
    accentBorder: "border-white/20",
    accentText: "text-slate-300",
  },
  LinkedIn: {
    icon: "in",
    accent: "from-blue-500/20 to-cyan-400/20",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-400/30",
    accentText: "text-blue-400",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export function TechContactSection() {
  return (
    <section id="contact" className="cv-section-shell">
      <Reveal>
        <div className="cv-panel-strong relative overflow-hidden rounded-[2.25rem] px-6 py-12 md:px-12 md:py-16">

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem]">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/12 blur-3xl" />
            <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="text-center">
              <span className="cv-eyebrow">Get in touch</span>
              <h2 className="cv-section-title mt-3">
                Let&apos;s build something{" "}
                <span className="cv-gradient-text-primary">reliable</span>
              </h2>
              <p className="cv-section-copy mt-5">
                Based in Ho Chi Minh City. Open to backend engineering roles, interesting problems,
                and conversations about Go, cloud infrastructure, or distributed systems.
              </p>
            </div>

            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {portfolio.contact.links.map((link) => {
                const meta = LINK_META[link.label] ?? LINK_META.Email;
                const isExternal = link.href.startsWith("http");

                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border ${meta.accentBorder} bg-gradient-to-br ${meta.accent} p-5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(145,94,255,0.18)]`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border ${meta.accentBorder} ${meta.accentBg} text-sm font-bold ${meta.accentText}`}
                      >
                        {meta.icon}
                      </span>
                      <span className="cv-soft-caption">{link.label}</span>
                    </div>

                    <p className="mt-4 break-all text-sm font-semibold leading-snug text-white md:text-base">
                      {link.value}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5">
                      <span className={`text-xs font-medium ${meta.accentText} transition-transform duration-200 group-hover:translate-x-1`}>
                        {link.href.startsWith("mailto") ? "Send email" : "Open profile"} →
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-violet-500 via-blue-400 to-cyan-400 transition-transform duration-300 group-hover:scale-x-100" />
                  </motion.a>
                );
              })}
            </motion.div>

            <Reveal delay={0.4}>
              <p className="mt-8 text-center text-sm text-slate-500">
                Usually respond within 24 hours · HCMC, Vietnam (UTC+7)
              </p>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
