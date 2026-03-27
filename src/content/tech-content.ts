export type TechMetric = {
  value: string;
  label: string;
};

export type TechExperience = {
  company: string;
  location: string;
  period: string;
  role: string;
  bullets: string[];
};

export type TechProject = {
  name: string;
  summary: string;
  impact: string;
  stack: string[];
  href?: string;
  image?: string;
  liveHref?: string;
};

export type TechSkillGroup = {
  title: string;
  items: string[];
};

export type TechEducationItem = {
  title: string;
  subtitle: string;
  date: string;
};

export const techContent = {
  eyebrow: "Tech",
  title: "Go backend engineering, platform thinking, and durable delivery flow.",
  description:
    "This route brings the CV world into tommitoan.com: backend systems, cloud and GitOps experience, and the project proof that supports it.",
  highlights: ["Go and gRPC", "Cloud-native delivery", "Observability and platform work"],
  metrics: [
    { value: "4+", label: "Years building" },
    { value: "120+", label: "Service environment" },
    { value: "AWS", label: "Certified SAA" },
  ] satisfies TechMetric[],
  about: [
    "I build backend systems that are fast, observable, and maintainable. Most of my work lives in Go microservices, delivery pipelines, and the architecture around them.",
    "I work across Kubernetes, GitOps, tracing, messaging systems, and internal tooling, with a strong bias toward practical systems that stay easy to operate over time.",
    "When needed, I also move up and down the stack: aligning with product needs, shaping API contracts, and contributing enough frontend to make internal or public tools feel complete.",
  ],
  strengths: [
    {
      title: "Backend Engineering",
      description: "Go microservices, gRPC APIs, event-driven systems, caching, and patterns that scale without turning into a maze.",
    },
    {
      title: "Cloud and Delivery",
      description: "Kubernetes, GitOps, CI/CD, and observability that make shipping safer and operations calmer.",
    },
    {
      title: "Engineering Standards",
      description: "Clear conventions, reusable patterns, and internal tooling that help teams move faster with less chaos.",
    },
  ],
  skills: [
    {
      title: "Languages and APIs",
      items: ["Go", "TypeScript", "gRPC", "REST", "Protobuf", "OpenAPI"],
    },
    {
      title: "Cloud and data",
      items: ["AWS", "GCP", "PostgreSQL", "Redis", "MongoDB", "ArangoDB"],
    },
    {
      title: "Platform and delivery",
      items: ["Kubernetes", "Docker", "Argo CD", "GitHub Actions", "Helm", "Jaeger"],
    },
  ] satisfies TechSkillGroup[],
  experience: [
    {
      company: "Mercury Studio",
      location: "HCMC, Vietnam",
      period: "Jun 2025 - Present",
      role: "Software Engineer - Slotty",
      bullets: [
        "Migrated .NET services to idiomatic Go across edge, integration, and core layers in a 120+ microservice environment.",
        "Delivered CRUD flows for person hierarchy management with strict permission checks and structured audit logging.",
        "Added tracing, Redis caching, and delivery pipeline improvements across Jenkins, Argo CD, and Helm environments.",
      ],
    },
    {
      company: "GTG Software",
      location: "HCMC, Vietnam",
      period: "Jan 2022 - Mar 2025",
      role: "Software Engineer",
      bullets: [
        "Built messaging and platform services in Go across CRM, SaaS, and cloud-based product environments.",
        "Worked with AWS, GCP, Kubernetes, GitHub Actions, Argo CD, Jaeger, Prometheus, and Grafana.",
        "Helped define engineering standards, architecture patterns, and onboarding material for growing teams.",
      ],
    },
  ] satisfies TechExperience[],
  projects: [
    {
      name: "Bazica",
      summary: "Open-source Go library and live demo for generating Ba-zi charts from Solar Calendar dates.",
      impact: "The strongest public proof piece in this ecosystem: open source, live demo, and ongoing maintenance.",
      stack: ["Go", "Open source", "Live demo"],
      href: "https://github.com/tommitoan/bazica",
      liveHref: "https://bazica-web.tommitoan.com/",
      image: "/bazica-screen.png",
    },
    {
      name: "Fedora k3s GitOps Homelab",
      summary: "A personal platform for testing deployment flow, observability, ingress, and self-hosted operations with real constraints.",
      impact: "Acts as a proving ground for infrastructure decisions before they show up in higher-stakes environments.",
      stack: ["k3s", "Argo CD", "Grafana", "Jaeger", "Cloudflared"],
      image: "/homelab-diagram.png",
    },
  ] satisfies TechProject[],
  education: [
    {
      title: "AWS Certified Solutions Architect",
      subtitle: "Associate - Amazon Web Services",
      date: "April 2025",
    },
    {
      title: "B.Sc. Computer Science",
      subtitle: "Ton Duc Thang University",
      date: "2021",
    },
  ] satisfies TechEducationItem[],
  contact: {
    email: "tommitoan1995@gmail.com",
    github: "https://github.com/tommitoan",
    linkedin: "https://www.linkedin.com/in/tommitoan/",
    resume: "https://toanngo.cv",
  },
};
