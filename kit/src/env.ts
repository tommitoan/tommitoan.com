/** Motion tier: how much animation the visitor's device and settings allow. */
export type Tier = "full" | "subtle" | "off";

export interface EnvSignals {
  reducedMotion: boolean;
  saveData?: boolean;
  /** Logical CPU cores, when the browser reports them. */
  cores?: number;
  /** Device memory in GB (Chromium only). */
  memory?: number;
}

/** Pure decision, so it can be tested: reduced motion wins, then weak or data-saving devices drop to subtle. */
export function resolveTier(signals: EnvSignals): Tier {
  if (signals.reducedMotion) return "off";
  if (signals.saveData) return "subtle";
  if (signals.memory !== undefined && signals.memory <= 2) return "subtle";
  if (signals.cores !== undefined && signals.cores <= 2) return "subtle";
  return "full";
}

interface NavigatorHints {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: { saveData?: boolean };
}

export function readEnv(win: Window = window): EnvSignals {
  const nav = win.navigator as Navigator & NavigatorHints;
  return {
    reducedMotion: win.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    cores: nav.hardwareConcurrency,
    memory: nav.deviceMemory,
  };
}

export const detectTier = (win: Window = window): Tier => resolveTier(readEnv(win));

/** True on devices with a mouse or trackpad; pointer effects (magnetic buttons, cursor) need it. */
export const hasFinePointer = (win: Window = window): boolean => win.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Calls back when the visitor changes the reduced-motion setting while the page is open. Returns a cleanup. */
export function watchReducedMotion(onChange: () => void, win: Window = window): () => void {
  const query = win.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
