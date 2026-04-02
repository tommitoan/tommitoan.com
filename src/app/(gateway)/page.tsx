import { createMetadata } from "@/lib/metadata";
import { SpaceGatewayHome } from "@/components/gateway/space-gateway-home";

export const metadata = createMetadata({
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Toan Ngo — tommitoan</h1>
      <SpaceGatewayHome />
    </>
  );
}
