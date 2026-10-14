import type { Tier } from "./env";

/** Pure rules for the page transition between pages and between the two sites. No DOM. */

export function originOf(url: string, base?: string): string | null {
  try {
    const parsed = new URL(url, base);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin.toLowerCase();
  } catch {
    return null;
  }
}

const normalise = (origins: readonly string[]): string[] => origins.map((o) => o.replace(/\/+$/, "").toLowerCase());

export interface ClickInfo {
  href: string;
  currentHref: string;
  /** Origins that belong to the same look (for example the two sites). */
  family: readonly string[];
  tier: Tier;
  button: number;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  target?: string | null;
  download?: boolean;
  defaultPrevented?: boolean;
}

/**
 * Play the cover animation before navigating?
 * No for reduced motion, modified clicks, new tabs and downloads, links that carry a fragment
 * (share links such as /chart#d=...), links to the same page, and links to unrelated origins.
 */
export function shouldCoverNavigation(click: ClickInfo): boolean {
  if (click.tier === "off") return false;
  if (click.defaultPrevented) return false;
  if (click.button !== 0 || click.ctrl || click.meta || click.shift || click.alt) return false;
  if (click.download) return false;
  if (click.target && click.target !== "_self") return false;
  let destination: URL;
  let current: URL;
  try {
    destination = new URL(click.href, click.currentHref);
    current = new URL(click.currentHref);
  } catch {
    return false;
  }
  if (destination.protocol !== "http:" && destination.protocol !== "https:") return false;
  if (destination.hash !== "") return false;
  if (destination.origin === current.origin && destination.pathname === current.pathname && destination.search === current.search) return false;
  const allowed = new Set([current.origin.toLowerCase(), ...normalise(click.family)]);
  return allowed.has(destination.origin.toLowerCase());
}

export interface ArrivalInfo {
  referrer: string;
  currentHref: string;
  family: readonly string[];
  /** Navigation Timing type: navigate, reload, back_forward or prerender. */
  navType: string;
  tier: Tier;
  /** True when this site started the navigation itself shortly before (stored flag). */
  startedHere: boolean;
}

/**
 * Open the page with the reveal animation?
 * Only for a normal navigation (not reload or back/forward), without a fragment in the address,
 * and when the visitor came from this site's own cover animation or from the sister site.
 */
export function shouldRevealArrival(arrival: ArrivalInfo): boolean {
  if (arrival.tier === "off") return false;
  if (arrival.navType !== "navigate") return false;
  let current: URL;
  try {
    current = new URL(arrival.currentHref);
  } catch {
    return false;
  }
  if (current.hash !== "") return false;
  if (arrival.startedHere) return true;
  const from = originOf(arrival.referrer);
  if (!from || from === current.origin.toLowerCase()) return false;
  return normalise(arrival.family).includes(from);
}

/** Opening seal on a fresh load: yes for a normal visit or a reload, not for back/forward, not when a reveal plays. */
export function shouldPlaySeal(navType: string, tier: Tier, revealPlays: boolean): boolean {
  if (tier === "off" || revealPlays) return false;
  return navType === "navigate" || navType === "reload";
}
