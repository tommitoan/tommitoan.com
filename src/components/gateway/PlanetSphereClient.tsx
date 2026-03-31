"use client";

import dynamic from "next/dynamic";
import type { PlanetTextures } from "@/components/gateway/PlanetSphere";

const PlanetSphere = dynamic(
  () => import("@/components/gateway/PlanetSphere").then((m) => m.PlanetSphere),
  { ssr: false }
);

interface Props extends PlanetTextures {
  isHovered: boolean;
  onReady?: () => void;
}

export function PlanetSphereClient(props: Props) {
  return <PlanetSphere {...props} />;
}
