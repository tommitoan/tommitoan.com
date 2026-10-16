import { createMetadata } from "@/lib/metadata";
import { FengShuiPageTitle } from "@/components/fengshui/sections/FengShuiPageTitle";
import { FengShuiBasicsSection } from "@/components/fengshui/sections/FengShuiBasicsSection";
import { FengShuiPillarsSection } from "@/components/fengshui/sections/FengShuiPillarsSection";
import { FengShuiLanesSection } from "@/components/fengshui/sections/FengShuiLanesSection";
import { FengShuiPrinciplesSection } from "@/components/fengshui/sections/FengShuiPrinciplesSection";
import { FengShuiLinksSection } from "@/components/fengshui/sections/FengShuiLinksSection";
import { BirthScene } from "@/components/fengshui/world/BirthScene";
import { DayMaster } from "@/components/fengshui/world/DayMaster";
import { NaYin } from "@/components/fengshui/world/NaYin";
import { Marquee } from "@/components/fengshui/world/Marquee";
import { SolarDial } from "@/components/fengshui/world/SolarDial";
import { Anatomy } from "@/components/fengshui/world/Anatomy";
import { Branches } from "@/components/fengshui/world/Branches";
import { StorySection } from "@/components/fengshui/world/StorySection";

export const metadata = createMetadata({
  title: "Feng Shui",
  description:
    "Feng Shui tools and digital products by Toan Ngo — including Bazica, an open-source Go library for Ba-zi Four Pillars of Destiny calculations, and the live Bazica Web app at bazi.tommitoan.com. / Công cụ phong thuỷ và Bát Tự: thư viện Bazica và trang Bazica Web.",
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
  inLanguage: ["vi", "en"],
  significantLink: "https://bazi.tommitoan.com/",
};

export default function FengShuiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <FengShuiPageTitle />
      <BirthScene />
      <StorySection />
      <SolarDial />
      <DayMaster />
      <Branches />
      <Anatomy />
      <Marquee />
      <NaYin />
      <FengShuiBasicsSection />
      <FengShuiPillarsSection />
      <FengShuiLanesSection />
      <FengShuiPrinciplesSection />
      <FengShuiLinksSection />
    </>
  );
}
