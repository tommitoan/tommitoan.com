"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SpaceBackgroundAstronaut } from "@/components/canvas/SpaceBackgroundAstronaut";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { PlanetSphereClient } from "@/components/gateway/PlanetSphereClient";
import { MatrixRainCanvas } from "@/components/gateway/MatrixRainCanvas";
import { AuroraCanvas } from "@/components/gateway/AuroraCanvas";
import { FengShuiLeavesCanvas } from "@/components/gateway/FengShuiLeavesCanvas";
import {
  createAnchorStyle,
  createFrameStyle,
  createGapStyle,
  createPlanetStageStyle,
  createSquareStyle,
  gatewayHomeConfig,
  gatewayHomeVignetteStyle,
  spaceThemeBackgroundStyle,
  spaceThemeOverlayStyle,
  type GatewayHomeEffect,
  type GatewayHomeId,
  type GatewayHomePortal,
} from "@/components/gateway/gatewayHomeConfig";
import { Canvas } from "@react-three/fiber";

export function SpaceGatewayHome() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [hoveredPortal, setHoveredPortal] = useState<GatewayHomeId | null>(null);
  const [selected, setSelected] = useState<GatewayHomeId | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const activePortal = selected
    ? gatewayHomeConfig.portals.find((item) => item.id === selected) ?? null
    : null;
  const activeIndex = activePortal
    ? gatewayHomeConfig.portals.findIndex((item) => item.id === activePortal.id)
    : -1;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (item: GatewayHomePortal) => {
    if (selected) return;
    setSelected(item.id);
    const delay = reducedMotion
      ? gatewayHomeConfig.transitions.reducedMotionRouteDelayMs
      : gatewayHomeConfig.transitions.routeDelayMs;
    timeoutRef.current = window.setTimeout(() => {
      router.push(item.href);
    }, delay);
  };

  const activePortalOffsetX = activePortal
    ? gatewayHomeConfig.transitions.zoomOffsetXByPortal[activePortal.id]
    : "0vw";

  return (
    <section className="space-gateway-shell relative w-full h-screen overflow-hidden text-white">
      <div className="absolute inset-0 z-0 pointer-events-none" style={spaceThemeBackgroundStyle} />
      <div className="absolute inset-0 z-[1] pointer-events-none" style={spaceThemeOverlayStyle} />
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <StarsBackgroundClient absolute gateway />
      </div>

      <motion.div
        animate={{
          scale: selected ? gatewayHomeConfig.transitions.zoomScale : 1,
          x: selected ? activePortalOffsetX : "0vw",
          y: selected ? gatewayHomeConfig.transitions.zoomOffsetY : "0vh",
        }}
        transition={{ duration: gatewayHomeConfig.transitions.zoomDurationSeconds, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full z-[3]"
      >
        <div className="space-nebula space-nebula-left" />
        <div className="space-nebula space-nebula-right" />
        <div className="space-grid-haze" />

        <AnimatePresence>
          {hoveredPortal && !selected && (
            <motion.div
              key="nebula"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen bg-gradient-to-t ${
                gatewayHomeConfig.portals.find((g) => g.id === hoveredPortal)?.theme.hoverGradientClass
              }`}
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={gatewayHomeVignetteStyle} />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-4 pb-4 px-4 md:px-6">
          <div
            className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl origin-center"
            style={{
              ...createGapStyle(gatewayHomeConfig.row.gapMobileRem, gatewayHomeConfig.row.gapDesktopRem),
              height: `clamp(${gatewayHomeConfig.row.heightMobileRem}rem, ${gatewayHomeConfig.row.heightViewport}vh, ${gatewayHomeConfig.row.heightDesktopRem}rem)`,
              transform: `scale(${gatewayHomeConfig.row.scale})`,
            }}
          >
            {gatewayHomeConfig.portals.map((gateway, i) => {
              const isHovered = hoveredPortal === gateway.id;
              const isSelected = selected === gateway.id;

              return (
                <motion.div
                  key={gateway.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: selected && !isSelected ? 0 : 1,
                    y: 0,
                    filter: selected && isSelected ? "brightness(1.5) contrast(1.2)" : "brightness(1) contrast(1)",
                  }}
                  transition={{ duration: 0.8, delay: selected ? 0 : 0.2 + i * 0.15 }}
                  onHoverStart={() => !selected && setHoveredPortal(gateway.id)}
                  onHoverEnd={() => !selected && setHoveredPortal(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(gateway);
                  }}
                  className={`group relative border-2 overflow-hidden ${selected ? 'cursor-default pointer-events-none' : 'cursor-pointer'} flex flex-col items-center transition-all duration-500 ${
                    isHovered || isSelected ? gateway.theme.borderColorClass : 'border-white/25'
                  }`}
                  style={{
                    ...createFrameStyle({
                      width: gatewayHomeConfig.frame.width,
                      height: {
                        mobileRem: gatewayHomeConfig.frame.height.mobileRem * (gateway.planet.frameHeightScale ?? 1),
                        viewport: gatewayHomeConfig.frame.height.viewport * (gateway.planet.frameHeightScale ?? 1),
                        desktopRem: gatewayHomeConfig.frame.height.desktopRem * (gateway.planet.frameHeightScale ?? 1),
                      },
                      radiusRem: gatewayHomeConfig.frame.radiusRem,
                    }),
                    boxShadow: isHovered || isSelected ? `0 0 80px -10px ${gateway.theme.glowColor}` : '0 0 0px transparent',
                    zIndex: 50,
                  }}
                >
                  {gateway.effects.map((effect, effectIndex) => (
                    <GatewayEffectLayer key={`${gateway.id}-${effect.kind}-${effectIndex}`} effect={effect} />
                  ))}

                  <div className="pointer-events-none" style={createPlanetStageStyle(gatewayHomeConfig.planetStage)}>
                    <div style={createAnchorStyle(gateway.planet.anchor)}>
                      <motion.div
                        animate={{
                          y: isHovered || isSelected ? -gateway.planet.hoverLiftPx : 0,
                          scale: isHovered || isSelected ? 1.05 : 1,
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                          ...createSquareStyle(gateway.planet.size),
                          filter: `drop-shadow(0 0 ${isHovered || isSelected ? '48px' : '24px'} ${gateway.theme.glowColor})`,
                          transition: 'filter 0.7s ease',
                        }}
                      >
                        <PlanetSphereClient
                          {...gateway.planet}
                          isHovered={isHovered || isSelected}
                        />
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ opacity: selected ? 0 : 1 }}
                    className="relative z-10 w-full mt-auto p-4 pb-4 md:pb-6 text-center bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-1 tracking-wider uppercase text-white/90 group-hover:text-white transition-colors drop-shadow-md">
                      {gateway.label}
                    </h2>
                    <p className="text-xs md:text-sm text-white/60 group-hover:text-white/90 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300">
                      {gateway.description}
                    </p>
                  </motion.div>

                  <div
                    className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${gateway.theme.hoverGradientClass} pointer-events-none ${isHovered || isSelected ? 'opacity-30' : 'opacity-0'}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 z-[60] pointer-events-none">
        <Canvas
          style={{ pointerEvents: "none" }}
          camera={{ position: gatewayHomeConfig.astronaut.camera.position, fov: gatewayHomeConfig.astronaut.camera.fov }}
          dpr={[1, 2]}
        >
          <SpaceBackgroundAstronaut isWarping={!!selected} targetIndex={activeIndex} />
        </Canvas>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: gatewayHomeConfig.transitions.flashDelaySeconds,
              duration: gatewayHomeConfig.transitions.flashDurationSeconds,
            }}
            className="absolute inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function GatewayEffectLayer({ effect }: { effect: GatewayHomeEffect }) {
  if (effect.kind === "matrixRain") {
    return <MatrixRainCanvas />;
  }

  if (effect.kind === "aurora") {
    return <AuroraCanvas theme={effect.theme} windConfig={effect.windConfig} />;
  }

  if (effect.kind === "leaves") {
    return <FengShuiLeavesCanvas config={effect.config} />;
  }

  return null;
}
