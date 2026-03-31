"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { spaceGateways, type SpaceGateway } from "@/content/space-gateway-content";
import { SpaceBackgroundAstronaut } from "@/components/canvas/SpaceBackgroundAstronaut";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { PlanetSphereClient } from "@/components/gateway/PlanetSphereClient";
import { MatrixRainCanvas } from "@/components/gateway/MatrixRainCanvas";
import { AuroraCanvas } from "@/components/gateway/AuroraCanvas";
import { FengShuiLeavesCanvas } from "@/components/gateway/FengShuiLeavesCanvas";
import {
  gatewaySceneConfig,
  createAnchorStyle,
  createFrameStyle,
  createGapStyle,
  createPlanetStageStyle,
  createSquareStyle,
} from "@/components/gateway/gatewaySceneConfig";
import { Canvas } from "@react-three/fiber";

export function SpaceGatewayHome() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const activeIndex = useMemo(
    () => spaceGateways.findIndex((item) => item.id === selected),
    [selected],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (item: SpaceGateway) => {
    if (selected) return;
    setSelected(item.id);
    const delay = reducedMotion ? 120 : 1800;
    timeoutRef.current = window.setTimeout(() => {
      router.push(item.href);
    }, delay);
  };

  return (
    <section className="space-gateway-shell relative w-full h-screen overflow-hidden text-white">
      {/* Base background layers */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('/bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_top,rgba(77,150,255,0.10),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(176,87,255,0.08),transparent_24%),linear-gradient(180deg,rgba(3,7,17,0.45)_0%,rgba(7,16,28,0.45)_100%)]" />
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <StarsBackgroundClient absolute gateway />
      </div>

      {/* Container that zooms IN when a portal is selected */}
      <motion.div
        animate={{
          scale: selected ? 3.5 : 1,
          x: selected ? (activeIndex === 0 ? "40vw" : activeIndex === 2 ? "-40vw" : "0vw") : "0vw",
          y: selected ? "30vh" : "0vh",
        }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full z-[3]"
      >
        {/* Nebula / ambient layers */}
        <div className="space-nebula space-nebula-left" />
        <div className="space-nebula space-nebula-right" />
        <div className="space-grid-haze" />
        <div className="space-horizon" />

        {/* Ambient glow on hover */}
        <AnimatePresence>
          {hoveredPortal && !selected && (
            <motion.div
              key="nebula"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen bg-gradient-to-t ${
                spaceGateways.find((g) => g.id === hoveredPortal)?.colorTheme
              }`}
            />
          )}
        </AnimatePresence>

        {/* Vignette */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] pointer-events-none opacity-80" />

        {/* The 3 Tall Portals */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8 pb-32 md:pb-16 px-6">
          <div
            className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl origin-center"
            style={{
              ...createGapStyle(gatewaySceneConfig.row.gapMobileRem, gatewaySceneConfig.row.gapDesktopRem),
              height: `clamp(${gatewaySceneConfig.row.heightMobileRem}rem, ${gatewaySceneConfig.row.heightViewport}vh, ${gatewaySceneConfig.row.heightDesktopRem}rem)`,
              transform: `scale(${gatewaySceneConfig.row.scale})`,
            }}
          >
            {spaceGateways.map((gateway, i) => {
              const isHovered = hoveredPortal === gateway.id;
              const isSelected = selected === gateway.id;
              const planetScene = gatewaySceneConfig.planets[gateway.id];

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
                    isHovered || isSelected ? gateway.borderColor : 'border-white/25'
                  }`}
                  style={{
                    ...createFrameStyle(gatewaySceneConfig.frame),
                    boxShadow: isHovered || isSelected ? `0 0 80px -10px ${gateway.glowColor}` : '0 0 0px transparent',
                    zIndex: 50,
                  }}
                >
                  {/* Matrix rain background — tech only, rendered before planet so planet floats on top */}
                  {gateway.id === 'tech' && <MatrixRainCanvas />}

                  {/* Aurora background — discover only */}
                  {gateway.id === 'discover' && <AuroraCanvas />}

                  {/* Silver wind + falling leaves — fengshui */}
                  {gateway.id === 'fengshui' && (
                    <>
                      <AuroraCanvas theme="silver" windConfig={gatewaySceneConfig.effects.fengshuiWind} />
                      <FengShuiLeavesCanvas config={gatewaySceneConfig.effects.fengshuiLeaves} />
                    </>
                  )}

                  {/* 3D Planet */}
                  <div className="pointer-events-none" style={createPlanetStageStyle(gatewaySceneConfig.planetStage)}>
                    <div style={createAnchorStyle(planetScene.anchor)}>
                      <motion.div
                        animate={{
                          y: isHovered || isSelected ? -planetScene.hoverLiftPx : 0,
                          scale: isHovered || isSelected ? 1.05 : 1,
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                          ...createSquareStyle(planetScene.size),
                          filter: `drop-shadow(0 0 ${isHovered || isSelected ? '48px' : '24px'} ${gateway.glowColor})`,
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

                  {/* HUD panels removed — Matrix rain is enough */}

                  {/* Text at bottom */}
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

                  {/* Internal window glow on hover */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${gateway.colorTheme} pointer-events-none ${isHovered || isSelected ? 'opacity-30' : 'opacity-0'}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Foreground Astronaut */}
      <div className="absolute inset-0 z-[60] pointer-events-none">
        <Canvas
          style={{ pointerEvents: "none" }}
          camera={{ position: gatewaySceneConfig.astronautCamera.position, fov: gatewaySceneConfig.astronautCamera.fov }}
          dpr={[1, 2]}
        >
          <SpaceBackgroundAstronaut isWarping={!!selected} targetIndex={activeIndex} />
        </Canvas>
      </div>

      {/* Flash Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="absolute inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </section>
  );
}
