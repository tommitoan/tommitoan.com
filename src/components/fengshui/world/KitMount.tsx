"use client";

import { useEffect } from "react";
import { init } from "@kit";

/** The sister site that shares this look; links to it get the cover animation and it opens with the reveal. */
const SISTER_ORIGINS = ["https://bazi.tommitoan.com"] as const;

/** Pages of this site that also run the kit. Links to other pages (the gateway, /tech) are left alone. */
const KIT_PATHS = ["/fengshui"] as const;

/** Starts the shared kit's global effects for the Feng Shui world and stops them when the page unmounts. */
export function KitMount() {
  useEffect(() => {
    const kit = init({ family: SISTER_ORIGINS, transitionPaths: KIT_PATHS, effects: { clock: false } });
    return () => kit.destroy();
  }, []);
  return null;
}
