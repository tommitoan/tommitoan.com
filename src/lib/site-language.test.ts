import { describe, expect, it } from "vitest";
import { detectLanguage } from "./site-language";

describe("detectLanguage", () => {
  it("chooses Vietnamese when the browser prefers it", () => {
    expect(detectLanguage(["vi-VN", "en-US"], "America/New_York")).toBe("vi");
    expect(detectLanguage(["vi"], "")).toBe("vi");
    expect(detectLanguage(["en-US", "vi"], "Europe/Paris")).toBe("vi");
  });

  it("chooses Vietnamese for a Vietnamese time zone", () => {
    expect(detectLanguage(["en-US"], "Asia/Ho_Chi_Minh")).toBe("vi");
    expect(detectLanguage(["en-GB"], "Asia/Saigon")).toBe("vi");
  });

  it("defaults to English", () => {
    expect(detectLanguage(["en-US"], "America/New_York")).toBe("en");
    expect(detectLanguage(["fr-FR", "de"], "Europe/Paris")).toBe("en");
    expect(detectLanguage([], "")).toBe("en");
  });

  it("does not take a language that only starts with the letters vi", () => {
    expect(detectLanguage(["vivid"], "Europe/Paris")).toBe("en");
  });
});
