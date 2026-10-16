import { describe, expect, it, vi } from "vitest";
import { FRESH_START_SNIPPET, startFresh } from "./fresh-start";

describe("startFresh", () => {
  it("turns restoration off, goes to the top and gives restoration back", () => {
    const scrollTo = vi.fn();
    const history = { scrollRestoration: "auto" as ScrollRestoration };
    const stop = startFresh({ scrollTo }, history);
    expect(history.scrollRestoration).toBe("manual");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    stop();
    expect(history.scrollRestoration).toBe("auto");
  });

  it("gives back what was there before, not always auto", () => {
    const history = { scrollRestoration: "manual" as ScrollRestoration };
    startFresh({ scrollTo: () => {} }, history)();
    expect(history.scrollRestoration).toBe("manual");
  });

  it("still goes to the top when the history object refuses", () => {
    const scrollTo = vi.fn();
    const history = {
      get scrollRestoration(): ScrollRestoration {
        throw new Error("no");
      },
      set scrollRestoration(_value: ScrollRestoration) {
        throw new Error("no");
      },
    };
    expect(() => startFresh({ scrollTo }, history)()).not.toThrow();
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});

describe("FRESH_START_SNIPPET", () => {
  it("sets manual restoration and survives a page without history", () => {
    const history = { scrollRestoration: "auto" };
    new Function("history", FRESH_START_SNIPPET)(history);
    expect(history.scrollRestoration).toBe("manual");
    expect(() => new Function("history", FRESH_START_SNIPPET)(undefined)).not.toThrow();
  });
});
