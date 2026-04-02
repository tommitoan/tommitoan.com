import type { CSSProperties } from "react";
import type { WindBandPalette, WindConfig } from "@/components/gateway/AuroraCanvas";
import type { PlanetTextures } from "@/components/gateway/PlanetSphere";

export type GatewayHomeId = "tech" | "discover" | "fengshui";
export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";

export interface ResponsiveSize {
  mobileRem: number;
  viewport: number;
  desktopRem: number;
}

export interface GatewayStarTwinkleConfig {
  enabled: boolean;
  fraction?: number;
  speedMin?: number;
  speedMax?: number;
  amplitudeMin?: number;
  amplitudeMax?: number;
}

export interface GatewayStarLayerConfig {
  id: string;
  count: number;
  sizeMin: number;
  sizeMax: number;
  opacityMin: number;
  opacityMax: number;
  palette: string[];
  rotationX: number;
  rotationY: number;
  haloScale?: number;
  haloOpacity?: number;
  parallaxStrength?: number;
  twinkle: GatewayStarTwinkleConfig;
}

export interface GatewayStarPerformanceConfig {
  maxDpr: number;
  mobileScale: number;
  reducedMotionDisableTwinkle: boolean;
}

export interface GatewayStarDistributionConfig {
  diagonalBias: number;
  diagonalWidth: number;
  diagonalOffset: number;
  secondaryDiagonalBias: number;
  secondaryDiagonalWidth: number;
  secondaryDiagonalOffset: number;
}

export interface GatewayStarsConfig {
  radius: number;
  layers: GatewayStarLayerConfig[];
  performance: GatewayStarPerformanceConfig;
  distribution: GatewayStarDistributionConfig;
}

export interface GatewayDebugConfig {
  showFrames: boolean;
  showPlanets: boolean;
  showAstronaut: boolean;
  showLabels: boolean;
  showPortalEffects: boolean;
}

export interface GatewayLoaderConfig {
  dashDensity: number;
  scaleSize: number;
  color: string;
  glowStrength: number;
}

export interface GatewayPlanetAnchor {
  horizontal: HorizontalAlign;
  vertical: VerticalAlign;
  offsetXPercent: number;
  offsetYPercent: number;
}

export interface GatewayPlanetLayout {
  size: ResponsiveSize;
  anchor: GatewayPlanetAnchor;
  hoverLiftPx: number;
  frameHeightScale?: number;
}

export type GatewayHomeEffect =
  | { kind: "matrixRain" }
  | { kind: "aurora"; theme?: "aurora" | "silver"; windConfig?: WindConfig };

export interface GatewayHomePortal {
  id: GatewayHomeId;
  label: string;
  href: string;
  description: string;
  theme: {
    hoverGradientClass: string;
    glowColor: string;
    borderColorClass: string;
    frameBg: string;
  };
  planet: PlanetTextures & GatewayPlanetLayout;
  effects: GatewayHomeEffect[];
}

interface PlanetStageConfig {
  topPercent: number;
  heightPercent: number;
}

interface HoverBackdropConfig {
  insetXPercent: number;
  topPercent: number;
  heightPercent: number;
  blurPx: number;
  opacity: number;
  radiusRem: number;
}

function makePortalPlanetLayout(size: ResponsiveSize): GatewayPlanetLayout {
  return {
    size,
    anchor: {
      horizontal: "center",
      vertical: "center",
      offsetXPercent: 0,
      offsetYPercent: 0,
    },
    hoverLiftPx: 18,
    frameHeightScale: 1,
  };
}

const FENG_SHUI_WIND_PALETTE: WindBandPalette[] = [
  { hue: 104, saturation: 58, alpha: 0.52, thickness: 10, lightness: 70 },
  { hue: 112, saturation: 66, alpha: 0.58, thickness: 8, lightness: 76 },
  { hue: 118, saturation: 74, alpha: 0.62, thickness: 9, lightness: 80 },
  { hue: 124, saturation: 68, alpha: 0.48, thickness: 7, lightness: 74 },
  { hue: 132, saturation: 72, alpha: 0.64, thickness: 8, lightness: 82 },
  { hue: 138, saturation: 64, alpha: 0.44, thickness: 6, lightness: 72 },
  { hue: 144, saturation: 70, alpha: 0.60, thickness: 8, lightness: 78 },
  { hue: 150, saturation: 62, alpha: 0.54, thickness: 7, lightness: 75 },
  { hue: 156, saturation: 68, alpha: 0.58, thickness: 8, lightness: 81 },
  { hue: 162, saturation: 56, alpha: 0.42, thickness: 6, lightness: 73 },
  { hue: 126, saturation: 80, alpha: 0.66, thickness: 9, lightness: 84 },
  { hue: 146, saturation: 76, alpha: 0.50, thickness: 7, lightness: 79 },
];

export const gatewayHomeConfig = {
  spaceTheme: {
    background: {
      imageSrc: "/gateway/backgrounds/space-bg.png",
      overlayImage:
        "radial-gradient(circle_at_top,rgba(77,150,255,0.10),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(176,87,255,0.08),transparent_24%),linear-gradient(180deg,rgba(3,7,17,0.45)_0%,rgba(7,16,28,0.45)_100%)",
      vignetteImage: "radial-gradient(ellipse_at_center,transparent_0%,#000_100%)",
    },
    stars: {
      content: {
        count: 150,
        radius: 1.2,
        size: 0.004,
        color: "#c8a8ff",
        rotationX: 5,
        rotationY: 10,
      },
      gateway: {
        radius: 2.2,
        layers: [
          {
            id: "far",
            count: 32000,
            sizeMin: 0.0016,
            sizeMax: 0.003,
            opacityMin: 0.24,
            opacityMax: 0.52,
            palette: ["#f8fbff", "#dce8ff", "#bed1ff", "#d8c3ff", "#ffd9c6"],
            rotationX: 24,
            rotationY: 42,
            twinkle: {
              enabled: true,
              fraction: 0.12,
              speedMin: 0.11,
              speedMax: 0.24,
              amplitudeMin: 0.04,
              amplitudeMax: 0.1,
            },
          },
          {
            id: "mid",
            count: 11000,
            sizeMin: 0.003,
            sizeMax: 0.0052,
            opacityMin: 0.45,
            opacityMax: 0.95,
            palette: ["#ffffff", "#dce8ff", "#bed1ff", "#d8c3ff", "#ffcfad", "#ffdff4"],
            rotationX: 16,
            rotationY: 28,
            twinkle: {
              enabled: true,
              fraction: 0.34,
              speedMin: 0.16,
              speedMax: 0.4,
              amplitudeMin: 0.12,
              amplitudeMax: 0.28,
            },
          },
          {
            id: "accent",
            count: 400,
            sizeMin: 0.006,
            sizeMax: 0.0105,
            opacityMin: 0.78,
            opacityMax: 1,
            palette: ["#ffffff", "#e7f0ff", "#d8c3ff", "#ffd6b8", "#ffc98c"],
            rotationX: 14,
            rotationY: 24,
            parallaxStrength: 0.018,
            twinkle: {
              enabled: true,
              fraction: 0.72,
              speedMin: 0.12,
              speedMax: 0.28,
              amplitudeMin: 0.16,
              amplitudeMax: 0.34,
            },
          },
          {
            id: "hero",
            count: 70,
            sizeMin: 0.0105,
            sizeMax: 0.016,
            opacityMin: 0.84,
            opacityMax: 1,
            palette: ["#ffffff", "#eef5ff", "#ddd0ff", "#ffd6b8", "#ffbe78"],
            rotationX: 12,
            rotationY: 20,
            haloScale: 3.8,
            haloOpacity: 0.28,
            parallaxStrength: 0.032,
            twinkle: {
              enabled: true,
              fraction: 1,
              speedMin: 0.08,
              speedMax: 0.22,
              amplitudeMin: 0.22,
              amplitudeMax: 0.46,
            },
          },
        ],
        performance: {
          maxDpr: 1.5,
          mobileScale: 0.45,
          reducedMotionDisableTwinkle: true,
        },
        distribution: {
          diagonalBias: 0.28,
          diagonalWidth: 0.24,
          diagonalOffset: 0.04,
          secondaryDiagonalBias: 0.12,
          secondaryDiagonalWidth: 0.34,
          secondaryDiagonalOffset: -0.18,
        },
      } satisfies GatewayStarsConfig,
    },
  },
  debug: {
    showFrames: true,
    showPlanets: true,
    showAstronaut: true,
    showLabels: true,
    showPortalEffects: true,
  } satisfies GatewayDebugConfig,
  loader: {
    dashDensity: 72,
    scaleSize: 1,
    color: "#67e8f9",
    glowStrength: 4.8,
  } satisfies GatewayLoaderConfig,
  transitions: {
    routeDelayMs: 1800,
    reducedMotionRouteDelayMs: 120,
    zoomDurationSeconds: 1.4,
    zoomScale: 3.5,
    zoomOffsetXByPortal: {
      tech: "40vw",
      discover: "0vw",
      fengshui: "-40vw",
    } satisfies Record<GatewayHomeId, string>,
    zoomOffsetY: "30vh",
    flashDelaySeconds: 1.4,
    flashDurationSeconds: 0.4,
  },
  row: {
    scale: 1,
    offsetYPx: -70,
    gapMobileRem: 2,
    gapDesktopRem: 4,
    heightMobileRem: 24,
    heightViewport: 66,
    heightDesktopRem: 50,
  },
  frame: {
    width: { mobileRem: 10.5, viewport: 15.5, desktopRem: 20.5 },
    height: { mobileRem: 24, viewport: 66, desktopRem: 50 },
    radiusRem: 1.4,
    borderWidthPx: 1,
    glow: {
      restOuterBlurPx: 18,
      restOuterSpreadPx: 0,
      restOuterOpacity: 0.35,
      restMidBlurPx: 6,
      restMidOpacity: 0.45,
      restTightBlurPx: 2,
      restTightSpreadPx: 0,
      restInsetBlurPx: 10,
      restInsetOpacity: 0.08,
      hoverOuterBlurPx: 38,
      hoverOuterSpreadPx: 4,
      hoverOuterOpacity: 0.65,
      hoverMidBlurPx: 14,
      hoverMidOpacity: 0.75,
      hoverTightBlurPx: 3,
      hoverTightSpreadPx: 0,
      hoverInsetBlurPx: 22,
      hoverInsetOpacity: 0.14,
    },
  },
  hover: {
    selectedBrightness: 1.06,
    selectedContrast: 1.02,
    planetScale: 1.01,
    planetGlowBlurPx: 24,
    planetGlowRestBlurPx: 16,
    overlayOpacity: 0.06,
  },
  hoverBackdrop: {
    insetXPercent: 18,
    topPercent: 34,
    heightPercent: 42,
    blurPx: 72,
    opacity: 0.26,
    radiusRem: 999,
  } satisfies HoverBackdropConfig,
  planetStage: {
    topPercent: 5,
    heightPercent: 75,
  } satisfies PlanetStageConfig,
  astronaut: {
    assetSrc: "/gateway/characters/astronaut.png",
    camera: {
      position: [0, 0, 5] as [number, number, number],
      fov: 50,
    },
    sprite: {
      width: 0.35,
      height: 0.5,
    },
    placement: {
      x: 0,
      y: -1.6,
      z: 1,
      scale: 4,
    },
    idle: {
      enabled: true,
      floatAmplitudeY: 0.03,
      floatSpeed: 1.5,
      poseBobAmplitudeY: 0.018,
      poseBobSpeed: 1.8,
      poseTiltAmplitudeZ: 0.018,
      poseTiltSpeedZ: 0.5,
      poseTiltAmplitudeX: 0.018,
      poseTiltSpeedX: 0.4,
    },
    warp: {
      progressDamping: 4,
      targetOffsetX: 2.5,
      endY: 1.5,
      endZ: -2,
      endScale: 0.1,
      spinSpeedZ: 15,
      spinSpeedX: 10,
    },
  },
  portals: [
    {
      id: "tech",
      label: "Tech",
      href: "/tech",
      description: "Dive into software, engineering, and digital tools.",
      theme: {
        hoverGradientClass: "from-green-600/40 to-cyan-500/0",
        glowColor: "rgba(38, 211, 80, 0.6)",
        borderColorClass: "border-green-500/50",
        frameBg: "radial-gradient(ellipse at 50% 55%, rgba(0,255,136,0.09) 0%, rgba(0,50,25,0.55) 45%, rgba(0,0,0,0.88) 100%)",
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
        diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
        normal: "/gateway/textures/planets/earth-normal.jpg",
        specular: "/gateway/textures/planets/earth-specular.jpg",
        clouds: "/gateway/textures/planets/earth-clouds.png",
        lights: "/gateway/textures/planets/earth-lights.png",
        colorTint: "#55ff88",
        atmosphereColor: "#20b033",
        ambientIntensity: 4.4,
        rotationOffset: 1.8,
        axialTilt: 0.5,
        rotationSpeed: 0.4,
        cloudSpeed: 0.5,
        bloom: {
          position: [0, 2.5, 3],
          intensity: 1.2,
          color: "#ffffff",
          hoverIntensity: 2.2,
        },
        techOverlay: {
          circuitColor: "#00ff88",
          circuitOpacity: 0.65,
        },
      },
      effects: [{ kind: "matrixRain" }],
    },
    {
      id: "discover",
      label: "Discover",
      href: "/discover",
      description: "Explore our curated collections and discoveries.",
      theme: {
        hoverGradientClass: "from-fuchsia-600/40 to-purple-600/0",
        glowColor: "rgba(192, 38, 211, 0.6)",
        borderColorClass: "border-fuchsia-500/50",
        frameBg: "radial-gradient(ellipse at 50% 45%, rgba(192,38,211,0.10) 0%, rgba(50,0,70,0.58) 45%, rgba(0,0,0,0.88) 100%)",
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
        diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
        normal: "/gateway/textures/planets/earth-normal.jpg",
        specular: "/gateway/textures/planets/earth-specular.jpg",
        clouds: "/gateway/textures/planets/earth-clouds.png",
        colorTint: "#dd88ff",
        atmosphereColor: "#9933dd",
        ambientIntensity: 4.4,
        rotationOffset: 1.8,
        axialTilt: 0.5,
        rotationSpeed: 0.4,
        cloudSpeed: 0.5,
        bloom: {
          position: [0, 2.5, 3],
          intensity: 1.2,
          color: "#ffffff",
          hoverIntensity: 2.2,
        },
      },
      effects: [{ kind: "aurora" }],
    },
    {
      id: "fengshui",
      label: "Feng Shui",
      href: "/fengshui",
      description: "Balance energy and explore spatial harmony.",
      theme: {
        hoverGradientClass: "from-slate-100/20 to-white/0",
        glowColor: "rgba(205, 220, 255, 0.92)",
        borderColorClass: "border-white/40",
        frameBg: "radial-gradient(ellipse at 50% 50%, rgba(205,220,255,0.07) 0%, rgba(20,30,45,0.52) 45%, rgba(0,0,0,0.85) 100%)",
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 7.75, viewport: 14.5, desktopRem: 16 }),
        diffuse: "/gateway/textures/planets/earth-atmosphere.jpg",
        normal: "/gateway/textures/planets/earth-normal.jpg",
        specular: "/gateway/textures/planets/earth-specular.jpg",
        clouds: "/gateway/textures/planets/earth-clouds-hires.jpg",
        crystalBall: true,
        colorTint: "#c8ddf4",
        atmosphereColor: "#b8ccee",
        ambientIntensity: 0.5,
        rotationOffset: 1.8,
        axialTilt: 0.5,
        rotationSpeed: 0.4,
        cloudSpeed: 0.5,
        bloom: {
          position: [0, 2.5, 3],
          intensity: 2.2,
          color: "#d0e8ff",
          hoverIntensity: 3.2,
        },
      },
      effects: [
        {
          kind: "aurora",
          windConfig: {
            density: 12,
            speed: 0.42,
            thickness: 0.52,
            palette: FENG_SHUI_WIND_PALETTE,
          },
        },
      ],
    },
  ] satisfies GatewayHomePortal[],
} as const;

export const spaceThemeBackgroundStyle: CSSProperties = {
  backgroundImage: `url('${gatewayHomeConfig.spaceTheme.background.imageSrc}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export const spaceThemeOverlayStyle: CSSProperties = {
  backgroundImage: gatewayHomeConfig.spaceTheme.background.overlayImage,
};

export const gatewayHomeVignetteStyle: CSSProperties = {
  backgroundImage: gatewayHomeConfig.spaceTheme.background.vignetteImage,
};

export function createClampSize(size: ResponsiveSize, axis: "vw" | "vh" = "vw") {
  return `clamp(${size.mobileRem}rem, ${size.viewport}${axis}, ${size.desktopRem}rem)`;
}

export function createSquareStyle(size: ResponsiveSize): CSSProperties {
  const clamped = createClampSize(size, "vw");
  return {
    width: clamped,
    height: clamped,
  };
}

export function createFrameStyle(size: {
  width: ResponsiveSize;
  height: ResponsiveSize;
  radiusRem: number;
}): CSSProperties {
  return {
    width: createClampSize(size.width, "vw"),
    height: createClampSize(size.height, "vh"),
    borderRadius: `${size.radiusRem}rem`,
  };
}

export function createGapStyle(gapMobileRem: number, gapDesktopRem: number): CSSProperties {
  return {
    gap: `clamp(${gapMobileRem}rem, 3vw, ${gapDesktopRem}rem)`,
  };
}

export function createAnchorStyle(anchor: GatewayPlanetAnchor): CSSProperties {
  const left = anchor.horizontal === "left" ? "0%" : anchor.horizontal === "center" ? "50%" : "100%";
  const top = anchor.vertical === "top" ? "0%" : anchor.vertical === "center" ? "50%" : "100%";
  const translateX = anchor.horizontal === "left" ? "0%" : anchor.horizontal === "center" ? "-50%" : "-100%";
  const translateY = anchor.vertical === "top" ? "0%" : anchor.vertical === "center" ? "-50%" : "-100%";

  return {
    position: "absolute",
    left: `calc(${left} + ${anchor.offsetXPercent}%)`,
    top: `calc(${top} + ${anchor.offsetYPercent}%)`,
    transform: `translate(${translateX}, ${translateY})`,
  };
}

export function createPlanetStageStyle(stage: PlanetStageConfig): CSSProperties {
  return {
    position: "absolute",
    left: 0,
    width: "100%",
    top: `${stage.topPercent}%`,
    height: `${stage.heightPercent}%`,
  };
}

export function createHoverBackdropStyle(stage: HoverBackdropConfig): CSSProperties {
  return {
    position: "absolute",
    left: `${stage.insetXPercent}%`,
    width: `${100 - stage.insetXPercent * 2}%`,
    top: `${stage.topPercent}%`,
    height: `${stage.heightPercent}%`,
    filter: `blur(${stage.blurPx}px)`,
    borderRadius: `${stage.radiusRem}rem`,
    opacity: stage.opacity,
  };
}
