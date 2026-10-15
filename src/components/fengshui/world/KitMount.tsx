"use client";

import { useEffect } from "react";
import { init } from "@kit";
import { BAZI_ORIGIN } from "@/lib/sister-site";

/** The sister site that shares this look; links to it get the cover animation and it opens with the reveal. */
const SISTER_ORIGINS = [BAZI_ORIGIN] as const;

/**
 * Effect 20, the pointer ring, is a trial until the owner decides: it is off unless the site is built with
 * NEXT_PUBLIC_KIT_CURSOR=1 (for example `NEXT_PUBLIC_KIT_CURSOR=1 pnpm dev`).
 */
const CURSOR_TRIAL = process.env.NEXT_PUBLIC_KIT_CURSOR === "1";

/** Pages of this site that also run the kit. Links to other pages (the gateway, /tech) are left alone. */
const KIT_PATHS = ["/fengshui"] as const;

/** Starts the shared kit's global effects for the Feng Shui world and stops them when the page unmounts. */
export function KitMount() {
  useEffect(() => {
    const kit = init({ family: SISTER_ORIGINS, transitionPaths: KIT_PATHS, effects: { clock: false, cursor: CURSOR_TRIAL } });
    return () => kit.destroy();
  }, []);
  return null;
}
