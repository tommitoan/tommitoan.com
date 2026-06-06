import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { FengShuiHeroSection } from "@/components/fengshui/sections/FengShuiHeroSection";
import { FengShuiIntroSection } from "@/components/fengshui/sections/FengShuiIntroSection";
import { FengShuiPillarsSection } from "@/components/fengshui/sections/FengShuiPillarsSection";
import { FengShuiLanesSection } from "@/components/fengshui/sections/FengShuiLanesSection";
import { FengShuiPrinciplesSection } from "@/components/fengshui/sections/FengShuiPrinciplesSection";
import { FengShuiLinksSection } from "@/components/fengshui/sections/FengShuiLinksSection";

export const metadata = createMetadata({
  title: "Feng Shui",
  description:
    "Feng Shui tools and digital products by Toan Ngo — including Bazica, an open-source Go library for Ba-zi Four Pillars of Destiny calculations.",
  path: "/fengshui/",
  keywords: [
    "Feng Shui", "Ba-zi", "Four Pillars", "bazica",
    "Chinese astrology", "Toan Ngo", "tommitoan", "Go library",
  ],
});

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Feng Shui — Tommi Toan",
  description:
    "Feng Shui tools and digital products — Ba-zi, calendar systems, and symbolic software.",
  url: "https://tommitoan.com/fengshui/",
};

export default function FengShuiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <StarsBackgroundClient gateway={false} />
      <PageShell className="space-y-24 pb-24 pt-10 md:space-y-32 md:pb-32 md:pt-14">
        <FengShuiHeroSection />
        <FengShuiIntroSection />
        <FengShuiPillarsSection />
        <FengShuiLanesSection />
        <FengShuiPrinciplesSection />
        <FengShuiLinksSection />
      </PageShell>
    </>
  );
}
