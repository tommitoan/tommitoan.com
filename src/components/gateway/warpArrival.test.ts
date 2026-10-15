import { describe, expect, it } from "vitest";
import { WARP_ARRIVAL_KEY, WARP_ARRIVAL_MAX_AGE_MS, consumeWarpArrival, markWarpArrival } from "./warpArrival";

function memoryStore(): Pick<Storage, "getItem" | "setItem" | "removeItem"> & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

describe("warp arrival note", () => {
  it("is read once, for the page the warp led to", () => {
    const store = memoryStore();
    markWarpArrival("/fengshui", store, 1000);
    expect(consumeWarpArrival("/fengshui/", store, 2000)).toBe(true);
    expect(consumeWarpArrival("/fengshui", store, 2000)).toBe(false);
    expect(store.data.has(WARP_ARRIVAL_KEY)).toBe(false);
  });

  it("ignores a note for another page, and still clears it", () => {
    const store = memoryStore();
    markWarpArrival("/tech", store, 1000);
    expect(consumeWarpArrival("/fengshui", store, 2000)).toBe(false);
    expect(store.data.has(WARP_ARRIVAL_KEY)).toBe(false);
  });

  it("expires after a few seconds and ignores a time in the future", () => {
    const store = memoryStore();
    markWarpArrival("/fengshui", store, 1000);
    expect(consumeWarpArrival("/fengshui", store, 1000 + WARP_ARRIVAL_MAX_AGE_MS + 1)).toBe(false);
    markWarpArrival("/fengshui", store, 5000);
    expect(consumeWarpArrival("/fengshui", store, 1000)).toBe(false);
    markWarpArrival("/fengshui", store, 1000);
    expect(consumeWarpArrival("/fengshui", store, 1000 + WARP_ARRIVAL_MAX_AGE_MS)).toBe(true);
  });

  it("copes with a damaged note, blocked storage and no storage", () => {
    const store = memoryStore();
    store.setItem(WARP_ARRIVAL_KEY, "{not json");
    expect(consumeWarpArrival("/fengshui", store, 1)).toBe(false);
    store.setItem(WARP_ARRIVAL_KEY, JSON.stringify({ path: 3, at: "x" }));
    expect(consumeWarpArrival("/fengshui", store, 1)).toBe(false);
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    expect(() => markWarpArrival("/fengshui", blocked, 1)).not.toThrow();
    expect(consumeWarpArrival("/fengshui", blocked, 1)).toBe(false);
    expect(consumeWarpArrival("/fengshui", null, 1)).toBe(false);
  });
});
