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
  frameHeightScale?: number;
}

interface PlanetStageConfig {
  topPercent: number;
  heightPercent: number;
}

export const gatewaySceneConfig = {
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
  planets: {
    tech: {
      size: { mobileRem: 10.75, viewport: 17.5, desktopRem: 20.0 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 18,
      frameHeightScale: 1.0,
    },
    discover: {
      size: { mobileRem: 11.0, viewport: 18.0, desktopRem: 20.5 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 18,
      frameHeightScale: 1.0,
    },
    fengshui: {
      size: { mobileRem: 10.75, viewport: 17.5, desktopRem: 20.0 },
      anchor: { horizontal: "center", vertical: "center" },
      hoverLiftPx: 18,
      frameHeightScale: 1.0,
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
