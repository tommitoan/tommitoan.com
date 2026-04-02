"use client";

import { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  y?: number;
}>;

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? undefined : { opacity: 0, y }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
