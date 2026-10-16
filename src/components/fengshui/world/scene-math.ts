import { clamp, dayState, lerp, lerpColor, seg, smoothstep, type Appearance, type DayState, type RGB } from "@kit/color";
import { blendFrames, type FrameBlend } from "@kit/keyframes";

/**
 * Everything the birth scene draws is a pure function of one scroll progress value (0 night, 1 paper).
 * The React component reads the scroll position, calls `sceneFrame`, and paints the result.
 */

/** The eight luck pillars of the sample chart, ages 6 to 85. */
export const LUCK_PILLARS = [
  { han: "丁亥", from: 6, to: 15 },
  { han: "丙戌", from: 16, to: 25 },
  { han: "乙酉", from: 26, to: 35 },
  { han: "甲申", from: 36, to: 45 },
  { han: "癸未", from: 46, to: 55 },
  { han: "壬午", from: 56, to: 65 },
  { han: "辛巳", from: 66, to: 75 },
  { han: "庚辰", from: 76, to: 85 },
] as const;

/** The four pillars of the sample chart: year, month, day, hour. */
export const SAMPLE_PILLARS = ["乙亥", "戊子", "甲午", "庚午"] as const;

/** Ages of the eight character frames in public/fengshui/char, as age-NN.webp (age 1 is the crawling child). */
export const FRAME_AGES = [0, 1, 12, 22, 34, 45, 62, 80] as const;

export const LIFE_SPAN = 85;

/**
 * How far through the walk (0 to 1) each frame age is reached. The stops are not evenly spread: the first years get a
 * generous share, so the crawling child is on screen long enough to be seen, and every frame holds for a while.
 */
const AGE_STOPS: ReadonlyArray<readonly [walk: number, age: number]> = [
  [0, 0],
  [0.1, 1],
  [0.26, 12],
  [0.4, 22],
  [0.54, 34],
  [0.67, 45],
  [0.82, 62],
  [0.96, 80],
  [1, LIFE_SPAN],
];

/** Age (0 to 85) at a point of the walk: straight lines between the stops, so every frame keeps its share of the scroll. */
export function ageAtWalk(walk: number): number {
  const t = clamp(walk, 0, 1);
  for (let i = 1; i < AGE_STOPS.length; i += 1) {
    const [w1, a1] = AGE_STOPS[i]!;
    if (t <= w1) {
      const [w0, a0] = AGE_STOPS[i - 1]!;
      return lerp(a0, a1, (t - w0) / (w1 - w0));
    }
  }
  return LIFE_SPAN;
}

export interface Point {
  x: number;
  y: number;
}

export interface SceneGeometry {
  width: number;
  height: number;
  groundY: number;
  /** Where the star lands and the figure starts walking. */
  startX: number;
  /** Where the figure ends the walk. */
  endX: number;
}

export function sceneGeometry(width: number, height: number): SceneGeometry {
  return { width, height, groundY: Math.round(height * 0.8), startX: width * 0.12, endX: width * 0.9 };
}

/** The curve the guiding star follows: four control points of a cubic Bézier curve. */
export function starCurve(g: SceneGeometry): readonly [Point, Point, Point, Point] {
  return [
    { x: g.width * 0.64, y: g.height * 0.2 },
    { x: g.width * 0.92, y: g.height * 0.38 },
    { x: g.width * 0.34, y: g.height * 0.46 },
    { x: g.startX, y: g.groundY - 80 },
  ];
}

export function bezier(curve: readonly [Point, Point, Point, Point], u: number): Point {
  const t = clamp(u, 0, 1);
  const v = 1 - t;
  const [a, b, c, d] = curve;
  return {
    x: v * v * v * a.x + 3 * v * v * t * b.x + 3 * v * t * t * c.x + t * t * t * d.x,
    y: v * v * v * a.y + 3 * v * v * t * b.y + 3 * v * t * t * c.y + t * t * t * d.y,
  };
}

export interface SceneFrame {
  progress: number;
  day: DayState;
  /** Opacity of the nebula photo (screen blend) and of its sepia twin (multiply blend). */
  nebulaOpacity: number;
  inkWashOpacity: number;
  /** Dusk darkening at the top of the sky and the warm glow at the horizon. */
  vignette: number;
  glow: number;
  starfieldAlpha: number;
  star: {
    /** 0 at the start of the fall, 1 at the landing. */
    fall: number;
    point: Point;
    radius: number;
    alpha: number;
    /** 0 before the landing, 1 once the star has melted into the newborn. */
    landed: number;
    ring: number;
    halo: number;
    labelOpacity: number;
  };
  sun: { size: number; top: number; opacity: number; color: RGB; glowAlpha: number };
  texts: { first: number; second: number; third: number };
  sealOpacity: readonly [number, number, number, number];
  /** 0 hidden, 1 fully visible newborn and figure. */
  figureVisible: number;
  age: number;
  figureX: number;
  /** Which two character frames to show and how much of the second. */
  blend: FrameBlend;
  /** Luck pillar tick marks that have been reached. */
  marksReached: readonly boolean[];
  trailVisible: number;
}

export function sceneFrame(progress: number, g: SceneGeometry, appearance: Appearance = "light"): SceneFrame {
  const p = clamp(progress, 0, 1);
  const day = dayState(p, appearance);

  const fall = smoothstep(seg(p, 0.06, 0.44));
  const landed = smoothstep(seg(p, 0.44, 0.5));
  const curve = starCurve(g);
  const point = bezier(curve, fall);
  const ringProgress = seg(p, 0.43, 0.58);

  const rise = smoothstep(seg(p, 0.16, 0.52));
  const climb = smoothstep(seg(p, 0.62, 0.92));
  const warm = smoothstep(seg(p, 0.46, 0.7));
  const sunSize = lerp(200, 300, smoothstep(seg(p, 0.5, 0.8)));
  const sunLow = lerp(g.height * 1.05, g.groundY - sunSize * 0.62, rise);

  const figureVisible = smoothstep(seg(p, 0.46, 0.54));
  const walk = seg(p, 0.62, 0.98);
  const age = ageAtWalk(walk);
  const figureX = lerp(g.startX, g.endX, age / LIFE_SPAN);

  const seal = (i: number): number => smoothstep(seg(p, 0.5 + i * 0.025, 0.58 + i * 0.025));
  const sealOpacity: SceneFrame["sealOpacity"] = [seal(0), seal(1), seal(2), seal(3)];

  return {
    progress: p,
    day,
    nebulaOpacity: 1 - smoothstep(seg(p, 0.08, 0.55)),
    // The ink wash belongs to the paper ending; the dark ending has none.
    inkWashOpacity: appearance === "dark" ? 0 : 0.16 * smoothstep(seg(p, 0.5, 0.78)),
    vignette: smoothstep(seg(p, 0.2, 0.38)) * (1 - smoothstep(seg(p, 0.5, 0.68))),
    glow: smoothstep(seg(p, 0.3, 0.5)) * (1 - smoothstep(seg(p, 0.58, 0.74))),
    starfieldAlpha: 1 - smoothstep(seg(p, 0.08, 0.5)),
    star: {
      fall,
      point,
      radius: lerp(3.4, 6.5, fall) * (1 - 0.7 * landed),
      alpha: 1 - smoothstep(seg(p, 0.46, 0.52)),
      landed,
      ring: ringProgress > 0 && ringProgress < 1 ? ringProgress : 0,
      halo: smoothstep(seg(p, 0.45, 0.52)) * (1 - smoothstep(seg(p, 0.52, 0.66))),
      labelOpacity: smoothstep(seg(p, 0.02, 0.08)) * (1 - smoothstep(seg(p, 0.14, 0.2))),
    },
    sun: {
      size: sunSize,
      top: lerp(sunLow, g.height * 0.3 - sunSize / 2, climb),
      // On paper the sun stays as a faint disc; on the dark ending it sets completely.
      opacity: 0.95 * clamp(rise * 3, 0, 1) * lerp(1, appearance === "dark" ? 0 : 0.13, smoothstep(seg(p, 0.56, 0.8))),
      color: lerpColor([246, 208, 120], [196, 84, 52], warm),
      glowAlpha: 0.42 * (1 - climb) * (1 - warm),
    },
    texts: {
      first: 1 - smoothstep(seg(p, 0.04, 0.2)),
      second: smoothstep(seg(p, 0.56, 0.64)) * (1 - smoothstep(seg(p, 0.72, 0.78))),
      third: smoothstep(seg(p, 0.8, 0.88)),
    },
    sealOpacity,
    figureVisible,
    age,
    figureX,
    blend: blendFrames(age, FRAME_AGES),
    marksReached: LUCK_PILLARS.map((pillar) => age >= pillar.from - 1),
    trailVisible: figureVisible,
  };
}

/** Where a luck pillar's tick sits on the ground line. */
export function luckMarkX(g: SceneGeometry, from: number): number {
  return lerp(g.startX, g.endX, from / LIFE_SPAN);
}

/**
 * Scroll progress of a tall wrapper that holds a sticky stage: 0 while its top is below the viewport top,
 * 1 once its bottom reaches the viewport bottom.
 */
export function pinProgress(wrapperTop: number, wrapperHeight: number, viewportHeight: number): number {
  const range = wrapperHeight - viewportHeight;
  if (range <= 0) return 0;
  return clamp(-wrapperTop / range, 0, 1);
}

/** One step of easing a displayed value toward its target so fast scrolling still feels smooth. */
export function easeToward(current: number, target: number, factor = 0.14, epsilon = 0.0004): number {
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < epsilon ? target : next;
}
