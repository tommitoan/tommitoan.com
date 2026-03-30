"use client";

import { motion } from "framer-motion";

export function YinYangBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "hidden" }}
    >
      {/* Centre the symbol in the upper 60% of the card so it sits behind the planet */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ paddingBottom: "20%" }}
      >
        <motion.svg
          viewBox="0 0 100 100"
          style={{ width: "75%", maxWidth: "320px", opacity: 0.22 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 88, repeat: Infinity, ease: "linear" }}
        >
          {/* Yin (dark) base */}
          <circle cx="50" cy="50" r="45" fill="rgba(4,12,4,0.90)" />

          {/* Yang (light) half — the right "fish" of the taijitu
              Outer right arc → inner lower S-curve → inner upper S-curve */}
          <path
            d="M 50 5
               A 45 45 0 0 1 50 95
               A 22.5 22.5 0 0 1 50 50
               A 22.5 22.5 0 0 0 50 5 Z"
            fill="rgba(240,255,230,0.96)"
          />

          {/* Dark dot inside yang (upper) */}
          <circle cx="50" cy="27.5" r="7.5" fill="rgba(4,12,4,0.92)" />

          {/* Light dot inside yin (lower) */}
          <circle cx="50" cy="72.5" r="7.5" fill="rgba(240,255,230,0.96)" />

          {/* Outer glow ring */}
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="rgba(136,204,102,0.55)"
            strokeWidth="1.2"
          />
          {/* Inner dividing line glow */}
          <circle
            cx="50" cy="50" r="44.5"
            fill="none"
            stroke="rgba(200,255,160,0.20)"
            strokeWidth="3"
          />
        </motion.svg>
      </div>
    </div>
  );
}
