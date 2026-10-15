import { describe, expect, it } from "vitest";
import { normaliseOrigin } from "./sister-site";

const FALLBACK = "https://bazi.tommitoan.com";

describe("normaliseOrigin", () => {
  it.each([
    [undefined, FALLBACK],
    ["", FALLBACK],
    ["  ", FALLBACK],
    ["https://staging.example.com", "https://staging.example.com"],
    ["https://staging.example.com/", "https://staging.example.com"],
    ["http://localhost:8092", "http://localhost:8092"],
    ["  http://127.0.0.1:8092/  ", "http://127.0.0.1:8092"],
  ])("accepts %j as %s", (raw, expected) => {
    expect(normaliseOrigin(raw, FALLBACK)).toBe(expected);
  });

  it.each(["https://example.com/path", "https://example.com?x=1", "https://example.com#x", "https://user:pw@example.com", "javascript:alert(1)", "example.com", "ftp://example.com"])(
    "ignores %s",
    (raw) => {
      expect(normaliseOrigin(raw, FALLBACK)).toBe(FALLBACK);
    },
  );
});
