"use client";

import dynamic from "next/dynamic";

const StarsBackground = dynamic(
  () => import("@/components/tech/StarsBackground").then((m) => m.StarsBackground),
  { ssr: false }
);

export function StarsBackgroundClient({ absolute = false, gateway = false }: { absolute?: boolean; gateway?: boolean }) {
  return <StarsBackground absolute={absolute} gateway={gateway} />;
}
