import { describe, expect, it } from "vitest";
import { GATEWAY_SEEN_KEY, hasSeenGateway, markGatewaySeen } from "./gatewaySession";

const memory = () => {
  const data: Record<string, string> = {};
  return { getItem: (key: string) => data[key] ?? null, setItem: (key: string, value: string) => void (data[key] = value) };
};
const blocked = {
  getItem() {
    throw new DOMException("blocked", "SecurityError");
  },
  setItem() {
    throw new DOMException("blocked", "SecurityError");
  },
};

describe("gateway session note", () => {
  it("is unseen until the page has opened once", () => {
    const store = memory();
    expect(hasSeenGateway(store)).toBe(false);
    markGatewaySeen(store);
    expect(store.getItem(GATEWAY_SEEN_KEY)).toBe("1");
    expect(hasSeenGateway(store)).toBe(true);
  });

  it("never throws when storage is missing or blocked", () => {
    expect(hasSeenGateway(null)).toBe(false);
    expect(hasSeenGateway(blocked)).toBe(false);
    expect(() => markGatewaySeen(blocked)).not.toThrow();
    expect(() => markGatewaySeen(null)).not.toThrow();
  });
});
