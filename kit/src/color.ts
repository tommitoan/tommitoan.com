/** Colour and easing math shared by the day cycle and the effects. Pure functions, no DOM. */

export type RGB = readonly [number, number, number];

export const clamp = (x: number, min: number, max: number): number => Math.max(min, Math.min(max, x));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Smooth ease between 0 and 1 (zero slope at both ends). */
export const smoothstep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

/** Share of `p` that lies between `a` and `b`, clamped to 0..1. */
export const seg = (p: number, a: number, b: number): number => clamp((p - a) / (b - a), 0, 1);

export const lerpColor = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Perceived brightness, 0 (black) to 255 (white). */
export const luminance = (c: RGB): number => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

export const rgbString = (c: RGB): string => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;

export const NIGHT: RGB = [12, 16, 36];
export const PAPER: RGB = [243, 234, 215];
export const INK: RGB = [59, 47, 32];
export const MOON: RGB = [238, 232, 255];
export const MUTED_NIGHT: RGB = [167, 159, 196];
export const MUTED_DAY: RGB = [102, 85, 63];
/** Where the journey ends in the dark appearance: a deep ink-blue, not paper. */
export const INK_NIGHT: RGB = [20, 22, 46];

/** The two looks of the journey: it ends on paper (light) or on deep ink (dark). The night it starts from is the same. */
export type Appearance = "light" | "dark";

/** Sky colour at a progress value: night, dusk, dawn, golden morning, paper. */
export const DAY_STOPS: ReadonlyArray<readonly [number, RGB]> = [
  [0, NIGHT],
  [0.28, [28, 28, 74]],
  [0.42, [84, 64, 124]],
  [0.5, [226, 140, 120]],
  [0.6, [248, 208, 152]],
  [0.72, PAPER],
];

/**
 * The dark appearance keeps the dusk and a toned-down rose dawn, then settles on deep ink instead of rising to paper, so a visitor
 * who chose a dark look is never lit up by a page that turns white.
 */
export const DARK_DAY_STOPS: ReadonlyArray<readonly [number, RGB]> = [
  [0, NIGHT],
  [0.28, [28, 28, 74]],
  [0.42, [84, 64, 124]],
  [0.5, [150, 92, 110]],
  [0.6, [60, 46, 96]],
  [0.72, INK_NIGHT],
];

export function skyColor(progress: number, appearance: Appearance = "light"): RGB {
  const stops = appearance === "dark" ? DARK_DAY_STOPS : DAY_STOPS;
  const p = clamp(progress, 0, 1);
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (p <= p1) return lerpColor(c0, c1, smoothstep(seg(p, p0, p1)));
  }
  return stops[stops.length - 1][1];
}

/** 0 when text must be light, 1 when it must be dark ink, switching around mid brightness. */
export const textMix = (lum: number): number => smoothstep(seg(lum, 100, 140));

/**
 * How opaque the sky is. The light look is always opaque. The dark look lets the sky thin out as the journey settles, so a page
 * that has its own background behind (a galaxy, for instance) shows through at the end instead of meeting a flat colour.
 */
export function skyAlpha(progress: number, appearance: Appearance = "light"): number {
  return appearance === "dark" ? 1 - smoothstep(seg(progress, 0.5, 0.75)) : 1;
}

export interface DayState {
  progress: number;
  sky: RGB;
  luminance: number;
  textMix: number;
  fg: RGB;
  muted: RGB;
}

/** Everything the page needs for one position of the day cycle (0 night, 1 paper). */
export function dayState(progress: number, appearance: Appearance = "light"): DayState {
  const p = clamp(progress, 0, 1);
  const sky = skyColor(p, appearance);
  const lum = luminance(sky);
  // The dark look never gets a sky bright enough for dark text: the text stays light all the way.
  const mix = appearance === "dark" ? 0 : textMix(lum);
  return {
    progress: p,
    sky,
    luminance: lum,
    textMix: mix,
    fg: lerpColor(MOON, INK, mix),
    muted: lerpColor(MUTED_NIGHT, MUTED_DAY, mix),
  };
}
