import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { StarsBackgroundClient } from "@/components/tech/StarsBackgroundClient";
import { techPageStarsConfig } from "@/components/tech/techPageConfig";
import { TechHeroSection } from "@/components/tech/sections/TechHeroSection";
import { TechAboutSection } from "@/components/tech/sections/TechAboutSection";
import { TechSkillsSection } from "@/components/tech/sections/TechSkillsSection";
import { TechExperienceSection } from "@/components/tech/sections/TechExperienceSection";
import { TechEducationSection } from "@/components/tech/sections/TechEducationSection";
import { TechProjectsSection } from "@/components/tech/sections/TechProjectsSection";
import { TechContactSection } from "@/components/tech/sections/TechContactSection";
import { TechTableOfContents } from "@/components/tech/TechTableOfContents";

export const metadata = createMetadata({
  title: "Tech",
  description: "Go backend engineering, platform thinking, and durable delivery flow.",
  path: "/tech/",
});

export default function TechPage() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-30"
        style={{
          backgroundImage: "url('/gateway/backgrounds/tech-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <StarsBackgroundClient gateway starsConfig={techPageStarsConfig} zIndex={-1} />
      <TechTableOfContents />
      <PageShell className="space-y-24 pb-24 pt-10 md:space-y-32 md:pb-32 md:pt-14">
        <TechHeroSection />
        <TechAboutSection />
        <TechSkillsSection />
        <TechExperienceSection />
        <TechEducationSection />
        <TechProjectsSection />
        <TechContactSection />
      </PageShell>
    </>
  );
}
