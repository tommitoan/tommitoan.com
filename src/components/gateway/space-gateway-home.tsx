"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SpaceBackgroundAstronaut } from "@/components/canvas/SpaceBackgroundAstronaut";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { PlanetSphereClient } from "@/components/gateway/PlanetSphereClient";
import { GatewayLoadingScreen } from "@/components/gateway/GatewayLoadingScreen";
import { MatrixRainCanvas } from "@/components/gateway/MatrixRainCanvas";
import { AuroraCanvas } from "@/components/gateway/AuroraCanvas";
import {
  createAnchorStyle,
  createFrameStyle,
  createGapStyle,
  createHoverBackdropStyle,
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

function buildFrameGlow(
  glowColor: string,
  isActive: boolean,
  cfg: typeof gatewayHomeConfig.frame.glow,
): string {
  const c = glowColor;
  const alpha = (base: number) => c.replace(/[\d.]+\)$/, `${base})`);

  if (isActive) {
    return [
      `0 0 ${cfg.hoverOuterBlurPx}px ${cfg.hoverOuterSpreadPx}px ${alpha(cfg.hoverOuterOpacity)}`,
      `0 0 ${cfg.hoverMidBlurPx}px 0px ${alpha(cfg.hoverMidOpacity)}`,
      `0 0 ${cfg.hoverTightBlurPx}px ${cfg.hoverTightSpreadPx}px ${alpha(0.7)}`,
      `inset 0 0 ${cfg.hoverInsetBlurPx}px ${alpha(cfg.hoverInsetOpacity)}`,
    ].join(', ');
  }

  return [
    `0 0 ${cfg.restOuterBlurPx}px ${cfg.restOuterSpreadPx}px ${alpha(cfg.restOuterOpacity)}`,
    `0 0 ${cfg.restMidBlurPx}px 0px ${alpha(cfg.restMidOpacity)}`,
    `0 0 ${cfg.restTightBlurPx}px ${cfg.restTightSpreadPx}px ${alpha(0.6)}`,
    `inset 0 0 ${cfg.restInsetBlurPx}px ${alpha(cfg.restInsetOpacity)}`,
  ].join(', ');
}

function buildPlanetGlow(
  glowColor: string,
  isActive: boolean,
  cfg: typeof gatewayHomeConfig.hover,
): string {
  const alpha = (base: number) => glowColor.replace(/[\d.]+\)$/, `${base})`);
  const tight = isActive ? cfg.planetGlowBlurPx : cfg.planetGlowRestBlurPx;
  const mid   = tight * 3.2;
  const wide  = tight * 6.5;

  return [
    `drop-shadow(0 0 ${tight}px ${alpha(0.95)})`,
    `drop-shadow(0 0 ${mid}px ${alpha(0.42)})`,
    `drop-shadow(0 0 ${wide}px ${alpha(0.18)})`,
  ].join(' ');
}

export function SpaceGatewayHome() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [hoveredPortal, setHoveredPortal] = useState<GatewayHomeId | null>(null);
  const [selected, setSelected] = useState<GatewayHomeId | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isGatewayReady, setIsGatewayReady] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isLoaderFinishing, setIsLoaderFinishing] = useState(false);
  const [readyPlanets, setReadyPlanets] = useState<Record<GatewayHomeId, boolean>>({
    tech: false,
    discover: false,
    fengshui: false,
  });
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

  useEffect(() => {
    let cancelled = false;

    const assetUrls = new Set<string>([
      gatewayHomeConfig.spaceTheme.background.imageSrc,
      gatewayHomeConfig.astronaut.assetSrc,
    ]);

    for (const portal of gatewayHomeConfig.portals) {
      assetUrls.add(portal.planet.diffuse);
      if (portal.planet.normal) assetUrls.add(portal.planet.normal);
      if (portal.planet.specular) assetUrls.add(portal.planet.specular);
      if (portal.planet.clouds) assetUrls.add(portal.planet.clouds);
      if ("lights" in portal.planet && portal.planet.lights) assetUrls.add(portal.planet.lights);
    }

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const tasks: Array<Promise<void>> = [
      import("@/components/gateway/PlanetSphere").then(() => undefined),
      import("@/components/tech/StarsBackground").then(() => undefined),
      Promise.all(Array.from(assetUrls).map(preloadImage)).then(() => undefined),
    ];

    Promise.all(tasks).then(() => {
      if (cancelled) return;
      setAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const totalPlanets = gatewayHomeConfig.portals.length;
    const loadedPlanets = Object.values(readyPlanets).filter(Boolean).length;
    if (loadedPlanets === totalPlanets && assetsReady && loadingProgress >= 100) {
      setIsLoaderFinishing(true);
      const timeout = window.setTimeout(() => {
        setIsGatewayReady(true);
      }, 350);
      return () => window.clearTimeout(timeout);
    }
  }, [readyPlanets, assetsReady, loadingProgress]);

  useEffect(() => {
    if (isGatewayReady || loadingProgress >= 100) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingProgress((current) => {
        const totalPlanets = gatewayHomeConfig.portals.length;
        const loadedPlanets = Object.values(readyPlanets).filter(Boolean).length;
        const systemReady = assetsReady && loadedPlanets === totalPlanets;

        if (current >= 100) {
          return 100;
        }

        if (!systemReady) {
          return Math.min(current + 1, 99);
        }

        return Math.min(current + 4, 100);
      });
    }, 16);

    return () => window.clearInterval(interval);
  }, [readyPlanets, assetsReady, loadingProgress, isGatewayReady]);

  const handlePlanetReady = (portalId: GatewayHomeId) => {
    setReadyPlanets((current) => {
      if (current[portalId]) {
        return current;
      }
      return {
        ...current,
        [portalId]: true,
      };
    });
  };

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
  const debug = gatewayHomeConfig.debug;

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
        {debug.showPortalEffects ? <div className="space-nebula space-nebula-left" /> : null}
        {debug.showPortalEffects ? <div className="space-nebula space-nebula-right" /> : null}
        {debug.showPortalEffects ? <div className="space-grid-haze" /> : null}

        <AnimatePresence>
          {hoveredPortal && !selected && (
            <motion.div
              key="nebula"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className={`absolute z-0 pointer-events-none mix-blend-screen bg-gradient-to-t ${
                gatewayHomeConfig.portals.find((g) => g.id === hoveredPortal)?.theme.hoverGradientClass
              }`}
              style={createHoverBackdropStyle(gatewayHomeConfig.hoverBackdrop)}
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
              transform: `translateY(${gatewayHomeConfig.row.offsetYPx}px) scale(${gatewayHomeConfig.row.scale})`,
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
                    filter: selected && isSelected
                      ? `brightness(${gatewayHomeConfig.hover.selectedBrightness}) contrast(${gatewayHomeConfig.hover.selectedContrast})`
                      : "brightness(1) contrast(1)",
                  }}
                  transition={{ duration: 0.8, delay: selected ? 0 : 0.2 + i * 0.15 }}
                  onHoverStart={() => !selected && setHoveredPortal(gateway.id)}
                  onHoverEnd={() => !selected && setHoveredPortal(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(gateway);
                  }}
                  className={`group relative overflow-hidden ${selected ? 'cursor-default pointer-events-none' : 'cursor-pointer'} flex flex-col items-center transition-all duration-500`}
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
                    ...(debug.showFrames ? {
                      borderWidth: `${gatewayHomeConfig.frame.borderWidthPx}px`,
                      borderStyle: 'solid',
                      borderColor: gateway.theme.glowColor,
                      boxShadow: buildFrameGlow(gateway.theme.glowColor, isHovered || isSelected, gatewayHomeConfig.frame.glow),
                      backgroundImage: gateway.theme.frameBg,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    } : {}),
                    zIndex: 50,
                  }}
                >
                  {debug.showPortalEffects ? gateway.effects.map((effect, effectIndex) => (
                    <GatewayEffectLayer key={`${gateway.id}-${effect.kind}-${effectIndex}`} effect={effect} />
                  )) : null}

                  {debug.showPlanets ? (
                    <div className="pointer-events-none" style={createPlanetStageStyle(gatewayHomeConfig.planetStage)}>
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{
                          scale: [1.28, 1.42, 1.28],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 4.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${gateway.theme.glowColor.replace(/[\d.]+\)$/, '0.28)')} 0%, ${gateway.theme.glowColor.replace(/[\d.]+\)$/, '0.12)')} 32%, transparent 64%)`,
                          filter: 'blur(6px)',
                          opacity: isHovered || isSelected ? 1 : 0.75,
                          transformOrigin: 'center center',
                        }}
                      />
                      <div style={createAnchorStyle(gateway.planet.anchor)}>
                        <motion.div
                          animate={{
                            y: isHovered || isSelected ? -gateway.planet.hoverLiftPx : 0,
                            scale: isHovered || isSelected ? gatewayHomeConfig.hover.planetScale : 1,
                          }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          style={{
                            ...createSquareStyle(gateway.planet.size),
                            filter: buildPlanetGlow(gateway.theme.glowColor, isHovered || isSelected, gatewayHomeConfig.hover),
                            transition: 'filter 0.7s ease',
                          }}
                        >
                          <PlanetSphereClient
                            {...gateway.planet}
                            isHovered={isHovered || isSelected}
                            onReady={() => handlePlanetReady(gateway.id)}
                          />
                        </motion.div>
                      </div>
                    </div>
                  ) : null}

                  {debug.showLabels ? (
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
                  ) : null}

                  {debug.showPortalEffects ? (
                    <div
                      className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${gateway.theme.hoverGradientClass} pointer-events-none ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
                      style={{ opacity: isHovered || isSelected ? gatewayHomeConfig.hover.overlayOpacity : 0 }}
                    />
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {debug.showAstronaut ? (
        <div className="absolute inset-0 z-[60] pointer-events-none">
          <Canvas
            style={{ pointerEvents: "none" }}
            camera={{ position: gatewayHomeConfig.astronaut.camera.position, fov: gatewayHomeConfig.astronaut.camera.fov }}
            dpr={[1, 2]}
          >
            <SpaceBackgroundAstronaut isWarping={!!selected} targetIndex={activeIndex} />
          </Canvas>
        </div>
      ) : null}

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

      <GatewayLoadingScreen
        loadingProgress={loadingProgress}
        isVisible={!isGatewayReady}
        isFinishing={isLoaderFinishing}
      />
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

  return null;
}
