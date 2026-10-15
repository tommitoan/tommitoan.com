import { mountClock, type Locale } from "./clock";
import { detectTier, hasFinePointer, watchReducedMotion, type Tier } from "./env";
import { mountCursor } from "./cursor";
import { mountDrift } from "./drift";
import { mountDust } from "./dust";
import { mountLife } from "./life";
import { mountMagnetic } from "./magnetic";
import { shouldPlaySeal } from "./navigation";
import { mountDots, mountProgress, type Mounted } from "./progress";
import { mountReveal } from "./reveal";
import { createSmoothScroll, watchModals, type SmoothScroll } from "./scroll";
import { playSeal } from "./seal";
import { applyTheme, resolveTheme, type Theme } from "./theme";
import { createTransitions, type Transitions } from "./transition";
import { KIT_VERSION } from "./version";
import { mountWash } from "./wash";

export type EffectName = "transition" | "seal" | "reveal" | "wash" | "clock" | "progress" | "dots" | "magnetic" | "smooth" | "cursor" | "dust" | "drift" | "life";

export interface KitOptions {
  /** Origins that share this look, for the cross-site transition. This site's own origin is always included. */
  family?: readonly string[];
  /**
   * Same-origin paths whose pages also run the kit, for example ["/fengshui"]. Only links to these (and to the
   * sister origins in `family`) get the cover animation. Leave it out to cover every same-origin link.
   */
  transitionPaths?: readonly string[];
  /** Force a motion tier. By default it follows the visitor's settings and device. */
  tier?: Tier;
  /** The look of the covers (opening seal, slats, boot guard): "paper" (default) or "night". */
  theme?: Theme;
  locale?: Locale;
  /** Text and glyph of the opening seal. */
  seal?: { glyph?: string; tagline?: string };
  /** Turn single effects off with `false`. Everything is on by default except `cursor`, which a page must switch on with `true`. */
  effects?: Partial<Record<EffectName, boolean>>;
}

export interface Kit {
  readonly version: string;
  readonly tier: Tier;
  /** Resolves when the opening seal or the arrival reveal starts lifting; start your own page entrance then. */
  readonly ready: Promise<void>;
  readonly smooth: SmoothScroll | null;
  readonly transitions: Transitions | null;
  /** Builds the section dots again, for a page that adds or removes [data-kit-section] after the kit started. */
  refresh(): void;
  destroy(): void;
}

/**
 * Starts the global effects. Opt-in hooks are plain attributes: data-kit-reveal (headings),
 * data-kit-section="Label" (progress dots), data-kit-clock (hour clock), data-kit-magnetic (buttons),
 * data-kit-dust="glyph" (ink dust), data-kit-drift (drifting cards), data-kit-life (growing figure).
 */
export function init(options: KitOptions = {}): Kit {
  const tier = options.tier ?? detectTier();
  const finePointer = hasFinePointer();
  const restoreTheme = applyTheme(resolveTheme(options.theme));
  const on = (name: EffectName): boolean => options.effects?.[name] !== false;
  const family = [window.location.origin, ...(options.family ?? [])];
  const cleanups: Array<() => void> = [restoreTheme];
  const track = (mounted: Mounted | null | undefined): void => {
    if (mounted) cleanups.push(() => mounted.destroy());
  };

  const navType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type ?? "navigate";
  const transitions = tier !== "off" && on("transition") ? createTransitions({ family, tier, sameOriginPaths: options.transitionPaths }) : null;
  if (transitions) cleanups.push(() => transitions.destroy());

  // Arrival first: it decides synchronously and, when it plays, already covers the page.
  const arrival = transitions?.prepareArrival() ?? null;
  const seal = !arrival?.plays && on("seal") && shouldPlaySeal(navType, tier, false) ? playSeal({ tier, glyph: options.seal?.glyph, tagline: options.seal?.tagline }) : null;
  document.documentElement.classList.remove("kit-pending");

  let ready: Promise<void> = Promise.resolve();
  if (seal) ready = seal.lifting;
  else if (arrival?.plays) ready = arrival.run();

  let smooth: SmoothScroll | null = null;
  if (on("smooth") && tier === "full" && finePointer) {
    smooth = createSmoothScroll();
    const engine = smooth;
    cleanups.push(() => engine.destroy());
    cleanups.push(watchModals((open) => (open ? engine.stop() : engine.start())));
  }

  if (on("wash")) track(mountWash(tier));
  if (on("reveal")) track(mountReveal({ tier, after: ready }));
  if (on("clock")) track(mountClock(options.locale ?? "vi"));
  if (on("progress")) track(mountProgress());
  let dots: Mounted | null = null;
  const mountSectionDots = (): void => {
    dots?.destroy();
    dots = on("dots") ? mountDots({ tier, smooth: smooth ?? undefined }) : null;
  };
  mountSectionDots();
  cleanups.push(() => dots?.destroy());
  if (on("magnetic")) track(mountMagnetic(tier, finePointer));
  if (on("dust")) track(mountDust(tier));
  if (on("drift")) track(mountDrift(tier, ready));
  if (on("life")) track(mountLife(tier, ready));
  // The pointer ring is opt-in: only a page that sets effects.cursor to true gets it.
  track(mountCursor(tier, finePointer, options.effects?.cursor === true));

  let destroyed = false;
  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    stopWatching();
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
  // Turning reduced motion on while the page is open removes every effect.
  const stopWatching = watchReducedMotion(() => {
    if (detectTier() === "off") destroy();
  });

  const refresh = (): void => {
    if (!destroyed) mountSectionDots();
  };

  return { version: KIT_VERSION, tier, ready, smooth, transitions, refresh, destroy };
}

export { KIT_VERSION as version } from "./version";
export { blendFrames } from "./keyframes";
export { createDayCycle } from "./day-cycle";
export { clamp, lerp, smoothstep, seg, skyColor, dayState } from "./color";
export { solarLongitude, solarTerm, monthBranch, baziYear, ganzhiYear } from "./solar";
export { shichen } from "./shichen";
export { resolveTheme } from "./theme";
export type { Theme } from "./theme";
export { createSmoothScroll } from "./scroll";
export { playSeal } from "./seal";
export { createTransitions } from "./transition";
export { splitWords } from "./reveal";
export { detectTier, resolveTier } from "./env";
export type { Tier } from "./env";
