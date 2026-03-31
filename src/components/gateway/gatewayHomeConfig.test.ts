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
});
