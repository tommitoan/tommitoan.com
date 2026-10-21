"use client";

import { motion, type Variants } from "framer-motion";
import type { PortalCopy } from "@/components/gateway/gatewayCopy";

type Props = {
  label: string;
  copy: PortalCopy;
  enterText: string;
  /** The window's glow colour, used for the small markers. */
  accent: string;
  /** The window is under the pointer. */
  active: boolean;
  /** A phone: the three windows are narrow and there is no hover, so only the name is shown, always, at the top of the window. */
  compact?: boolean;
  /** The window has grown wide (the hover guide is on): the highlights and the enter hint are shown too. */
  expanded: boolean;
  /** The window's width when grown, as a CSS length. */
  expandedWidthCss: string;
};

const SOFT = { duration: 0.35, ease: "easeOut" } as const;

const listVariants: Variants = {
  hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8, transition: { duration: 0.15 } },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/**
 * What a window says about its route: the name and a line of description while it is under the pointer, and, when it has
 * grown wide, four highlights and the hint to click. The panel has a fixed place at the bottom of the window and its
 * content is laid out at the window's grown width and centred, so nothing reflows while the window widens: the content only
 * fades and rises, and the window's edges reveal it like a curtain.
 */
export function GatewayPortalInfo({ label, copy, enterText, accent, active, compact = false, expanded, expandedWidthCss }: Props) {
  if (compact) {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 to-transparent px-1 pb-6 pt-3 text-center">
        <h2
          className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white drop-shadow-md"
          style={{ fontFamily: "var(--font-gateway-display), var(--font-gateway-body), sans-serif" }}
        >
          {label}
        </h2>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10" style={{ height: expanded || active ? "52%" : "30%" }}>
      <motion.div
        aria-hidden="true"
        animate={{ opacity: active ? 1 : 0 }}
        transition={SOFT}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 px-8 pb-6 text-center"
        style={{ width: expanded ? expandedWidthCss : "100%", maxWidth: expanded ? "100vw" : undefined }}
      >
        <motion.h2
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
          transition={{ ...SOFT, duration: active ? 0.35 : 0.15 }}
          className="text-xl font-bold uppercase tracking-[0.18em] text-white drop-shadow-md md:text-2xl"
          style={{ fontFamily: "var(--font-gateway-display), var(--font-gateway-body), sans-serif" }}
        >
          {label}
        </motion.h2>
        <motion.p
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
          transition={{ ...SOFT, delay: active ? 0.05 : 0, duration: active ? 0.35 : 0.15 }}
          className="mx-auto mt-1 max-w-[30rem] text-[0.85rem] leading-relaxed text-white/80"
        >
          {copy.description}
        </motion.p>

        {expanded ? (
          <>
            <motion.div
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0.4 }}
              transition={{ duration: 0.45, delay: active ? 0.2 : 0 }}
              className="mx-auto mt-4 h-px w-full max-w-[30rem] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <motion.ul
              initial="hidden"
              animate={active ? "shown" : "hidden"}
              variants={listVariants}
              className="mx-auto mt-4 grid max-w-[30rem] grid-cols-2 gap-x-6 gap-y-2.5 text-left"
            >
              {copy.highlights.map((item) => (
                <motion.li key={item} variants={itemVariants} className="flex items-start gap-2 text-[0.78rem] leading-snug text-white/90">
                  <span aria-hidden="true" className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.35, delay: active ? 0.75 : 0 }}
              className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cyan-200"
              style={{ fontFamily: "var(--font-gateway-display), var(--font-gateway-body), sans-serif" }}
            >
              {enterText}
              <motion.span
                aria-hidden="true"
                className="ml-2 inline-block"
                animate={{ x: active ? [0, 5, 0] : 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.p>
          </>
        ) : null}
      </div>
    </div>
  );
}
