import type { CSSProperties } from "react";
import type { WindConfig } from "@/components/gateway/AuroraCanvas";
import type { LeavesConfig } from "@/components/gateway/FengShuiLeavesCanvas";
import type { PlanetTextures } from "@/components/gateway/PlanetSphere";

export type GatewayHomeId = "tech" | "discover" | "fengshui";
export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";

export interface ResponsiveSize {
  mobileRem: number;
  viewport: number;
  desktopRem: number;
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
  | { kind: "aurora"; theme?: "aurora" | "silver"; windConfig?: WindConfig }
  | { kind: "leaves"; config?: LeavesConfig };

export interface GatewayHomePortal {
  id: GatewayHomeId;
  label: string;
  href: string;
  description: string;
  theme: {
    hoverGradientClass: string;
    glowColor: string;
    borderColorClass: string;
  };
  planet: PlanetTextures & GatewayPlanetLayout;
  effects: GatewayHomeEffect[];
}

interface PlanetStageConfig {
  topPercent: number;
  heightPercent: number;
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
        count: 1500,
        radius: 1.2,
        size: 0.003,
        color: "#915EFF",
        rotationX: 15,
        rotationY: 20,
      },
    },
  },
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
    gapMobileRem: 1.2,
    gapDesktopRem: 2.4,
    heightMobileRem: 24,
    heightViewport: 66,
    heightDesktopRem: 50,
  },
  frame: {
    width: { mobileRem: 13.5, viewport: 20.5, desktopRem: 24.5 },
    height: { mobileRem: 24, viewport: 66, desktopRem: 50 },
    radiusRem: 1.4,
  },
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
      width: 0.33,
      height: 0.5,
    },
    placement: {
      x: 0,
      y: -1,
      z: 1,
      scale: 4,
    },
    idle: {
      enabled: true,
      floatAmplitudeY: 0.04,
      floatSpeed: 0.5,
      poseBobAmplitudeY: 0.018,
      poseBobSpeed: 0.8,
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
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 10.75, viewport: 17.5, desktopRem: 20 }),
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
          intensity: 0.6,
          color: "#ffffff",
          hoverIntensity: 1.4,
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
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 11, viewport: 18, desktopRem: 20.5 }),
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
          intensity: 0.6,
          color: "#ffffff",
          hoverIntensity: 1.4,
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
      },
      planet: {
        ...makePortalPlanetLayout({ mobileRem: 10.75, viewport: 17.5, desktopRem: 20 }),
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
        rotationSpeed: 0.06,
        cloudSpeed: 0.28,
        bloom: {
          position: [0, 2.5, 3],
          intensity: 1.8,
          color: "#d0e8ff",
          hoverIntensity: 2.6,
        },
      },
      effects: [
        {
          kind: "aurora",
          theme: "silver",
          windConfig: {
            density: 8,
            speed: 0.45,
            thickness: 0.78,
          },
        },
        {
          kind: "leaves",
          config: {
            count: 38,
            sizeMin: 4,
            sizeMax: 12,
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
