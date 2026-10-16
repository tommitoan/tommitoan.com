"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SpaceBackgroundAstronaut } from "@/components/canvas/SpaceBackgroundAstronaut";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { PlanetSphereClient } from "@/components/gateway/PlanetSphereClient";
import { GatewayLoadingScreen } from "@/components/gateway/GatewayLoadingScreen";
import { MatrixRainCanvas } from "@/components/gateway/MatrixRainCanvas";
import { AuroraCanvas } from "@/components/gateway/AuroraCanvas";
import { AstronautSpeech } from "@/components/gateway/AstronautSpeech";
import { completedWork } from "@/components/gateway/gatewayLoader";
import { GatewayLanguageToggle } from "@/components/gateway/GatewayLanguageToggle";
import { GatewayPortalInfo } from "@/components/gateway/GatewayPortalInfo";
import { GATEWAY_UI, portalCopy, portalTitle } from "@/components/gateway/gatewayCopy";
import { hasSeenGateway, markGatewaySeen, subscribeNever } from "@/components/gateway/gatewaySession";
import { useSiteLanguage } from "@/lib/site-language";
import { astronautSide, canGuide, expandedWidth, globeOpacity, hoverExpandFactor, squeezeFactor, windowWidth } from "@/components/gateway/gatewayHover";
import { markWarpArrival } from "@/components/gateway/warpArrival";
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

function subscribeToResize(onChange: () => void): () => void {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

function readViewportWidth(): number {
  return window.innerWidth;
}

export function SpaceGatewayHome() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  // English is the first render; a stored choice applies after hydration, and without one the browser's language and time zone decide.
  const language = useSiteLanguage("en");
  const ui = GATEWAY_UI[language];
  const [hoveredPortal, setHoveredPortal] = useState<GatewayHomeId | null>(null);
  const [selected, setSelected] = useState<GatewayHomeId | null>(null);
  const [isGatewayReady, setIsGatewayReady] = useState(false);
  // A visitor coming back from another route skips the ring (the server and the first render say "not seen", so they agree).
  const returning = useSyncExternalStore(subscribeNever, hasSeenGateway, () => false);
  const pageReady = isGatewayReady || returning;
  const [assetsReady, setAssetsReady] = useState(false);
  const [astronautReady, setAstronautReady] = useState(false);
  // The planets start one after another, so the first frames of the loader are not lost to all three starting at once.
  const [planetsStarted, setPlanetsStarted] = useState(0);
  // A part that never gets ready (no WebGL, a failed download) must not keep the loader on screen for good.
  const [gaveUp, setGaveUp] = useState(false);
  const [readyPlanets, setReadyPlanets] = useState<Record<GatewayHomeId, boolean>>({
    tech: false,
    discover: false,
    fengshui: false,
  });
  const timeoutRef = useRef<number | null>(null);
  // The window width, so the hover guide switches on and off as the window is resized.
  const viewportWidth = useSyncExternalStore(subscribeToResize, readViewportWidth, () => 0);

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

    // Only what the first screen needs gates the loader: the sky and the astronaut. Planet textures and the
    // Tech frame image load afterwards, so the gateway opens before the planets are ready.
    const assetUrls = new Set<string>([
      gatewayHomeConfig.spaceTheme.background.imageSrc,
      gatewayHomeConfig.astronaut.assetSrc,
    ]);

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const tasks: Array<Promise<void>> = [
      import("@/components/tech/StarsBackground").then(() => undefined),
      Promise.all(Array.from(assetUrls).map(preloadImage)).then(() => undefined),
    ];

    // A chunk that fails to load must not keep the loader on screen for good: the page opens either way.
    Promise.all(tasks)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        setAssetsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Start the planets one after another once the first screen's pictures are in.
  useEffect(() => {
    if (!assetsReady) return;
    const timers = [0, 1, 2].map((index) => window.setTimeout(() => setPlanetsStarted(index + 1), index * 260));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [assetsReady]);

  useEffect(() => {
    const timer = window.setTimeout(() => setGaveUp(true), 12000);
    return () => window.clearTimeout(timer);
  }, []);

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

  // The hovered window grows where it stands, so the pointer is always still inside it; the others are pushed aside.
  const enterPortal = (id: GatewayHomeId) => {
    if (!selected) setHoveredPortal(id);
  };

  const leavePortal = (id: GatewayHomeId) => {
    // Moving from one window to the next can report the new one before the old one ends; only the old one clears itself.
    if (!selected) setHoveredPortal((current) => (current === id ? null : current));
  };

  const handleSelect = (item: GatewayHomePortal) => {
    if (selected) return;
    setSelected(item.id);
    // The Feng Shui world opens with its seal on a fresh page load only; a warp has just done the opening.
    markWarpArrival(item.href);
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
  // The loader fills as the parts of the page are really ready, and finishes only when the visitor can see all of it.
  const completed = gaveUp
    ? 100
    : completedWork({
        assets: assetsReady,
        astronaut: astronautReady || !debug.showAstronaut,
        planets: debug.showPlanets ? Object.values(readyPlanets).filter(Boolean).length : 3,
      });
  const guide = canGuide(viewportWidth, !!reducedMotion);
  // The hovered window grows enough for its text, and the other two share what is left of the row.
  const expandFactor = hoverExpandFactor(viewportWidth);
  const hoveredSlot = hoveredPortal ? gatewayHomeConfig.portals.findIndex((item) => item.id === hoveredPortal) : null;
  // The astronaut introduces the portal under the pointer, when there is room and motion for it.
  const talking = !!hoveredPortal && !selected && guide;
  const hoveredInfo = hoveredPortal ? gatewayHomeConfig.portals.find((item) => item.id === hoveredPortal) ?? null : null;
  const hoveredCopy = hoveredInfo ? portalCopy(hoveredInfo.id, language) : null;

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

              const frameSizeStyle = createFrameStyle({
                width: gatewayHomeConfig.frame.width,
                height: {
                  mobileRem: gatewayHomeConfig.frame.height.mobileRem * (gateway.planet.frameHeightScale ?? 1),
                  viewport: gatewayHomeConfig.frame.height.viewport * (gateway.planet.frameHeightScale ?? 1),
                  desktopRem: gatewayHomeConfig.frame.height.desktopRem * (gateway.planet.frameHeightScale ?? 1),
                },
                radiusRem: gatewayHomeConfig.frame.radiusRem,
              });

              const expanded = guide && isHovered && !selected;
              // While one window is under the pointer the other two give way, so the row keeps its width.
              const squeezed = guide && !selected && hoveredSlot !== null && !isHovered;

              return (
                <div
                  key={gateway.id}
                  // This window is what takes the hover and the click. It widens where it stands, so the pointer stays inside it.
                  onPointerEnter={(event) => event.pointerType === "mouse" && enterPortal(gateway.id)}
                  onPointerLeave={(event) => event.pointerType === "mouse" && leavePortal(gateway.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(gateway);
                  }}
                  className={`relative shrink-0 ${selected ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
                  style={{
                    ...frameSizeStyle,
                    width: guide && !selected ? windowWidth(String(frameSizeStyle.width), i, hoveredSlot, expandFactor) : frameSizeStyle.width,
                    transition: `width ${gatewayHomeConfig.hover.expandSeconds}s cubic-bezier(0.22, 1, 0.36, 1)`,
                    zIndex: isHovered ? 51 : 50,
                  }}
                >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: selected && !isSelected ? 0 : globeOpacity(i, hoveredSlot, gatewayHomeConfig.hover.dimOpacity),
                    y: 0,
                    filter: selected && isSelected
                      ? `brightness(${gatewayHomeConfig.hover.selectedBrightness}) contrast(${gatewayHomeConfig.hover.selectedContrast})`
                      : "brightness(1) contrast(1)",
                  }}
                  transition={{
                    duration: 0.8,
                    delay: selected || pageReady ? 0 : 0.2 + i * 0.15,
                    opacity: { duration: 0.45 },
                  }}
                  className="group pointer-events-none relative h-full w-full overflow-hidden flex flex-col items-center transition-[box-shadow] duration-500"
                  style={{
                    borderRadius: frameSizeStyle.borderRadius,
                    ...(debug.showFrames ? {
                      borderWidth: `${gatewayHomeConfig.frame.borderWidthPx}px`,
                      borderStyle: 'solid',
                      borderColor: gateway.theme.glowColor,
                      boxShadow: buildFrameGlow(gateway.theme.glowColor, isHovered || isSelected, gatewayHomeConfig.frame.glow),
                      backgroundImage: gateway.theme.frameImageSrc
                        ? `${gateway.theme.frameBg}, url('${gateway.theme.frameImageSrc}')`
                        : gateway.theme.frameBg,
                      backgroundSize: gateway.theme.frameImageSrc ? 'auto, cover' : 'auto',
                      backgroundPosition: gateway.theme.frameImageSrc ? 'auto, center' : 'auto',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    } : {}),
                  }}
                >
                  {debug.showPortalEffects ? gateway.effects.map((effect, effectIndex) => (
                    <GatewayEffectLayer key={`${gateway.id}-${effect.kind}-${effectIndex}`} effect={effect} />
                  )) : null}

                  {debug.showPlanets && assetsReady && planetsStarted > i ? (
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
                      <div style={{ ...createAnchorStyle(gateway.planet.anchor), opacity: readyPlanets[gateway.id] ? 1 : 0, transition: 'opacity 0.9s ease' }}>
                        <motion.div
                          animate={{
                            y: isHovered || isSelected ? -gateway.planet.hoverLiftPx : 0,
                            scale: expanded ? gatewayHomeConfig.hover.expandedPlanetScale : squeezed ? Math.min(gatewayHomeConfig.hover.squeezedPlanetScale, squeezeFactor(expandFactor)) : isHovered || isSelected ? gatewayHomeConfig.hover.planetScale : 1,
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
                    <GatewayPortalInfo
                      label={portalTitle(gateway.id, language)}
                      copy={portalCopy(gateway.id, language)}
                      enterText={ui.enter}
                      accent={gateway.theme.glowColor}
                      active={isHovered && !selected}
                      expanded={expanded}
                      expandedWidthCss={expandedWidth(String(frameSizeStyle.width), expandFactor)}
                    />
                  ) : null}

                  {debug.showPortalEffects ? (
                    <div
                      className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${gateway.theme.hoverGradientClass} pointer-events-none ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
                      style={{ opacity: isHovered || isSelected ? gatewayHomeConfig.hover.overlayOpacity : 0 }}
                    />
                  ) : null}
                </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {debug.showAstronaut ? (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60 }}>
          <Canvas
            style={{ pointerEvents: "none" }}
            camera={{ position: gatewayHomeConfig.astronaut.camera.position, fov: gatewayHomeConfig.astronaut.camera.fov }}
            dpr={[1, 2]}
          >
            <SpaceBackgroundAstronaut isWarping={!!selected} targetIndex={activeIndex} talkSide={talking ? astronautSide() : null} onReady={() => setAstronautReady(true)} />
          </Canvas>
        </div>
      ) : null}

      <AstronautSpeech portal={talking && hoveredInfo && hoveredCopy ? { label: portalTitle(hoveredInfo.id, language), speech: hoveredCopy.speech } : null} side={astronautSide()} />

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

      <GatewayLanguageToggle language={language} />

      <GatewayLoadingScreen
        completed={completed}
        isVisible={!pageReady}
        onDone={() => {
          markGatewaySeen();
          setIsGatewayReady(true);
        }}
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
