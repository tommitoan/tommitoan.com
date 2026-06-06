import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { DiscoverHeroSection } from "@/components/discover/sections/DiscoverHeroSection";
import { DiscoverHomelabSection } from "@/components/discover/sections/DiscoverHomelabSection";
import { DiscoverServicesGrid } from "@/components/discover/sections/DiscoverServicesGrid";
import { DiscoverExperimentsSection } from "@/components/discover/sections/DiscoverExperimentsSection";
import { DiscoverChannelsSection } from "@/components/discover/sections/DiscoverChannelsSection";

export const metadata = createMetadata({
  title: "Discover",
  description:
    "The personal operating system of Toan Ngo — homelab infrastructure, self-hosted services, open-source experiments, and the broader ecosystem behind the backend work.",
  path: "/discover/",
  keywords: [
    "homelab", "k3s", "GitOps", "self-hosting", "Argo CD",
    "Prometheus", "Grafana", "Cloudflared", "Toan Ngo", "tommitoan",
  ],
});

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Discover — Tommi Toan",
  description:
    "Homelab infrastructure, self-hosted services, experiments, and channels.",
  url: "https://tommitoan.com/discover/",
};

export default function DiscoverPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <StarsBackgroundClient gateway={false} />
      <PageShell className="space-y-24 pb-24 pt-10 md:space-y-32 md:pb-32 md:pt-14">
        <DiscoverHeroSection />
        <DiscoverHomelabSection />
        <DiscoverServicesGrid />
        <DiscoverExperimentsSection />
        <DiscoverChannelsSection />
      </PageShell>
    </>
  );
}
