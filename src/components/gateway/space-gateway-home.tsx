"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { spaceGateways, type SpaceGateway } from "@/content/space-gateway-content";
import { SpaceBackgroundAstronaut } from "@/components/canvas/SpaceBackgroundAstronaut";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
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
    if (selected) return; // Prevent double clicks
    console.log("Portal clicked:", item.id);
    setSelected(item.id);
    
    // Increased delay so user has time to see the zoom effect into the portal before redirecting
    const delay = reducedMotion ? 120 : 1800;
    timeoutRef.current = window.setTimeout(() => {
      console.log("Routing to:", item.href);
      router.push(item.href);
    }, delay);
  };

  return (
    <section className="space-gateway-shell relative w-full h-screen overflow-hidden text-white">
      {/* Base background layers (absolute, behind everything) */}
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
          scale: selected ? 3.5 : 1, // Massive zoom into the screen
          x: selected ? (activeIndex === 0 ? "40vw" : activeIndex === 2 ? "-40vw" : "0vw") : "0vw", // Pan camera to the selected portal
          y: selected ? "30vh" : "0vh", // Pan up towards the center of the portal
        }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full z-[3]"
      >
        {/* Layer 1: Backgrounds */}
        <div className="space-nebula space-nebula-left" />
        <div className="space-nebula space-nebula-right" />
        <div className="space-grid-haze" />
        <div className="space-horizon" />
        
        {/* Layer 2: Ambient glow based on hovered portal */}
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
        
        {/* Vignette to darken edges */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] pointer-events-none opacity-80" />

        {/* Layer 3: The 3 Tall Portals */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8 pb-32 md:pb-16 px-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-center w-full max-w-7xl h-[70vh]">
            {spaceGateways.map((gateway, i) => {
              const isHovered = hoveredPortal === gateway.id;
              const isSelected = selected === gateway.id;
              
              return (
                <motion.div
                  key={gateway.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: selected && !isSelected ? 0 : 1, // Fade out non-selected portals
                    y: 0,
                    filter: selected && isSelected ? "brightness(1.5) contrast(1.2)" : "brightness(1) contrast(1)" // Flash the selected portal
                  }}
                  transition={{ duration: 0.8, delay: selected ? 0 : 0.2 + i * 0.15 }}
                  onHoverStart={() => !selected && setHoveredPortal(gateway.id)}
                  onHoverEnd={() => !selected && setHoveredPortal(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(gateway);
                  }}
                  className={`group relative flex-1 w-full md:w-auto h-full border-2 rounded-[2rem] overflow-hidden ${selected ? 'cursor-default pointer-events-none' : 'cursor-pointer'} flex flex-col items-center transition-all duration-500 ${
                    isHovered || isSelected ? gateway.borderColor : 'border-white/25'
                  }`}
                  style={{
                    boxShadow: isHovered || isSelected ? `0 0 80px -10px ${gateway.glowColor}` : '0 0 0px transparent',
                    // VERY IMPORTANT: ensure z-index is high enough to receive clicks
                    zIndex: 50
                  }}
                >
                  {/* Planet container inside window */}
                  <div className="absolute inset-0 flex items-center justify-center mb-24 pointer-events-none">
                    <motion.div
                      animate={{
                        y: isHovered || isSelected ? -20 : 0,
                        scale: isHovered || isSelected ? 1.05 : 1,
                        rotate: isHovered || isSelected ? 5 : 0,
                      }}
                      transition={{ duration: 4, ease: "easeOut" }}
                      className="w-48 h-48 md:w-64 md:h-64 rounded-full relative"
                      style={{
                        background: gateway.planetGradient,
                        boxShadow: `inset -15px -15px 30px rgba(0,0,0,0.6), inset 10px 10px 30px rgba(255,255,255,0.4), 0 0 80px 20px ${isHovered || isSelected ? gateway.glowColor : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                       {/* Inner planet detail texture/clouds overlay */}
                       <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                    </motion.div>
                  </div>

                  {/* Text content at bottom of portal */}
                  <motion.div 
                    animate={{ opacity: selected ? 0 : 1 }}
                    className="relative z-10 w-full mt-auto p-8 text-center bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"
                  >
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-wider uppercase text-white/90 group-hover:text-white transition-colors drop-shadow-md">
                      {gateway.label}
                    </h2>
                    <p className="text-sm md:text-base text-white/60 group-hover:text-white/90 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 duration-300">
                      {gateway.description}
                    </p>
                  </motion.div>

                  {/* Internal window glow when hovered */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-t ${gateway.colorTheme} pointer-events-none ${isHovered || isSelected ? 'opacity-40' : 'opacity-0'}`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Layer 4: Foreground Astronaut */}
      <div className="absolute inset-0 z-[60] pointer-events-none">
        <Canvas style={{ pointerEvents: "none" }} camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
          <SpaceBackgroundAstronaut isWarping={!!selected} targetIndex={activeIndex} />
        </Canvas>
      </div>
      
      {/* Final Flash Overlay */}
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


