import { describe, expect, it } from "vitest";
import { COMPACT_MAX_WIDTH, createAnchorStyle, createFrameStyle, gatewayHomeConfig, isCompactViewport, zoomOffsetXFor } from "./gatewayHomeConfig";

describe("createAnchorStyle", () => {
  it("places a centered anchor with centered translation", () => {
    expect(
      createAnchorStyle({
        horizontal: "center",
        vertical: "center",
        offsetXPercent: 0,
        offsetYPercent: 0,
      }),
    ).toEqual({
      position: "absolute",
      left: "calc(50% + 0%)",
      top: "calc(50% + 0%)",
      transform: "translate(-50%, -50%)",
    });
  });

  it("applies top-left alignment and offsets", () => {
    expect(
      createAnchorStyle({
        horizontal: "left",
        vertical: "top",
        offsetXPercent: 12,
        offsetYPercent: -8,
      }),
    ).toEqual({
      position: "absolute",
      left: "calc(0% + 12%)",
      top: "calc(0% + -8%)",
      transform: "translate(0%, 0%)",
    });
  });
});

describe("gatewayHomeConfig", () => {
  it("keeps unique portal ids and hrefs", () => {
    const ids = gatewayHomeConfig.portals.map((portal) => portal.id);
    const hrefs = gatewayHomeConfig.portals.map((portal) => portal.href);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses the reorganized gateway asset directories", () => {
    expect(gatewayHomeConfig.spaceTheme.background.imageSrc).toBe("/gateway/backgrounds/space-bg.webp");
    expect(gatewayHomeConfig.astronaut.assetSrc).toBe("/gateway/characters/astronaut.webp");

    for (const portal of gatewayHomeConfig.portals) {
      expect(portal.planet.diffuse.startsWith("/gateway/textures/")).toBe(true);
      if (portal.planet.normal) {
        expect(portal.planet.normal.startsWith("/gateway/textures/")).toBe(true);
      }
      if (portal.planet.specular) {
        expect(portal.planet.specular.startsWith("/gateway/textures/")).toBe(true);
      }
      if (portal.planet.clouds) {
        expect(portal.planet.clouds.startsWith("/gateway/textures/")).toBe(true);
      }
      if ("lights" in portal.planet && portal.planet.lights) {
        expect(portal.planet.lights.startsWith("/gateway/textures/")).toBe(true);
      }
    }
  });

  it("uses a single configurable green wind effect for Feng Shui", () => {
    const fengShuiPortal = gatewayHomeConfig.portals.find((portal) => portal.id === "fengshui");

    expect(fengShuiPortal).toBeDefined();
    expect(fengShuiPortal?.effects).toHaveLength(1);
    expect(fengShuiPortal?.effects[0]?.kind).toBe("aurora");

    if (fengShuiPortal?.effects[0]?.kind !== "aurora") {
      throw new Error("Expected fengshui to use aurora wind config");
    }

    expect(fengShuiPortal.effects[0].windConfig?.density).toBe(12);
    expect(fengShuiPortal.effects[0].windConfig?.thickness).toBe(0.52);
    expect(fengShuiPortal.effects[0].windConfig?.palette).toHaveLength(12);
  });

  it("uses layered gateway stars with mixed cool and warm palette accents", () => {
    const gatewayStars = gatewayHomeConfig.spaceTheme.stars.gateway;
    const gatewayDebug = gatewayHomeConfig.debug;
    const gatewayLoader = gatewayHomeConfig.loader;

    expect(gatewayStars.layers).toHaveLength(4);
    expect(gatewayStars.layers.map((layer) => layer.id)).toEqual(["far", "mid", "accent", "hero"]);
    expect(gatewayStars.performance.maxDpr).toBe(1.5);
    expect(gatewayStars.distribution.diagonalBias).toBe(0.28);
    expect(gatewayStars.distribution.secondaryDiagonalBias).toBe(0.12);
    expect(gatewayStars.layers[1].twinkle.enabled).toBe(true);
    expect(gatewayStars.layers[1].twinkle.fraction).toBe(0.34);
    expect(gatewayStars.layers[2].palette).toContain("#ffd6b8");
    expect(gatewayStars.layers[2].parallaxStrength).toBe(0.018);
    expect(gatewayStars.layers[3].twinkle.fraction).toBe(1);
    expect(gatewayStars.layers[3].haloScale).toBe(3.8);
    expect(gatewayStars.layers[3].haloOpacity).toBe(0.28);
    expect(gatewayStars.layers[3].parallaxStrength).toBe(0.032);
    expect(typeof gatewayDebug.showFrames).toBe("boolean");
    expect(typeof gatewayDebug.showPlanets).toBe("boolean");
    expect(typeof gatewayDebug.showAstronaut).toBe("boolean");
    expect(gatewayLoader.dashDensity).toBe(72);
    expect(gatewayLoader.scaleSize).toBe(1);
    expect(gatewayLoader.color).toBe("#67e8f9");
    expect(gatewayLoader.glowStrength).toBe(4.8);
  });
});

describe("the phone layout of the home page", () => {
  it("is a phone only when the width is measured and under the boundary", () => {
    expect(isCompactViewport(0)).toBe(false); // not measured yet
    expect(isCompactViewport(1)).toBe(true);
    expect(isCompactViewport(COMPACT_MAX_WIDTH - 1)).toBe(true);
    expect(isCompactViewport(COMPACT_MAX_WIDTH)).toBe(false);
    expect(isCompactViewport(1280)).toBe(false);
  });

  it("zooms toward a portal by the phone offsets on a phone and by the desktop ones elsewhere", () => {
    const { zoomOffsetXByPortal, zoomOffsetXMobileByPortal } = gatewayHomeConfig.transitions;
    for (const portal of gatewayHomeConfig.portals) {
      expect(zoomOffsetXFor(portal.id, 390)).toBe(zoomOffsetXMobileByPortal[portal.id]);
      expect(zoomOffsetXFor(portal.id, 1280)).toBe(zoomOffsetXByPortal[portal.id]);
      expect(zoomOffsetXFor(portal.id, 0)).toBe(zoomOffsetXByPortal[portal.id]);
    }
    // The two outer columns move opposite ways and the middle one stays: on a phone as on a desktop.
    expect(zoomOffsetXMobileByPortal.discover).toBe("0vw");
    expect(parseFloat(zoomOffsetXMobileByPortal.tech)).toBe(-parseFloat(zoomOffsetXMobileByPortal.fengshui));
  });

  it("never lets a window grow past a third of the row, so all three stay on a phone", () => {
    const style = createFrameStyle({ width: { mobileRem: 10, viewport: 30, desktopRem: 24 }, height: { mobileRem: 20, viewport: 60, desktopRem: 30 }, radiusRem: 2 });
    const { gapMobileRem, gapDesktopRem } = gatewayHomeConfig.row;
    expect(String(style.width)).toMatch(/^min\(clamp\(/);
    expect(String(style.width)).toContain(`calc((100vw - 2rem - 2 * clamp(${gapMobileRem}rem, 3vw, ${gapDesktopRem}rem)) / 3)`);
    expect(style.borderRadius).toBe("2rem");
  });
});
