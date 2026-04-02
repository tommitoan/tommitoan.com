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
  description: "Toan Ngo — Go backend engineer with 4+ years across B2B gaming, CRM, and SaaS. AWS Certified Solutions Architect. Microservices, gRPC, Kubernetes, GitOps, and event-driven architecture.",
  path: "/tech/",
  keywords: [
    "Toan Ngo", "tommitoan", "Go", "Golang", "gRPC", "Protobuf", "backend engineer",
    "microservices", "Kubernetes", "AWS Certified", "event-driven", "GitOps", "ArgoCD",
    "PostgreSQL", "Redis", "Kafka", "RabbitMQ", "software engineer", "Ho Chi Minh City",
  ],
  image: {
    url: "/social-card-tech.png",
    width: 1536,
    height: 1024,
    alt: "Toan Ngo — Go Backend Engineer",
  },
});

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "Tech — Toan Ngo",
  description: "Go backend engineer profile: experience, skills, education, and projects.",
  url: "https://tommitoan.com/tech/",
  mainEntity: {
    "@type": "Person",
    name: "Toan Ngo",
    url: "https://tommitoan.com",
    jobTitle: "Software Engineer",
    knowsAbout: ["Go", "gRPC", "Microservices", "Kubernetes", "AWS", "GCP", "GitOps"],
  },
};

export default function TechPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
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
