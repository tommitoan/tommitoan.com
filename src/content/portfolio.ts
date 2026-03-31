export type NavigationItem = {
  id: string;
  label: string;
};

type ActionLink = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

type Principle = {
  title: string;
  description: string;
};

export type SkillItem = {
  name: string;
  icon?: string;
};

type SkillGroup = {
  title: string;
  accent: string;
  items: SkillItem[];
};

export type SubProject = {
  name: string;
  period: string;
  bullets: string[];
  isInternship?: boolean;
};

export type ExperienceItem = {
  company: string;
  location: string;
  period: string;
  role: string;
  bullets?: string[];
  subProjects?: SubProject[];
};

export type ProjectItem = {
  name: string;
  summary: string;
  impact: string;
  stack: string[];
  href: string;
  stats?: { label: string; value: string }[];
  diagram?: string;
  image?: string;
  imagePosition?: string;
};

export type EducationItem = {
  type: "cert" | "degree";
  title: string;
  subtitle: string;
  date: string;
  href?: string;
};

export const portfolio = {
  navigation: [
    { id: "about", label: "Overview" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Journey" },
    { id: "education", label: "Credentials" },
    { id: "projects", label: "Projects" }
  ] satisfies NavigationItem[],

  hero: {
    eyebrow: "Software Engineer",
    lead: "Hi, I'm",
    name: "Toan Ngo",
    handle: "@tommitoan",
    role: "Go Developer building scalable backend systems and cloud-native products.",
    description:
      "4+ years building Go microservices across B2B gaming, CRM, and SaaS — specialising in event-driven architecture, service migration, and shipping internal tooling that compresses workflows from minutes to seconds. AWS Certified Solutions Architect.",
    highlights: ["Go and gRPC", "AWS Certified", "Kubernetes & GitOps"],
    ctas: [
      { label: "View Projects", href: "#projects", variant: "primary" },
      { label: "Download Resume", href: "/ToanNgo-resume.pdf", variant: "secondary" },
      { label: "Contact Me", href: "#contact", variant: "secondary" }
    ] satisfies ActionLink[],
    metrics: [
      { value: "4+", label: "Years Experience" },
      { value: "120+", label: "Microservices" },
      { value: "AWS", label: "Certified SAA" }
    ]
  },

  about: {
    intro:
      "I build backend systems that are fast, observable, and built to last. My work spans Go microservices, event-driven architecture, cloud infrastructure, CI/CD, and the product thinking needed to turn technical foundations into usable software.",
    points: [
      "I specialise in Go microservice architecture across B2B gaming, CRM, and SaaS — including .NET-to-Go service migration, gRPC API design, and event-driven patterns with Kafka and RabbitMQ.",
      "I work across AWS and GCP with Kubernetes, Docker, Jenkins, ArgoCD, and Helm — designing deployment pipelines and observability stacks (Jaeger, Prometheus, Grafana) that teams can rely on.",
      "I establish engineering standards and architecture patterns that keep codebases consistent as teams grow — and I build internal tooling that eliminates manual toil.",
      "I contribute across the stack when needed: React + TypeScript frontends, product alignment with stakeholders, architecture docs, and cross-team API contract coordination."
    ],
    actions: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tommitoan/", variant: "primary" },
      { label: "GitHub", href: "https://github.com/tommitoan", variant: "secondary" }
    ] satisfies ActionLink[],
    principles: [
      {
        title: "Backend Engineering",
        description:
          "Go microservices, gRPC, event-driven systems, and clean architecture form the core of my work. I care about correctness, observability, and maintainability at every layer."
      },
      {
        title: "Cloud & Delivery",
        description:
          "AWS, GCP, Kubernetes, and GitOps workflows that make releases reliable and operations boring — in the best possible way."
      },
      {
        title: "Engineering Standards",
        description:
          "I establish coding conventions, architecture patterns, and internal tooling so teams ship faster and systems stay consistent as they scale."
      }
    ] satisfies Principle[]
  },

  skills: [
    {
      title: "Languages",
      accent: "violet",
      items: [
        { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" },
        { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
        { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
        { name: "SQL" }
      ]
    },
    {
      title: "Backend & API",
      accent: "cyan",
      items: [
        { name: "gRPC", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grpc/grpc-plain.svg" },
        { name: "Protobuf" },
        { name: "gRPC-Gateway" },
        { name: "REST" },
        { name: "Kafka", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg" },
        { name: "RabbitMQ", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg" },
        { name: "JWT" },
        { name: "OAuth2" }
      ]
    },
    {
      title: "Databases",
      accent: "pink",
      items: [
        { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
        { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
        { name: "ArangoDB", icon: "https://cdn.simpleicons.org/arangodb/white" }
      ]
    },
    {
      title: "Cloud & Infra",
      accent: "blue",
      items: [
        { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "GCP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" },
        { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" }
      ]
    },
    {
      title: "CI/CD & Obs.",
      accent: "amber",
      items: [
        { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" },
        { name: "Argo CD", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/argocd/argocd-original.svg" },
        { name: "GitHub Actions", icon: "https://cdn.simpleicons.org/githubactions/white" },
        { name: "Helm", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/helm/helm-original.svg" },
        { name: "Jaeger" },
        { name: "Prometheus", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prometheus/prometheus-original.svg" }
      ]
    },
    {
      title: "AI Tools",
      accent: "emerald",
      items: [
        { name: "GitHub Copilot", icon: "https://cdn.simpleicons.org/githubcopilot/white" },
        { name: "OpenCode" },
        { name: "ChatGPT" },
        { name: "Claude", icon: "https://cdn.simpleicons.org/claude/white" }
      ]
    }
  ] satisfies SkillGroup[],

  experience: [
    {
      company: "Mercury Studio",
      location: "HCMC, Vietnam",
      period: "Jun 2025 — Present",
      role: "Software Engineer — Slotty (B2B gaming backend, 120+ Go microservices)",
      bullets: [
        "Migrated .NET/C# backend services to idiomatic Go across Edge, Integration, and Core layers; scaffolded new services where no Go counterpart existed; coordinated API contracts and gRPC-Gateway routing changes with the frontend team.",
        "Delivered full CRUD for a 3-tier person hierarchy (agents, players, sub-accounts) — create, update, suspend/disable, delete — with strict 1-level downline permission checks enforced across integration/agent, integration/sub_account, and integration/supporter.",
        "Implemented structured audit logging via core/audit covering all write operations, giving operators a complete, queryable trail of every downline action.",
        "Instrumented migrated services with Jaeger end-to-end tracing and Redis Cluster caching with a structured key naming convention, cutting repeated downstream gRPC calls on hot read paths.",
        "Maintained Jenkins CI/CD pipelines with parallel Docker builds and GitOps deployment via ArgoCD + Helm across dev, staging, and production environments.",
        "Built MyTools, an internal Go + React developer dashboard replacing manual DB/Redis queries for person lookup, API diffing, and cache cloning — compressing a ~5-minute workflow to ~5 seconds, adopted by the whole team."
      ]
    },
    {
      company: "GTG Software",
      location: "HCMC, Vietnam",
      period: "Jan 2022 — Mar 2025",
      role: "Software Engineer",
      subProjects: [
        {
          name: "GTG CRM",
          period: "Feb 2024 — Mar 2025",
          bullets: [
            "Architected the real-time messaging core of a HubSpot-alternative CRM from scratch using Go, gRPC, and WebSocket with OAuth2 (Keycloak); deployed to AWS EKS via GitHub Actions + ArgoCD with full observability (VictoriaMetrics, Loki, Jaeger).",
            "Designed the omni-channel messaging service as the platform's core feature, integrating across contact management, marketing, sales, and service hubs for a competitive launch.",
            "Established team-wide coding standards and architecture patterns for the microservice layer.",
            "Participated in Figma design reviews and aligned technical decisions with the CEO; documented architecture and workflows in Confluence to onboard new engineers."
          ]
        },
        {
          name: "Tokeet",
          period: "Jun 2023 — Feb 2024",
          bullets: [
            "Re-wrote a legacy Perl messaging system in Go; introduced multi-channel conversation tracking, OAuth2 cloud integrations, and Amazon SQS fan-out for parallel processing.",
            "Built centralised conversation tracking with Go design patterns for maintainability; wrote deployment docs enabling non-technical project managers to manage the app on AWS."
          ]
        },
        {
          name: "Trydome",
          period: "Jun 2022 — Jun 2023",
          bullets: [
            "Optimised critical PostgreSQL queries, integrated Stripe billing via REST API, and designed a FluxCD GitOps pipeline automating cloud database deployment for end customers.",
            "Cleaned and validated legacy customer data to improve reporting accuracy and overall data reliability across the platform.",
            "Collaborated on REST API design and infrastructure provisioning across AWS and GCP using FluxCD-based GitOps for automated customer database configuration management."
          ]
        },
        {
          name: "Internship",
          period: "Jan 2022 — Jun 2022",
          isInternship: true,
          bullets: [
            "Built and maintained Go microservices with PostgreSQL for business workflows — data modelling, CRUD, input validation, and endpoint integration; implemented Kafka-based async processing with an idempotency mechanism to prevent duplicate consumption."
          ]
        }
      ]
    }
  ] satisfies ExperienceItem[],

  projects: [
    {
      name: "bazica",
      summary:
        "Open-source Go library that converts Solar Calendar dates to Ba-zi charts (Chinese Four Pillars of Destiny astrology) — year, month, day, and hour pillars with Heavenly Stems and Earthly Branches.",
      impact:
        "Published and actively maintained across 36 releases. 23 stars and 13 forks from the community. Live demo at bazica-web.tommitoan.com.",
      stack: ["Go", "MIT License", "pkg.go.dev"],
      href: "https://github.com/tommitoan/bazica",
      image: "/projects/bazica/preview.png",
      imagePosition: "50% 30%",
      stats: [
        { label: "Stars", value: "23" },
        { label: "Forks", value: "13" },
        { label: "Releases", value: "36" }
      ]
    },
    {
      name: "Fedora k3s GitOps Homelab",
      summary:
        "Personal Fedora server running a 3-node k3s cluster with full GitOps via Argo CD — hosting Go microservices, self-hosted apps, and a complete observability stack exposed securely via Cloudflared tunnel.",
      impact:
        "Commit → GitHub Actions → Argo CD Sync → k3s Deploy → Health Checks → Live. Prometheus + Grafana + Jaeger + Loki + Alertmanager with Redis Cluster Operator and MinIO storage.",
      stack: ["k3s", "Argo CD", "Helm", "GitHub Actions", "Prometheus", "Grafana", "Jaeger", "Redis Cluster", "Nginx Ingress", "Cloudflared"],
      href: "",
      diagram: "/discover/homelab/diagram.png",
      imagePosition: "50% 15%"
    }
  ] satisfies ProjectItem[],

  education: [
    {
      type: "cert",
      title: "AWS Certified Solutions Architect",
      subtitle: "Associate — Amazon Web Services",
      date: "April 2025",
      href: "https://www.credly.com/badges/932311b1-53f9-4537-af83-b93a64a3261b"
    },
    {
      type: "degree",
      title: "B.Sc. Computer Science",
      subtitle: "Ton Duc Thang University",
      date: "2021"
    }
  ] satisfies EducationItem[],

  educationLanguages: "English  B1+  ·  Vietnamese  Native",

  contact: {
    heading: "Let's build something reliable",
    description:
      "Based in Ho Chi Minh City, focused on backend engineering, cloud infrastructure, and product-oriented system design. If you want to discuss a role or a project, these are the fastest ways to reach me.",
    links: [
      {
        label: "Email",
        value: "tommitoan1995@gmail.com",
        href: "mailto:tommitoan1995@gmail.com"
      },
      {
        label: "GitHub",
        value: "github.com/tommitoan",
        href: "https://github.com/tommitoan"
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/tommitoan",
        href: "https://www.linkedin.com/in/tommitoan/"
      }
    ]
  },

  footer: {
    note: "Toan Ngo — Software Engineer focused on Go, cloud infrastructure, and scalable backend systems.",
    meta: "Ho Chi Minh City, Vietnam"
  }
};
