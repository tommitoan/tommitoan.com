"use client";

import { AnimatePresence, motion } from "framer-motion";
import { gatewayHomeConfig } from "@/components/gateway/gatewayHomeConfig";

interface GatewayLoadingScreenProps {
  loadingProgress: number;
  isVisible: boolean;
  isFinishing: boolean;
}

export function GatewayLoadingScreen({
  loadingProgress,
  isVisible,
  isFinishing,
}: GatewayLoadingScreenProps) {
  const loaderConfig = gatewayHomeConfig.loader;
  const dashCount = loaderConfig.dashDensity;
  const activeDashes = Math.round((loadingProgress / 100) * dashCount);
  const ringColor = loaderConfig.color;
  const glowBlur = loaderConfig.glowStrength;
  const scaleSize = loaderConfig.scaleSize;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="gateway-loading"
          initial={{ opacity: 1 }}
          animate={isFinishing ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-[var(--z-loading)] flex items-center justify-center bg-black"
        >
          <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
            <div
              className="pointer-events-none absolute rounded-full blur-3xl"
              style={{
                width: `${20 * scaleSize}rem`,
                height: `${20 * scaleSize}rem`,
                backgroundColor: `${ringColor}1a`,
              }}
            />

            <div className="relative flex flex-col items-center justify-center text-center">
              <div
                className="relative"
                style={{
                  width: `${18 * scaleSize}rem`,
                  height: `${18 * scaleSize}rem`,
                }}
              >
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
                  <defs>
                    <filter id="gateway-loader-glow" x="-200%" y="-200%" width="400%" height="400%">
                      <feGaussianBlur stdDeviation={glowBlur} result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {Array.from({ length: dashCount }).map((_, index) => {
                    const angle = (index / dashCount) * 360;
                    const isActive = index < activeDashes;

                    return (
                      <g key={index} transform={`rotate(${angle} 80 80)`}>
                        {isActive ? (
                          <line
                            x1="80"
                            y1="11"
                            x2="80"
                            y2="25"
                            stroke={ringColor}
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            opacity="0.9"
                            filter="url(#gateway-loader-glow)"
                          />
                        ) : null}
                        <line
                          x1="80"
                          y1="11"
                          x2="80"
                          y2="25"
                          stroke={isActive ? ringColor : "rgba(255,255,255,0.16)"}
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          opacity={isActive ? 1 : 0.82}
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="font-medium leading-none tracking-[-0.04em] text-cyan-100 [font-family:Inter,ui-sans-serif,system-ui,sans-serif]"
                    style={{
                      fontSize: `clamp(${1.4 * scaleSize}rem, ${3.5 * scaleSize}vw, ${2.2 * scaleSize}rem)`,
                      color: ringColor,
                      filter: `drop-shadow(0 0 18px ${ringColor}80)`,
                    }}
                  >
                    {loadingProgress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
