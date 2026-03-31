import type { CSSProperties } from "react";
import type { WindConfig } from "@/components/gateway/AuroraCanvas";
import type { SpaceGatewayId } from "@/content/space-gateway-content";

export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";

interface ResponsiveSize {
  mobileRem: number;
  viewport: number;
  desktopRem: number;
}

interface SceneAnchor {
  horizontal: HorizontalAlign;
  vertical: VerticalAlign;
}

interface PlanetSceneConfig {
  size: ResponsiveSize;
  anchor: SceneAnchor;
  hoverLiftPx: number;
}

interface PlanetStageConfig {
  topPercent: number;
  heightPercent: number;
}

export const gatewaySceneConfig = {
  row: {
    scale: 1, // WAS 0.7. explicitly sizing dimensions down instead
    gapMobileRem: 1.4,
    gapDesktopRem: 2.1,
    heightMobileRem: 18.2,
    heightViewport: 49,
    heightDesktopRem: 23.8,
  },
  frame: {
    width: { mobileRem: 10.5, viewport: 15.4, desktopRem: 14 },
    height: { mobileRem: 18.2, viewport: 49, desktopRem: 23.8 },
    radiusRem: 1.4,
  },
  planetStage: {
    topPercent: 0,
    heightPercent: 100,
  } satisfies PlanetStageConfig,
  planets: {
    tech: {
      size: { mobileRem: 4.34, viewport: 7, desktopRem: 5.67 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 14,
    },
    discover: {
      size: { mobileRem: 4.34, viewport: 7, desktopRem: 5.67 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 14,
    },
    fengshui: {
      size: { mobileRem: 4.55, viewport: 7.35, desktopRem: 5.95 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 14,
    },
  } satisfies Record<SpaceGatewayId, PlanetSceneConfig>,
  effects: {
    fengshuiWind: {
      density: 8,
      speed: 0.45,
      thickness: 0.78,
    } satisfies WindConfig,
    fengshuiLeaves: {
      count: 38,
      sizeMin: 4,
      sizeMax: 12,
    },
  },
  astronautCamera: {
    position: [0, 0, 5] as [number, number, number],
    fov: 50,
  },
} as const;

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
  height: { mobileRem: number; viewport: number; desktopRem: number };
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

export function createAnchorStyle(anchor: SceneAnchor): CSSProperties {
  return {
    position: "absolute",
    left: "0",
    top: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
