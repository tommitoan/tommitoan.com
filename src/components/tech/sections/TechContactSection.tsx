"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/tech/Reveal";
import { portfolio } from "@/content/portfolio";

const LINK_META: Record<string, { icon: string; label: string; pillBorder: string; pillBg: string; pillText: string; pillHoverBg: string }> = {
  Email: {
    icon: "✉",
    label: "Email me",
    pillBorder: "border-violet-500/40",
    pillBg: "bg-violet-500/10",
    pillText: "text-violet-300",
    pillHoverBg: "hover:bg-violet-500/20",
  },
  GitHub: {
    icon: "⌥",
    label: "GitHub",
    pillBorder: "border-white/20",
    pillBg: "bg-white/6",
    pillText: "text-slate-300",
    pillHoverBg: "hover:bg-white/12",
  },
  LinkedIn: {
    icon: "in",
    label: "LinkedIn",
    pillBorder: "border-blue-400/40",
    pillBg: "bg-blue-500/10",
    pillText: "text-blue-300",
    pillHoverBg: "hover:bg-blue-500/20",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const pillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
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

          <div className="relative mx-auto max-w-2xl">
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
              className="mt-10 flex flex-wrap justify-center gap-3"
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
                    variants={pillVariants}
                    whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                    whileTap={{ scale: 0.97 }}
                    className={`group flex items-center gap-2.5 rounded-full border ${meta.pillBorder} ${meta.pillBg} ${meta.pillHoverBg} px-5 py-2.5 backdrop-blur-sm transition-colors duration-200`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${meta.pillText}`}>
                      {meta.icon}
                    </span>
                    <span className={`text-sm font-semibold ${meta.pillText} whitespace-nowrap`}>
                      {meta.label}
                    </span>
                    <span className={`text-xs ${meta.pillText} opacity-60 transition-transform duration-200 group-hover:translate-x-0.5`}>
                      →
                    </span>
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
