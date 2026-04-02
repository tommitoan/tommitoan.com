"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import { Color } from "three";
import type { Points as ThreePoints } from "three";
import {
  gatewayHomeConfig,
  type GatewayStarDistributionConfig,
  type GatewayStarsConfig,
} from "@/components/gateway/gatewayHomeConfig";
import { useReducedMotion } from "framer-motion";

type ContentStarsConfig = (typeof gatewayHomeConfig.spaceTheme.stars)["content"];

interface GatewayCanvasStar {
  x: number;
  y: number;
  depth: number;
  radius: number;
  opacity: number;
  colorRgb: string;
  glowScale: number;
  twinkleSpeed: number;
  twinkleAmplitude: number;
  twinklePhase: number;
  driftStrength: number;
  flare: boolean;
}

interface GatewayCanvasLayer {
  id: string;
  rotationSpeed: number;
  stars: GatewayCanvasStar[];
}

interface PreRenderedLayer {
  id: string;
  rotationSpeed: number;
  driftStrength: number;
  canvas: HTMLCanvasElement;
}

const GATEWAY_RENDER_SCALE = 0.8;

function seededRandom(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function mix(min: number, max: number, value: number) {
  return min + (max - min) * value;
}

function colorHexToRgb(colorHex: string) {
  const color = new Color(colorHex);
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return `${r}, ${g}, ${b}`;
}

function buildBiasedNormalizedPoint(seedStart: number, distribution: GatewayStarDistributionConfig) {
  let seed = seedStart;
  let x = 0;
  let y = 0;

  for (let attempt = 0; attempt < 16; attempt++) {
    x = seededRandom(seed) * 2 - 1;
    y = seededRandom(seed + 1) * 2 - 1;
    seed += 2;

    const primaryCenter = -0.42 * x + distribution.diagonalOffset;
    const primaryDistance = Math.abs(y - primaryCenter);
    const primaryCloseness = Math.max(0, 1 - primaryDistance / distribution.diagonalWidth);

    const secondaryCenter = -0.22 * x + distribution.secondaryDiagonalOffset;
    const secondaryDistance = Math.abs(y - secondaryCenter);
    const secondaryCloseness = Math.max(0, 1 - secondaryDistance / distribution.secondaryDiagonalWidth);

    const bias = primaryCloseness * distribution.diagonalBias + secondaryCloseness * distribution.secondaryDiagonalBias;
    const acceptance = Math.min(1, 0.6 + bias);

    if (seededRandom(seed + attempt) <= acceptance) {
      return { x, y, seed: seed + attempt + 1 };
    }
  }

  return { x, y, seed };
}

function buildGatewayCanvasLayers(config: GatewayStarsConfig, mobileScale: number, twinkleEnabled: boolean) {
  return config.layers.map((layer, layerIndex): GatewayCanvasLayer => {
    const scaledCount = Math.max(1, Math.round(layer.count * mobileScale));
    const stars: GatewayCanvasStar[] = [];

    for (let i = 0; i < scaledCount; i++) {
      const point = buildBiasedNormalizedPoint(layerIndex * 100000 + i * 13 + 1, config.distribution);
      const seed = point.seed;
      const color = layer.palette[Math.floor(seededRandom(seed + 1) * layer.palette.length)];
      const radius = mix(layer.sizeMin, layer.sizeMax, seededRandom(seed + 2));
      const opacity = mix(layer.opacityMin, layer.opacityMax, seededRandom(seed + 3));
      const isTwinkling = twinkleEnabled && layer.twinkle.enabled && seededRandom(seed + 4) < (layer.twinkle.fraction ?? 0);

      stars.push({
        x: point.x,
        y: point.y,
        depth: mix(0.45, 1.15, seededRandom(seed + 5)),
        radius,
        opacity,
        colorRgb: colorHexToRgb(color),
        glowScale: layer.haloScale ?? mix(1.5, 2.4, seededRandom(seed + 6)),
        twinkleSpeed: isTwinkling
          ? mix(layer.twinkle.speedMin ?? 0.08, layer.twinkle.speedMax ?? 0.24, seededRandom(seed + 7))
          : 0,
        twinkleAmplitude: isTwinkling
          ? mix(layer.twinkle.amplitudeMin ?? 0.05, layer.twinkle.amplitudeMax ?? 0.18, seededRandom(seed + 8))
          : 0,
        twinklePhase: seededRandom(seed + 9) * Math.PI * 2,
        driftStrength: layer.parallaxStrength ?? 0,
        flare: radius > 0.0065 || layer.id === "hero",
      });
    }

    return {
      id: layer.id,
      rotationSpeed: 1 / Math.max(layer.rotationX, layer.rotationY),
      stars,
    };
  });
}

function useSpherePoints(count: number, radius: number): Float32Array {
  return useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let seed = i * 3 + 1;
      let x: number;
      let y: number;
      let z: number;
      do {
        x = (seededRandom(seed) - 0.5) * 2;
        y = (seededRandom(seed + 1) - 0.5) * 2;
        z = (seededRandom(seed + 2) - 0.5) * 2;
        seed += 3;
      } while (x * x + y * y + z * z > 1);
      arr[i * 3] = x * radius;
      arr[i * 3 + 1] = y * radius;
      arr[i * 3 + 2] = z * radius;
    }
    return arr;
  }, [count, radius]);
}

function ContentStarField({ config }: { config: ContentStarsConfig }) {
  const ref = useRef<ThreePoints>(null!);
  const positions = useSpherePoints(config.count, config.radius);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / config.rotationX;
    ref.current.rotation.y -= delta / config.rotationY;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={config.color} size={config.size} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

function GatewayStarsCanvas({ absolute = false, starsConfig, zIndex = 2 }: { absolute?: boolean; starsConfig: GatewayStarsConfig; zIndex?: number }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mobileScale = typeof window !== "undefined" && window.innerWidth < 768
    ? starsConfig.performance.mobileScale
    : 1;

  const layers = useMemo(
    () => buildGatewayCanvasLayers(
      starsConfig,
      mobileScale,
      !(reducedMotion && starsConfig.performance.reducedMotionDisableTwinkle),
    ),
    [mobileScale, reducedMotion, starsConfig],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1) * GATEWAY_RENDER_SCALE;
    let renderedLayers: PreRenderedLayer[] = [];
    let animatedStars: GatewayCanvasStar[] = [];

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCaches();
    };

    const drawGlowStar = (
      target: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      glowRadius: number,
      colorRgb: string,
      alpha: number,
      flare: boolean,
    ) => {
      const glow = target.createRadialGradient(x, y, 0, x, y, glowRadius);
      glow.addColorStop(0, withAlpha(colorRgb, alpha * 0.95));
      glow.addColorStop(0.18, withAlpha(colorRgb, alpha * 0.42));
      glow.addColorStop(0.48, withAlpha(colorRgb, alpha * 0.12));
      glow.addColorStop(1, withAlpha(colorRgb, 0));

      target.globalCompositeOperation = "screen";
      target.fillStyle = glow;
      target.beginPath();
      target.arc(x, y, glowRadius, 0, Math.PI * 2);
      target.fill();

      target.fillStyle = withAlpha(colorRgb, Math.min(1, alpha));
      target.beginPath();
      target.arc(x, y, radius, 0, Math.PI * 2);
      target.fill();

      if (flare) {
        target.strokeStyle = withAlpha(colorRgb, alpha * 0.28);
        target.lineWidth = Math.max(0.35, radius * 0.14);
        target.beginPath();
        target.moveTo(x - glowRadius * 0.45, y);
        target.lineTo(x + glowRadius * 0.45, y);
        target.moveTo(x, y - glowRadius * 0.45);
        target.lineTo(x, y + glowRadius * 0.45);
        target.stroke();
      }
    };

    const buildCaches = () => {
      renderedLayers = [];
      animatedStars = [];

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const layerCanvas = document.createElement("canvas");
        layerCanvas.width = Math.max(1, Math.floor(width * dpr));
        layerCanvas.height = Math.max(1, Math.floor(height * dpr));
        const layerCtx = layerCanvas.getContext("2d");
        if (!layerCtx) continue;
        layerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const staticStars: GatewayCanvasStar[] = [];
        for (let j = 0; j < layer.stars.length; j++) {
          const star = layer.stars[j];
          if (star.twinkleSpeed > 0 && (layer.id === "hero" || (layer.id === "accent" && j % 3 === 0) || (layer.id === "mid" && j % 16 === 0))) {
            animatedStars.push(star);
          } else {
            staticStars.push(star);
          }
        }

        for (let j = 0; j < staticStars.length; j++) {
          const star = staticStars[j];
          const x = ((star.x * 0.5) + 0.5) * width;
          const y = ((star.y * 0.5) + 0.5) * height;
          const radius = Math.max(0.55, star.radius * Math.min(width, height) * 0.18 * star.depth);
          const glowRadius = radius * star.glowScale * 1.08;
          drawGlowStar(layerCtx, x, y, radius, glowRadius, star.colorRgb, star.opacity, layer.id === "hero" && star.flare);
        }

        renderedLayers.push({
          id: layer.id,
          rotationSpeed: layer.rotationSpeed,
          driftStrength: staticStars[0]?.driftStrength ?? 0,
          canvas: layerCanvas,
        });
      }
    };

    const drawAnimatedStar = (star: GatewayCanvasStar, time: number, layerRotation: number) => {
      const cos = Math.cos(layerRotation);
      const sin = Math.sin(layerRotation);
      const rotatedX = star.x * cos - star.y * sin;
      const rotatedY = star.x * sin + star.y * cos;
      const driftX = Math.sin(time * (0.48 + star.driftStrength * 19.8) + star.twinklePhase) * width * star.driftStrength * 0.18;
      const driftY = Math.cos(time * (0.36 + star.driftStrength * 15.3) + star.twinklePhase * 0.8) * height * star.driftStrength * 0.12;
      const x = ((rotatedX * 0.5) + 0.5) * width + driftX;
      const y = ((rotatedY * 0.5) + 0.5) * height + driftY;

      if (x < -40 || x > width + 40 || y < -40 || y > height + 40) {
        return;
      }

      const twinkle = star.twinkleSpeed > 0
        ? 1 + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * star.twinkleAmplitude
        : 1;
      const alpha = Math.max(0.12, Math.min(1.35, star.opacity * twinkle));
      const radius = Math.max(0.6, star.radius * Math.min(width, height) * 0.22 * star.depth * (0.92 + twinkle * 0.28));
      const glowRadius = radius * star.glowScale * (1.15 + twinkle * 0.35);
      drawGlowStar(ctx, x, y, radius, glowRadius, star.colorRgb, alpha, star.flare);
    };

    const render = (timestamp: number) => {
      animationId = window.requestAnimationFrame(render);
      if (!width || !height) return;
      const time = timestamp * 0.001;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < renderedLayers.length; i++) {
        const layer = renderedLayers[i];
        const driftX = Math.sin(time * (0.36 + layer.driftStrength * 12.6) + i) * width * layer.driftStrength * 0.08;
        const driftY = Math.cos(time * (0.27 + layer.driftStrength * 10.2) + i * 0.8) * height * layer.driftStrength * 0.06;
        ctx.save();
        ctx.translate(width * 0.5 + driftX, height * 0.5 + driftY);
        ctx.rotate(time * layer.rotationSpeed * 0.08);
        ctx.drawImage(layer.canvas, -width * 0.5, -height * 0.5, width, height);
        ctx.restore();
      }

      for (let i = 0; i < animatedStars.length; i++) {
        const star = animatedStars[i];
        drawAnimatedStar(star, time, time * 0.01);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    animationId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [layers]);

  return (
    <div ref={containerRef} style={absolute ? CANVAS_ABSOLUTE_STYLE : { ...CANVAS_STYLE, zIndex }}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function withAlpha(colorRgb: string, alpha: number) {
  return `rgba(${colorRgb}, ${Math.max(0, Math.min(1, alpha))})`;
}

const CANVAS_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 2,
  pointerEvents: "none",
};

const CANVAS_ABSOLUTE_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

export function StarsBackground({ absolute = false, gateway = false, starsConfig, zIndex }: { absolute?: boolean; gateway?: boolean; starsConfig?: GatewayStarsConfig; zIndex?: number }) {
  if (gateway) {
    const resolvedConfig = starsConfig ?? gatewayHomeConfig.spaceTheme.stars.gateway;
    return <GatewayStarsCanvas absolute={absolute} starsConfig={resolvedConfig} zIndex={zIndex} />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={absolute ? CANVAS_ABSOLUTE_STYLE : CANVAS_STYLE}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "low-power" }}
    >
      <ContentStarField config={gatewayHomeConfig.spaceTheme.stars.content} />
    </Canvas>
  );
}
