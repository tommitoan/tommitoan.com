import { createMetadata } from "@/lib/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { TechHeroSection } from "@/components/tech/sections/TechHeroSection";
import { TechAboutSection } from "@/components/tech/sections/TechAboutSection";
import { TechSkillsSection } from "@/components/tech/sections/TechSkillsSection";
import { TechExperienceSection } from "@/components/tech/sections/TechExperienceSection";
import { TechEducationSection } from "@/components/tech/sections/TechEducationSection";
import { TechProjectsSection } from "@/components/tech/sections/TechProjectsSection";
import { TechContactSection } from "@/components/tech/sections/TechContactSection";

export const metadata = createMetadata({
  title: "Tech",
  description: "Go backend engineering, platform thinking, and durable delivery flow.",
  path: "/tech/",
});

export default function TechPage() {
  return (
    <PageShell className="space-y-24 pb-24 pt-10 md:space-y-32 md:pb-32 md:pt-14">
      <TechHeroSection />
      <TechAboutSection />
      <TechSkillsSection />
      <TechExperienceSection />
      <TechEducationSection />
      <TechProjectsSection />
      <TechContactSection />
    </PageShell>
  );
}
