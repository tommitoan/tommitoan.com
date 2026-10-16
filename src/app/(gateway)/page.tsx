import { preload } from "react-dom";
import { createMetadata } from "@/lib/metadata";
import { SpaceGatewayHome } from "@/components/gateway/space-gateway-home";

export const metadata = createMetadata({
  path: "/",
});

export default function HomePage() {
  // What the loader waits for starts downloading with the page, before the scripts have run.
  preload("/gateway/backgrounds/space-bg.webp", { as: "image", fetchPriority: "high" });
  preload("/gateway/characters/astronaut.webp", { as: "image" });
  return (
    <>
      <h1 className="sr-only">Toan Ngo — tommitoan</h1>
      <SpaceGatewayHome />
    </>
  );
}
