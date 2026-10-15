"use client";

import { useEffect, useRef } from "react";
import { init } from "@kit";
import { consumeWarpArrival } from "@/components/gateway/warpArrival";
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

/**
 * Starts the shared kit's global effects for the Feng Shui world and stops them when the page unmounts. This site is a
 * night sky, so the covers (opening seal, slats) are dark with gold, unlike the paper of the Ba-zi site. A visitor who
 * arrives through the gateway's warp has just seen an opening, so the seal is skipped for them.
 */
export function KitMount() {
  // Read once per visit: a development re-run of the effect must not find the note already gone.
  const warped = useRef<boolean | null>(null);
  useEffect(() => {
    if (warped.current === null) warped.current = consumeWarpArrival(window.location.pathname);
    const kit = init({ family: SISTER_ORIGINS, transitionPaths: KIT_PATHS, theme: "night", effects: { clock: false, cursor: CURSOR_TRIAL, seal: !warped.current } });
    return () => kit.destroy();
  }, []);
  return null;
}
