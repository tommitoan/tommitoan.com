import { describe, expect, it } from "vitest";
import { GATEWAY_UI, PORTAL_COPY, portalCopy, portalTitle } from "./gatewayCopy";
import { gatewayHomeConfig } from "./gatewayHomeConfig";

describe("home page copy", () => {
  it("has both languages for every portal of the config", () => {
    for (const portal of gatewayHomeConfig.portals) {
      for (const language of ["en", "vi"] as const) {
        const copy = portalCopy(portal.id, language);
        expect(copy.description.length).toBeGreaterThan(10);
        expect(copy.speech.length).toBeGreaterThan(30);
        expect(copy.highlights.length).toBeGreaterThanOrEqual(3);
        expect(copy.highlights.length).toBeLessThanOrEqual(4);
        for (const highlight of copy.highlights) expect(highlight.trim()).toBe(highlight);
      }
    }
    expect(Object.keys(PORTAL_COPY).sort()).toEqual(gatewayHomeConfig.portals.map((portal) => portal.id).sort());
  });

  it("keeps the astronaut's lines short enough for the bubble", () => {
    for (const portal of gatewayHomeConfig.portals) {
      for (const language of ["en", "vi"] as const) expect(portalCopy(portal.id, language).speech.length).toBeLessThan(170);
    }
  });

  it("names every route in both languages, in Vietnamese for Vietnamese visitors", () => {
    expect(portalTitle("tech", "vi")).toBe("Kỹ thuật");
    expect(portalTitle("discover", "vi")).toBe("Khám phá");
    expect(portalTitle("fengshui", "vi")).toBe("Phong thuỷ");
    for (const portal of gatewayHomeConfig.portals) {
      expect(portalTitle(portal.id, "en")).toBe(portal.label);
    }
  });

  it("has the words of the page in both languages", () => {
    expect(GATEWAY_UI.en.enter).not.toBe(GATEWAY_UI.vi.enter);
    expect(GATEWAY_UI.en.tapToEnter).not.toBe(GATEWAY_UI.vi.tapToEnter);
    expect(GATEWAY_UI.vi.languageLabel).toBe("Ngôn ngữ");
  });
});
