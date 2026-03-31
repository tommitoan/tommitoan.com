import { describe, expect, it } from "vitest";
import { createAnchorStyle, gatewayHomeConfig } from "./gatewayHomeConfig";

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
    expect(gatewayHomeConfig.spaceTheme.background.imageSrc).toBe("/gateway/backgrounds/space-bg.png");
    expect(gatewayHomeConfig.astronaut.assetSrc).toBe("/gateway/characters/astronaut.png");

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
  });
});
