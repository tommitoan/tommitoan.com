"use client";

import { motion } from "framer-motion";

const C = "#55ff88";

function CircuitA() {
  return (
    <svg width="104" height="62" viewBox="0 0 104 62" fill="none">
      <path d="M4 31 H22 V11 H62 V31 H82" stroke={C} strokeWidth="1.2" opacity="0.75" />
      <path d="M22 11 V51 H42" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <path d="M62 31 V51 H82" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <path d="M82 31 V19 H100" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <circle cx="22" cy="31" r="2" fill={C} opacity="0.85" />
      <circle cx="62" cy="31" r="2" fill={C} opacity="0.85" />
      <circle cx="22" cy="11" r="1.5" fill={C} opacity="0.6" />
      <circle cx="82" cy="51" r="1.5" fill={C} opacity="0.6" />
      <circle cx="100" cy="19" r="1.5" fill={C} opacity="0.6" />
      <rect x="34" y="17" width="28" height="19" stroke={C} strokeWidth="1" opacity="0.65" rx="1" />
      <line x1="39" y1="17" x2="39" y2="13" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="45" y1="17" x2="45" y2="13" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="51" y1="17" x2="51" y2="13" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="57" y1="17" x2="57" y2="13" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="39" y1="36" x2="39" y2="40" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="45" y1="36" x2="45" y2="40" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="51" y1="36" x2="51" y2="40" stroke={C} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function CircuitB() {
  return (
    <svg width="70" height="86" viewBox="0 0 70 86" fill="none">
      <path d="M35 4 V22 H11 V58 H35 V66" stroke={C} strokeWidth="1.2" opacity="0.75" />
      <path d="M35 22 H59 V42 H35" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <path d="M11 38 H3 V70 H19 V78" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <path d="M35 42 H55 V66" stroke={C} strokeWidth="0.8" opacity="0.45" />
      <circle cx="35" cy="22" r="2" fill={C} opacity="0.85" />
      <circle cx="35" cy="42" r="2" fill={C} opacity="0.85" />
      <circle cx="11" cy="38" r="1.5" fill={C} opacity="0.6" />
      <circle cx="55" cy="66" r="1.5" fill={C} opacity="0.6" />
      <rect x="19" y="28" width="32" height="20" stroke={C} strokeWidth="1" opacity="0.65" rx="1" />
      <line x1="24" y1="28" x2="24" y2="24" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="30" y1="28" x2="30" y2="24" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="36" y1="28" x2="36" y2="24" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="42" y1="28" x2="42" y2="24" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="24" y1="48" x2="24" y2="52" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="30" y1="48" x2="30" y2="52" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <line x1="42" y1="48" x2="42" y2="52" stroke={C} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

const panelBase = {
  borderRadius: "3px",
  background: "rgba(0, 10, 5, 0.52)",
  backdropFilter: "blur(4px)",
} as const;

const mono: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "8.5px",
  color: C,
  lineHeight: 1.65,
  padding: "2px 2px 0",
};

export function TechHudPanels({ isHovered }: { isHovered: boolean }) {
  const opacity = isHovered ? 0.68 : 0.30;
  const border = `1px solid ${C}48`;
  const glow = isHovered ? `0 0 14px 0 ${C}28` : "none";

  return (
    <>
      {/* Panel A — lower-left: circuit schematic */}
      <motion.div
        className="absolute bottom-28 left-3 p-2 pointer-events-none z-[5]"
        style={{
          ...panelBase,
          border,
          boxShadow: glow,
          opacity,
          transition: "opacity 0.7s ease, box-shadow 0.7s ease",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.3, ease: "easeInOut" }}
      >
        <CircuitA />
        <div style={mono}>
          <div>SYS.CORE  ████░ 94%</div>
          <div>NET  2.4ms  ▲ STABLE</div>
        </div>
      </motion.div>

      {/* Panel B — lower-right: vertical circuit */}
      <motion.div
        className="absolute bottom-24 right-3 p-2 pointer-events-none z-[5]"
        style={{
          ...panelBase,
          border,
          boxShadow: glow,
          opacity,
          transition: "opacity 0.7s ease, box-shadow 0.7s ease",
        }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5.1, ease: "easeInOut", delay: 1.1 }}
      >
        <CircuitB />
        <div style={mono}>
          <div>MEM  ██░░ 48%</div>
          <div>UPTIME  99.97%</div>
        </div>
      </motion.div>

      {/* Panel C — upper-left: coordinate readout */}
      <motion.div
        className="absolute top-[13%] left-3 px-2 py-1.5 pointer-events-none z-[5]"
        style={{
          ...panelBase,
          border,
          boxShadow: glow,
          opacity,
          transition: "opacity 0.7s ease, box-shadow 0.7s ease",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.5 }}
      >
        <div style={{ fontFamily: "monospace", fontSize: "8.5px", color: C, lineHeight: 1.7 }}>
          <div>◈ TECH.NEXUS v4.2</div>
          <div>51.50°N  00.12°W</div>
          <div style={{ color: "#aaffcc" }}>● ONLINE</div>
        </div>
      </motion.div>
    </>
  );
}
