"use client";

import dynamic from "next/dynamic";
import type { GatewayStarsConfig } from "@/components/gateway/gatewayHomeConfig";

const StarsBackground = dynamic(
  () => import("@/components/tech/StarsBackground").then((m) => m.StarsBackground),
  { ssr: false }
);

export function StarsBackgroundClient({ absolute = false, gateway = false, starsConfig, zIndex }: { absolute?: boolean; gateway?: boolean; starsConfig?: GatewayStarsConfig; zIndex?: number }) {
  return <StarsBackground absolute={absolute} gateway={gateway} starsConfig={starsConfig} zIndex={zIndex} />;
}
