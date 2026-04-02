"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { heroShowcaseConfig } from "./hero-showcase/config";

type LabelPlanet = {
  id: string;
  name: string;
  color: string;
  glow: string;
  orbitRadius: number;
  duration: number;
  startAngle: number;
  direction: number;
};

function useTwinkle(initialDelay: number) {
  const [shining, setShining] = useState(false);
  useEffect(() => {
    let alive = true;
    function cycle() {
      const wait = 3000 + Math.random() * 6000;
      setTimeout(() => {
        if (!alive) return;
        setShining(true);
        setTimeout(() => {
          if (!alive) return;
          setShining(false);
          cycle();
        }, 2200);
      }, wait);
    }
    const tid = setTimeout(cycle, initialDelay);
    return () => {
      alive = false;
      clearTimeout(tid);
    };
  }, [initialDelay]);
  return shining;
}

function OrbitLabel({ planet, index }: { planet: LabelPlanet; index: number }) {
  const reducedMotion = useReducedMotion();
  const initRad = (planet.startAngle * Math.PI) / 180;
  const x = useMotionValue(Math.cos(initRad) * planet.orbitRadius);
  const y = useMotionValue(Math.sin(initRad) * planet.orbitRadius);
  const shining = useTwinkle((index * 1237) % 4000);

  useEffect(() => {
    if (reducedMotion) return;

    const frames = 60;
    const mkFrames = (fn: (angle: number) => number) =>
      Array.from({ length: frames + 1 }, (_, i) => {
        const angle =
          ((planet.startAngle + planet.direction * ((360 * i) / frames)) * Math.PI) / 180;
        return fn(angle);
      });

    const ax = animate(x, mkFrames((a) => Math.cos(a) * planet.orbitRadius), {
      duration: planet.duration,
      repeat: Infinity,
      ease: "linear",
    });
    const ay = animate(y, mkFrames((a) => Math.sin(a) * planet.orbitRadius), {
      duration: planet.duration,
      repeat: Infinity,
      ease: "linear",
    });

    return () => {
      ax.stop();
      ay.stop();
    };
  }, [planet, reducedMotion, x, y]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.5 + index * 0.09,
        duration: 0.45,
        type: "spring",
        stiffness: 130,
        damping: 14,
      }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div className="group cursor-default transition-transform duration-200 ease-out hover:scale-110">
          <motion.div
            animate={{ opacity: [0.2, 0.38, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-md scale-125 pointer-events-none"
            style={{ backgroundColor: planet.color }}
          />

          <motion.div
            className="absolute -inset-3 rounded-full pointer-events-none"
            animate={
              shining
                ? { opacity: [0, 0.55, 0.45, 0], scale: [1, 1.18, 1.12, 1] }
                : { opacity: 0, scale: 1 }
            }
            transition={
              shining
                ? { duration: 2.2, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.6, ease: "easeOut" }
            }
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.85) 0%, ${planet.color}99 45%, transparent 72%)`,
              filter: "blur(6px)",
            }}
          />

          <motion.div
            animate={shining ? { borderColor: "rgba(255,255,255,0.55)" } : { borderColor: "rgba(255,255,255,0.20)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="relative px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap border backdrop-blur-sm shadow-md transition-colors duration-200 group-hover:border-white/40"
            style={{
              background: `linear-gradient(135deg, ${planet.color}cc 0%, ${planet.color}77 100%)`,
              boxShadow: `0 3px 10px ${planet.glow}55, 0 1px 0 rgba(255,255,255,0.07) inset`,
            }}
          >
            {planet.name}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroLabelOrbitScene() {
  const { orbits, core } = heroShowcaseConfig;

  const planets: LabelPlanet[] = orbits.flatMap((orbit) => {
    const dir = orbit.direction === "clockwise" ? 1 : -1;
    return orbit.nodes.map((node) => ({
      id: node.id,
      name: node.label,
      color: node.planetColor,
      glow: node.planetGlow,
      orbitRadius: orbit.radius,
      duration: orbit.duration,
      startAngle: node.startAngle,
      direction: dir,
    }));
  });

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ minHeight: `${heroShowcaseConfig.layout.stageMinHeightRem}rem` }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "28rem",
          height: "28rem",
          background:
            "radial-gradient(circle, rgba(145,94,255,0.15) 0%, rgba(59,130,246,0.09) 55%, transparent 75%)",
        }}
      />

      {orbits.map((orbit) => (
        <div
          key={orbit.id}
          className="absolute rounded-full border border-dashed pointer-events-none"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderColor: orbit.trackColor,
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          className="absolute rounded-full pointer-events-none"
          animate={{ opacity: [0.18, 0.42, 0.18], scale: [1, 1.22, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "5rem",
            height: "5rem",
            background: `radial-gradient(circle, ${core.iconGradient[0]}88 0%, ${core.iconGradient[1]}44 55%, transparent 80%)`,
            filter: "blur(10px)",
          }}
        />

        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-white text-base select-none"
          style={{
            background: `linear-gradient(135deg, ${core.iconGradient.join(", ")})`,
            boxShadow: [
              `0 0 24px 5px ${core.pulseFrom}`,
              `0 0 48px 8px ${core.pulseTo}`,
              `0 0 10px rgba(255,255,255,0.12)`,
              `inset 0 0 0 1px rgba(255,255,255,0.18)`,
            ].join(", "),
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 68%)`,
              filter: "blur(4px)",
            }}
          />
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {core.icon}
          </motion.span>
        </motion.div>
      </div>

      {planets.map((planet, index) => (
        <OrbitLabel key={planet.id} planet={planet} index={index} />
      ))}
    </div>
  );
}
