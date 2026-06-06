"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/tech/Reveal";
import { SectionHeading } from "@/components/tech/SectionHeading";
import { siteContent } from "@/content/site-content";

const CHANNEL_META: Record<string, { icon: string; pillBorder: string; pillBg: string; pillText: string; pillHoverBg: string }> = {
  GitHub: {
    icon: "⌥",
    pillBorder: "border-white/20",
    pillBg: "bg-white/6",
    pillText: "text-slate-300",
    pillHoverBg: "hover:bg-white/12",
  },
  LinkedIn: {
    icon: "in",
    pillBorder: "border-blue-400/40",
    pillBg: "bg-blue-500/10",
    pillText: "text-blue-300",
    pillHoverBg: "hover:bg-blue-500/20",
  },
  Facebook: {
    icon: "f",
    pillBorder: "border-blue-500/40",
    pillBg: "bg-blue-600/10",
    pillText: "text-blue-300",
    pillHoverBg: "hover:bg-blue-600/20",
  },
  YouTube: {
    icon: "▶",
    pillBorder: "border-red-400/40",
    pillBg: "bg-red-500/10",
    pillText: "text-red-300",
    pillHoverBg: "hover:bg-red-500/20",
  },
};

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

export function DiscoverChannelsSection() {
  const { channels } = siteContent.discover;

  return (
    <section className="cv-section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Channels"
          title={
            <>
              Where to{" "}
              <span className="cv-gradient-text-primary">find me</span>
            </>
          }
          description="The channels where I share code, updates, and ideas."
        />
      </Reveal>

      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {channels.map((channel) => {
          const meta = CHANNEL_META[channel.name] ?? CHANNEL_META.GitHub;

          return (
            <motion.a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              variants={pillVariants}
              whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
              className={`group flex items-center gap-2.5 rounded-full border ${meta.pillBorder} ${meta.pillBg} ${meta.pillHoverBg} px-5 py-2.5 backdrop-blur-sm transition-colors duration-200`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${meta.pillText}`}>
                {meta.icon}
              </span>
              <span className={`text-sm font-semibold ${meta.pillText} whitespace-nowrap`}>
                {channel.name}
              </span>
              <span className={`text-xs ${meta.pillText} opacity-60`}>
                {channel.blurb}
              </span>
              <span className={`text-xs ${meta.pillText} opacity-60 transition-transform duration-200 group-hover:translate-x-0.5`}>
                →
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
