import { FIELD_SELECTOR, INTERACTIVE_SELECTOR, SPLASH_FRAMES, easeStep, ringTarget, shouldMountCursor } from "./cursor";
import { describe, expect, it } from "vitest";
import { DEFAULT_DRIFT, driftProgress, parseDrift, shouldMountDrift } from "./drift";
import { sampleTargets, shouldMountDust, stepParticle, type Particle } from "./dust";
import { nextFrame, parseLifeFrames, shouldMountLife } from "./life";
import { dayState, luminance, seg, skyColor, smoothstep, textMix, NIGHT, PAPER } from "./color";
import { resolveTier } from "./env";
import { blendFrames } from "./keyframes";
import { pathHasPrefix, shouldCoverNavigation, shouldPlaySeal, shouldRevealArrival, originOf, type ClickInfo, type ArrivalInfo } from "./navigation";
import { shichen } from "./shichen";
import { baziYear, ganzhiYear, monthBranch, solarLongitude, solarTerm } from "./solar";

describe("colour math", () => {
  it("smoothstep and seg clamp and ease", () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5, 6);
    expect(seg(5, 0, 10)).toBe(0.5);
    expect(seg(-3, 0, 10)).toBe(0);
    expect(seg(30, 0, 10)).toBe(1);
  });

  it("the sky starts at night, ends at paper and brightens monotonically", () => {
    expect(skyColor(0)).toEqual(NIGHT);
    expect(skyColor(1)).toEqual(PAPER);
    let previous = -1;
    for (let p = 0; p <= 1.0001; p += 0.02) {
      const lum = luminance(skyColor(p));
      expect(lum).toBeGreaterThanOrEqual(previous - 1e-9);
      previous = lum;
    }
  });

  it("out-of-range progress is clamped", () => {
    expect(skyColor(-5)).toEqual(NIGHT);
    expect(skyColor(7)).toEqual(PAPER);
  });

  it("text is light on night and ink on paper, and switches by brightness", () => {
    const night = dayState(0);
    const day = dayState(1);
    expect(night.textMix).toBe(0);
    expect(day.textMix).toBe(1);
    expect(night.fg[0]).toBeGreaterThan(200);
    expect(day.fg[0]).toBeLessThan(80);
    expect(textMix(80)).toBe(0);
    expect(textMix(160)).toBe(1);
    expect(textMix(120)).toBeGreaterThan(0);
    expect(textMix(120)).toBeLessThan(1);
  });
});

describe("solar position", () => {
  it("matches the equinoxes and solstices of 2026 within a tenth of a degree", () => {
    const near = (actual: number, expected: number) => {
      const diff = Math.abs(((actual - expected + 540) % 360) - 180);
      expect(diff).toBeLessThan(0.1);
    };
    near(solarLongitude(Date.UTC(2026, 2, 20, 14, 0)), 0);
    near(solarLongitude(Date.UTC(2026, 5, 21, 8, 0)), 90);
    near(solarLongitude(Date.UTC(2026, 11, 21, 20, 0)), 270);
  });

  it("crosses 315 degrees (Lichun) between 3 and 4 February 2026", () => {
    expect(solarLongitude(Date.UTC(2026, 1, 3, 12))).toBeLessThan(315);
    expect(solarLongitude(Date.UTC(2026, 1, 4, 12))).toBeGreaterThan(315);
  });

  it("names the term and the month branch for 14 October 2026", () => {
    const longitude = solarLongitude(Date.UTC(2026, 9, 14, 12));
    expect(longitude).toBeGreaterThan(200);
    expect(longitude).toBeLessThan(202);
    expect(solarTerm(longitude).name).toBe("Hàn Lộ");
    expect(monthBranch(longitude).name).toBe("Tuất");
  });

  it("month branches run from Tiger at Lichun every 30 degrees", () => {
    expect(monthBranch(315).name).toBe("Dần");
    expect(monthBranch(344.9).name).toBe("Dần");
    expect(monthBranch(345).name).toBe("Mão");
    expect(monthBranch(270).name).toBe("Tý");
    expect(monthBranch(300).name).toBe("Sửu");
    expect(monthBranch(314.9).name).toBe("Sửu");
  });

  it("the Ba-zi year changes at Lichun, not on 1 January", () => {
    expect(baziYear(new Date(Date.UTC(2026, 0, 15)))).toBe(2025);
    expect(baziYear(new Date(Date.UTC(2026, 1, 3, 12)))).toBe(2025);
    expect(baziYear(new Date(Date.UTC(2026, 1, 5)))).toBe(2026);
    expect(baziYear(new Date(Date.UTC(2026, 9, 14)))).toBe(2026);
    expect(baziYear(new Date(Date.UTC(2026, 11, 31)))).toBe(2026);
  });

  it("stem and branch of known years", () => {
    expect(ganzhiYear(1984).han).toBe("甲子");
    expect(ganzhiYear(1995).han).toBe("乙亥");
    expect(ganzhiYear(2026).han).toBe("丙午");
    expect(ganzhiYear(4).han).toBe("甲子");
  });
});

describe("double-hours", () => {
  it("finds the branch and minutes left", () => {
    expect(shichen(12, 0)).toMatchObject({ name: "Ngọ", han: "午", minutesLeft: 60 });
    expect(shichen(23, 30)).toMatchObject({ name: "Tý", minutesLeft: 90 });
    expect(shichen(0, 0)).toMatchObject({ name: "Tý", minutesLeft: 60 });
    expect(shichen(1, 0)).toMatchObject({ name: "Sửu", minutesLeft: 120 });
    expect(shichen(13, 0)).toMatchObject({ name: "Mùi", minutesLeft: 120 });
    expect(shichen(22, 59)).toMatchObject({ name: "Hợi", minutesLeft: 1 });
  });
});

describe("keyframe blending", () => {
  const ages = [0, 12, 22, 45, 62, 80];

  it("holds the first and last frame outside the range", () => {
    expect(blendFrames(-5, ages)).toEqual({ from: 0, to: 0, t: 0 });
    expect(blendFrames(0, ages)).toEqual({ from: 0, to: 0, t: 0 });
    expect(blendFrames(80, ages)).toEqual({ from: 5, to: 5, t: 0 });
    expect(blendFrames(99, ages)).toEqual({ from: 5, to: 5, t: 0 });
  });

  it("does not crossfade near the ends of an interval and crosses in the middle", () => {
    const early = blendFrames(12 + 0.2 * 10, ages);
    expect(early).toMatchObject({ from: 1, to: 2, t: 0 });
    const middle = blendFrames(12 + 0.5 * 10, ages);
    expect(middle.t).toBeCloseTo(0.5, 5);
    const late = blendFrames(12 + 0.8 * 10, ages);
    expect(late.t).toBe(1);
  });

  it("picks the right pair for each interval", () => {
    expect(blendFrames(30, ages)).toMatchObject({ from: 2, to: 3 });
    expect(blendFrames(50, ages)).toMatchObject({ from: 3, to: 4 });
    expect(blendFrames(70, ages)).toMatchObject({ from: 4, to: 5 });
  });

  it("rejects an empty list", () => {
    expect(() => blendFrames(10, [])).toThrow();
  });
});

describe("motion tier", () => {
  it("reduced motion turns everything off", () => {
    expect(resolveTier({ reducedMotion: true })).toBe("off");
    expect(resolveTier({ reducedMotion: true, cores: 16, memory: 8 })).toBe("off");
  });

  it("weak devices and data saving drop to subtle", () => {
    expect(resolveTier({ reducedMotion: false, saveData: true })).toBe("subtle");
    expect(resolveTier({ reducedMotion: false, memory: 2 })).toBe("subtle");
    expect(resolveTier({ reducedMotion: false, cores: 2 })).toBe("subtle");
  });

  it("a normal device gets the full tier, including when nothing is reported", () => {
    expect(resolveTier({ reducedMotion: false, cores: 8, memory: 8 })).toBe("full");
    expect(resolveTier({ reducedMotion: false })).toBe("full");
  });
});

describe("page transition rules", () => {
  const family = ["https://tommitoan.com", "https://bazi.tommitoan.com/"];
  const click = (over: Partial<ClickInfo> = {}): ClickInfo => ({
    href: "https://bazi.tommitoan.com/chart",
    currentHref: "https://tommitoan.com/fengshui/",
    family,
    tier: "full",
    button: 0,
    ctrl: false,
    meta: false,
    shift: false,
    alt: false,
    ...over,
  });

  it("covers a link to the sister site and to another page of the same site", () => {
    expect(shouldCoverNavigation(click())).toBe(true);
    expect(shouldCoverNavigation(click({ href: "/blog/" }))).toBe(true);
  });

  it("skips reduced motion, modified clicks, new tabs, downloads and prevented clicks", () => {
    expect(shouldCoverNavigation(click({ tier: "off" }))).toBe(false);
    expect(shouldCoverNavigation(click({ button: 1 }))).toBe(false);
    expect(shouldCoverNavigation(click({ ctrl: true }))).toBe(false);
    expect(shouldCoverNavigation(click({ meta: true }))).toBe(false);
    expect(shouldCoverNavigation(click({ target: "_blank" }))).toBe(false);
    expect(shouldCoverNavigation(click({ download: true }))).toBe(false);
    expect(shouldCoverNavigation(click({ defaultPrevented: true }))).toBe(false);
  });

  it("skips share links with a fragment, the same page, and unrelated origins", () => {
    expect(shouldCoverNavigation(click({ href: "https://bazi.tommitoan.com/chart#d=1995-12-15T12:00&tz=Asia/Ho_Chi_Minh&g=1" }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "#section" }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "/fengshui/" }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "https://github.com/tommitoan/bazica" }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "mailto:someone@example.com" }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "not a url" , currentHref: "also bad" }))).toBe(false);
  });

  it("with a path allow-list, same-origin links outside it are left alone but the sister site still covers", () => {
    const paths = ["/fengshui"];
    expect(shouldCoverNavigation(click({ href: "/fengshui/blog/", sameOriginPaths: paths }))).toBe(true);
    expect(shouldCoverNavigation(click({ href: "/fengshui/other", currentHref: "https://tommitoan.com/fengshui/", sameOriginPaths: paths }))).toBe(true);
    expect(shouldCoverNavigation(click({ href: "/tech/", sameOriginPaths: paths }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "/", sameOriginPaths: paths }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "/fengshuiX/", sameOriginPaths: paths }))).toBe(false);
    expect(shouldCoverNavigation(click({ href: "https://bazi.tommitoan.com/chart", sameOriginPaths: paths }))).toBe(true);
    expect(shouldCoverNavigation(click({ href: "/tech/", sameOriginPaths: [] }))).toBe(false);
  });

  it("path prefixes match whole segments only", () => {
    expect(pathHasPrefix("/fengshui", "/fengshui")).toBe(true);
    expect(pathHasPrefix("/fengshui/", "/fengshui/")).toBe(true);
    expect(pathHasPrefix("/fengshui/blog/x", "/fengshui")).toBe(true);
    expect(pathHasPrefix("/fengshuis", "/fengshui")).toBe(false);
    expect(pathHasPrefix("/", "/fengshui")).toBe(false);
  });

  const arrival = (over: Partial<ArrivalInfo> = {}): ArrivalInfo => ({
    referrer: "https://tommitoan.com/fengshui/",
    currentHref: "https://bazi.tommitoan.com/chart",
    family,
    navType: "navigate",
    tier: "full",
    startedHere: false,
    ...over,
  });

  it("reveals when arriving from the sister site or after its own cover", () => {
    expect(shouldRevealArrival(arrival())).toBe(true);
    expect(shouldRevealArrival(arrival({ referrer: "", startedHere: true }))).toBe(true);
  });

  it("does not reveal on reload, back/forward, a fragment, reduced motion or a stranger", () => {
    expect(shouldRevealArrival(arrival({ navType: "reload" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ navType: "back_forward" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ currentHref: "https://bazi.tommitoan.com/chart#d=1995" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ tier: "off" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ referrer: "https://www.google.com/" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ referrer: "https://bazi.tommitoan.com/profile" }))).toBe(false);
    expect(shouldRevealArrival(arrival({ referrer: "" }))).toBe(false);
  });

  it("the opening seal plays on a fresh load or reload, never with a reveal", () => {
    expect(shouldPlaySeal("navigate", "full", false)).toBe(true);
    expect(shouldPlaySeal("reload", "subtle", false)).toBe(true);
    expect(shouldPlaySeal("back_forward", "full", false)).toBe(false);
    expect(shouldPlaySeal("navigate", "off", false)).toBe(false);
    expect(shouldPlaySeal("navigate", "full", true)).toBe(false);
  });

  it("origins are parsed safely", () => {
    expect(originOf("https://Bazi.TommiToan.com/chart?x=1")).toBe("https://bazi.tommitoan.com");
    expect(originOf("/relative", "https://tommitoan.com/a")).toBe("https://tommitoan.com");
    expect(originOf("mailto:a@b.c")).toBeNull();
    expect(originOf("::::")).toBeNull();
  });
});

describe("pointer ring (effect 20)", () => {
  it("is a quiet ring over plain page, larger and fully shown over something clickable", () => {
    expect(ringTarget({ interactive: false, overField: false, pressed: false })).toEqual({ scale: 1, opacity: 0.75 });
    expect(ringTarget({ interactive: true, overField: false, pressed: false })).toEqual({ scale: 1.7, opacity: 1 });
  });

  it("shrinks while pressed, relative to where it was", () => {
    expect(ringTarget({ interactive: false, overField: false, pressed: true }).scale).toBeCloseTo(0.8);
    expect(ringTarget({ interactive: true, overField: false, pressed: true }).scale).toBeCloseTo(1.36);
  });

  it("disappears over a text field, where the real text cursor must stay in charge", () => {
    expect(ringTarget({ interactive: true, overField: true, pressed: false })).toEqual({ scale: 1, opacity: 0 });
  });

  it("eases toward a target and lands on it", () => {
    expect(easeStep(0, 10, 0.5)).toBe(5);
    expect(easeStep(9.99, 10, 0.5, 0.02)).toBe(10);
    expect(easeStep(3, 3, 0.2)).toBe(3);
    expect(easeStep(0, 10, 5)).toBe(10);
    expect(easeStep(0, 10, -1)).toBe(0);
  });

  it("mounts only when asked for, on the full tier and with a mouse-like pointer", () => {
    expect(shouldMountCursor(true, "full", true)).toBe(true);
    expect(shouldMountCursor(false, "full", true)).toBe(false);
    expect(shouldMountCursor(true, "subtle", true)).toBe(false);
    expect(shouldMountCursor(true, "off", true)).toBe(false);
    expect(shouldMountCursor(true, "full", false)).toBe(false);
  });

  it("treats links and buttons as clickable and text inputs as fields, but not checkboxes", () => {
    for (const clickable of ["a[href]", "button", "summary", '[role="button"]', "[data-kit-magnetic]"]) expect(INTERACTIVE_SELECTOR).toContain(clickable);
    expect(FIELD_SELECTOR).toContain("textarea");
    for (const notAField of ["button", "submit", "checkbox", "radio", "range"]) expect(FIELD_SELECTOR).toContain(`:not([type="${notAField}"])`);
  });

  it("splashes outward and fades away", () => {
    expect(SPLASH_FRAMES[0]).toMatchObject({ opacity: 0.35 });
    expect(SPLASH_FRAMES[SPLASH_FRAMES.length - 1]).toMatchObject({ opacity: 0 });
  });
});

describe("ink dust (effect 2)", () => {
  it("samples the grid points whose pixel is dark enough", () => {
    const size = 8;
    const rgba = new Uint8ClampedArray(size * size * 4);
    const paint = (x: number, y: number, alpha: number) => {
      rgba[(y * size + x) * 4 + 3] = alpha;
    };
    paint(0, 0, 255);
    paint(4, 0, 140);
    paint(0, 4, 141);
    paint(4, 4, 200);
    expect(sampleTargets(rgba, size, 4)).toEqual([
      [0, 0],
      [0, 4],
      [4, 4],
    ]);
    expect(sampleTargets(rgba, size, 4, 0)).toHaveLength(4);
  });

  it("pulls a particle to its target and settles there", () => {
    const p: Particle = { tx: 100, ty: 50, x: 0, y: 0, vx: 0, vy: 0 };
    for (let i = 0; i < 400; i++) stepParticle(p, null);
    expect(p.x).toBeCloseTo(100, 1);
    expect(p.y).toBeCloseTo(50, 1);
  });

  it("pushes a particle away from a pointer that is close and ignores one that is far", () => {
    const near: Particle = { tx: 50, ty: 50, x: 50, y: 50, vx: 0, vy: 0 };
    stepParticle(near, { x: 40, y: 50 });
    expect(near.x).toBeGreaterThan(50);
    const far: Particle = { tx: 50, ty: 50, x: 50, y: 50, vx: 0, vy: 0 };
    stepParticle(far, { x: 400, y: 400 });
    expect(far.x).toBe(50);
    expect(far.y).toBe(50);
  });

  it("runs on the full tier only", () => {
    expect(shouldMountDust("full")).toBe(true);
    expect(shouldMountDust("subtle")).toBe(false);
    expect(shouldMountDust("off")).toBe(false);
  });
});

describe("drifting cards (effect 4)", () => {
  it("reads the percentages, falls back to the defaults and cycles", () => {
    expect(parseDrift("-10,5", 2)).toEqual([-10, 5]);
    expect(parseDrift("-10,5", 4)).toEqual([-10, 5, -10, 5]);
    expect(parseDrift(null, 4)).toEqual([...DEFAULT_DRIFT]);
    expect(parseDrift("x,,y", 2)).toEqual([DEFAULT_DRIFT[0], DEFAULT_DRIFT[1]]);
  });

  it("is 0 at the start, grows as the container leaves the window and stops at 1", () => {
    expect(driftProgress(100, 300, 800)).toBe(0);
    expect(driftProgress(0, 300, 800)).toBe(0);
    expect(driftProgress(-230, 300, 800)).toBeCloseTo(0.5, 5);
    expect(driftProgress(-5000, 300, 800)).toBe(1);
  });

  it("runs on the full tier only", () => {
    expect(shouldMountDrift("full")).toBe(true);
    expect(shouldMountDrift("subtle")).toBe(false);
    expect(shouldMountDrift("off")).toBe(false);
  });
});

describe("life strip (effect 25, light)", () => {
  it("steps through the frames and says when the loop starts again", () => {
    expect(nextFrame(0, 6)).toEqual({ index: 1, restarted: false });
    expect(nextFrame(4, 6)).toEqual({ index: 5, restarted: false });
    expect(nextFrame(5, 6)).toEqual({ index: 0, restarted: true });
  });

  it("reads the frame list and skips broken entries", () => {
    expect(parseLifeFrames("12=/a.webp; 22 = /b.webp")).toEqual([
      { age: "12", src: "/a.webp" },
      { age: "22", src: "/b.webp" },
    ]);
    expect(parseLifeFrames("=/a.webp;12=;nonsense;45=/c.webp")).toEqual([{ age: "45", src: "/c.webp" }]);
    expect(parseLifeFrames(null)).toEqual([]);
  });

  it("copes with no frames", () => {
    expect(nextFrame(0, 0)).toEqual({ index: 0, restarted: false });
  });

  it("plays on the full tier only", () => {
    expect(shouldMountLife("full")).toBe(true);
    expect(shouldMountLife("subtle")).toBe(false);
    expect(shouldMountLife("off")).toBe(false);
  });
});
