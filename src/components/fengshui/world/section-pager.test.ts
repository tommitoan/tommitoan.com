import { describe, expect, it } from "vitest";
import { type Block, easeOutQuart, pagerTarget, wheelIntent, wheelPixels, type WheelRecord } from "./section-pager";

const VIEWPORT = 900;
// A tall pinned scene, then three one-page bands, a tall pinned story, a one-page band and a short footer.
const blocks: Block[] = [
  { top: 0, bottom: 4680 },
  { top: 4680, bottom: 5580 },
  { top: 5580, bottom: 6480 },
  { top: 6480, bottom: 7380 },
  { top: 7380, bottom: 10440 },
  { top: 10440, bottom: 11340 },
  { top: 11340, bottom: 11600 },
];
const maxScroll = 11600 - VIEWPORT;
const target = (scrollY: number, delta: number) => pagerTarget(blocks, scrollY, VIEWPORT, maxScroll, delta);

describe("inside a tall section", () => {
  it("lets the browser scroll", () => {
    expect(target(0, 100)).toBeNull();
    expect(target(1500, 100)).toBeNull();
    expect(target(1500, -100)).toBeNull();
  });

  it("stops exactly at the last screen when the wheel would carry the page past it", () => {
    const end = 4680 - VIEWPORT;
    expect(target(end - 60, 100)).toBe(end);
    expect(target(end - 500, 100)).toBeNull();
  });

  it("then crosses to the top of the next section with the next turn", () => {
    expect(target(4680 - VIEWPORT, 100)).toBe(4680);
    expect(target(4600, 100)).toBe(4680);
  });

  it("stops at its top going up, and goes on to the end of the section above with the next turn", () => {
    expect(target(7380 + 40, -100)).toBe(7380);
    expect(target(7380, -100)).toBe(6480);
    expect(target(4680, -100)).toBe(4680 - VIEWPORT);
  });
});

describe("on a one-page section", () => {
  it("one turn down goes all the way to the next section", () => {
    expect(target(4680, 100)).toBe(5580);
    expect(target(5580, 5)).toBe(6480);
    expect(target(6480, 100)).toBe(7380);
  });

  it("one turn up goes to the previous section, to its last screen when that one is tall", () => {
    expect(target(5580, -100)).toBe(4680);
    expect(target(10440, -100)).toBe(10440 - VIEWPORT);
  });

  it("first returns to the top of the section when the page rests in the middle of it", () => {
    expect(target(5000, -100)).toBe(4680);
    expect(target(5000, 100)).toBe(5580);
  });

  it("goes down to the end of the page from the last full section, and nowhere from the end or the very top", () => {
    expect(target(10440, 100)).toBe(maxScroll);
    expect(target(maxScroll, 100)).toBeNull();
    expect(target(0, -100)).toBeNull();
  });
});

describe("helpers", () => {
  it("does nothing for no movement or no sections", () => {
    expect(target(4680, 0)).toBeNull();
    expect(pagerTarget([], 0, VIEWPORT, 1000, 100)).toBeNull();
  });

  it("reads the wheel in pixels in every unit", () => {
    expect(wheelPixels(100, 0, 900)).toBe(100);
    expect(wheelPixels(3, 1, 900)).toBe(48);
    expect(wheelPixels(1, 2, 900)).toBe(900);
  });

  it("eases from 0 to 1 and answers at once: half the way is covered in the first sixth of the time", () => {
    expect(easeOutQuart(0)).toBe(0);
    expect(easeOutQuart(1)).toBe(1);
    expect(easeOutQuart(0.16)).toBeGreaterThan(0.5);
    expect(easeOutQuart(-1)).toBe(0);
    expect(easeOutQuart(2)).toBe(1);
    let last = 0;
    for (let t = 0; t <= 1; t += 0.05) {
      expect(easeOutQuart(t)).toBeGreaterThanOrEqual(last);
      last = easeOutQuart(t);
    }
  });
});

describe("the free zone below the pager", () => {
  const withFree: Block[] = [
    { top: 0, bottom: 900 },
    { top: 900, bottom: 1800 },
    { top: 1800, bottom: 6000, free: true },
  ];
  const free = (scrollY: number, delta: number) => pagerTarget(withFree, scrollY, 900, 5100, delta);

  it("crosses into it from the last paged section as one move to its top", () => {
    expect(free(900, 100)).toBe(1800);
  });

  it("leaves the wheel alone inside it, down or up, even right at the bottom", () => {
    expect(free(1800, 100)).toBeNull();
    expect(free(3000, 100)).toBeNull();
    expect(free(3000, -100)).toBeNull();
    expect(free(5050, 100)).toBeNull();
    expect(free(1850, -100)).toBeNull();
  });

  it("hands the very top of it back to the pager, to the last screen of the section above", () => {
    expect(free(1800, -100)).toBe(900);
  });
});

describe("telling a new push from a trackpad that is coasting", () => {
  const events = (...pairs: Array<[number, number]>): WheelRecord[] => pairs.map(([time, size]) => ({ time, size }));

  it("a new gesture, after a pause, moves the page; during a move it is remembered", () => {
    expect(wheelIntent([], 1000, 100, false, 5000)).toBe("act");
    expect(wheelIntent(events([500, 100]), 1000, 100, false, 5000)).toBe("act");
    expect(wheelIntent([], 1000, 100, true, 0)).toBe("queue");
    expect(wheelIntent(events([500, 100]), 1000, 100, true, 0)).toBe("queue");
  });

  it("events in a stream while a move runs are swallowed, not queued", () => {
    expect(wheelIntent(events([950, 100]), 1000, 100, true, 0)).toBe("ignore");
  });

  it("right after a move ends, a continuing stream waits to show whether it is coasting", () => {
    expect(wheelIntent(events([950, 100]), 1000, 100, false, 50)).toBe("ignore");
  });

  it("a wheel spun steadily goes on moving the page, a coasting trackpad does not", () => {
    expect(wheelIntent(events([800, 100], [900, 100]), 1000, 100, false, 400)).toBe("act");
    expect(wheelIntent(events([800, 60], [900, 56]), 1000, 40, false, 400)).toBe("ignore");
    expect(wheelIntent(events([800, 30], [900, 32]), 1000, 60, false, 400)).toBe("act");
  });
});

describe("a section only a little taller than the window", () => {
  // A band of 943 px in a 900 px window is one page: the extra is its bottom padding.
  const slightly: Block[] = [
    { top: 0, bottom: 900 },
    { top: 900, bottom: 1843 },
    { top: 1843, bottom: 5000, free: true },
  ];
  const t = (scrollY: number, delta: number) => pagerTarget(slightly, scrollY, 900, 4100, delta);

  it("moves to the next section in one turn instead of first scrolling the extra 43 px", () => {
    expect(t(900, 100)).toBe(1843);
  });

  it("goes back to its top, not to some position inside it", () => {
    expect(t(1843, -100)).toBe(900);
  });
});
