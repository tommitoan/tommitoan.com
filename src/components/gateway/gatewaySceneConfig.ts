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
  offsetXPercent: number;
  offsetYPercent: number;
}

interface PlanetSceneConfig {
  size: ResponsiveSize;
  anchor: SceneAnchor;
  hoverLiftPx: number;
}

export const gatewaySceneConfig = {
  row: {
    scale: 0.7,
    gapMobileRem: 2,
    gapDesktopRem: 3,
    heightMobileRem: 26,
    heightViewport: 70,
    heightDesktopRem: 34,
  },
  frame: {
    width: { mobileRem: 15, viewport: 22, desktopRem: 20 },
    height: { mobileRem: 26, viewport: 70, desktopRem: 34 },
    radiusRem: 2,
  },
  planets: {
    tech: {
      size: { mobileRem: 6.2, viewport: 10, desktopRem: 8.1 },
      anchor: { horizontal: "center", vertical: "center", offsetXPercent: 0, offsetYPercent: -8 },
      hoverLiftPx: 20,
    },
    discover: {
      size: { mobileRem: 6.2, viewport: 10, desktopRem: 8.1 },
      anchor: { horizontal: "center", vertical: "center", offsetXPercent: 0, offsetYPercent: -8 },
      hoverLiftPx: 20,
    },
    fengshui: {
      size: { mobileRem: 6.5, viewport: 10.5, desktopRem: 8.5 },
      anchor: { horizontal: "center", vertical: "center", offsetXPercent: 0, offsetYPercent: -8 },
      hoverLiftPx: 20,
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
  const left =
    anchor.horizontal === "left"
      ? `${anchor.offsetXPercent}%`
      : anchor.horizontal === "center"
        ? `calc(50% + ${anchor.offsetXPercent}%)`
        : `calc(100% + ${anchor.offsetXPercent}%)`;

  const top =
    anchor.vertical === "top"
      ? `${anchor.offsetYPercent}%`
      : anchor.vertical === "center"
        ? `calc(50% + ${anchor.offsetYPercent}%)`
        : `calc(100% + ${anchor.offsetYPercent}%)`;

  const translateX =
    anchor.horizontal === "left" ? "0" : anchor.horizontal === "center" ? "-50%" : "-100%";

  const translateY =
    anchor.vertical === "top" ? "0" : anchor.vertical === "center" ? "-50%" : "-100%";

  return {
    position: "absolute",
    left,
    top,
    transform: `translate(${translateX}, ${translateY})`,
  };
}
