type NavigationItem = {
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

type SkillItem = {
  name: string;
  icon?: string;
};

type SkillGroup = {
  title: string;
  accent: string;
  items: SkillItem[];
};

type SubProject = {
  name: string;
  period: string;
  bullets: string[];
  isInternship?: boolean;
};

type ExperienceItem = {
  company: string;
  location: string;
  period: string;
  role: string;
  current?: boolean;
  bullets?: string[];
  subProjects?: SubProject[];
};

type ProjectItem = {
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

type EducationItem = {
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
    role: "Go engineer building production backend systems and cloud-native products.",
    description:
      "~5 years building and operating production backend systems across legal-tech SaaS, B2B gaming, and CRM — Go, REST/gRPC APIs, concurrent and event-driven workloads with Temporal and Kafka, and legacy-to-Go service migrations. AWS Certified Solutions Architect.",
    highlights: ["Go and gRPC", "Temporal Workflows", "AWS Certified", "Kubernetes & GitOps"],
    ctas: [
      { label: "View Projects", href: "#projects", variant: "primary" },
      { label: "Download Resume", href: "/ToanNgo-resume.pdf", variant: "secondary" },
      { label: "Contact Me", href: "#contact", variant: "secondary" }
    ] satisfies ActionLink[],
    metrics: [
      { value: "5", label: "Years Experience" },
      { value: "120+", label: "Microservices" },
      { value: "AWS", label: "Certified SAA" }
    ]
  },

  about: {
    intro:
      "I build backend systems that are fast, observable, and built to last. My work spans Go microservices, event-driven architecture, cloud infrastructure, CI/CD, and the product thinking needed to turn technical foundations into usable software.",
    points: [
      "Go is my primary language across legal-tech SaaS, B2B gaming, and CRM — REST and gRPC APIs, event-driven workflows with Temporal, Kafka, and RabbitMQ, and PostgreSQL and Redis at the data layer.",
      "I modernise legacy services to Go — from TypeScript, .NET/C#, and Perl — preserving integration contracts while improving maintainability and test coverage.",
      "I work across AWS and GCP with Kubernetes, Docker, Jenkins, ArgoCD, and Helm — designing deployment pipelines and observability stacks (Jaeger, Prometheus, Loki, VictoriaMetrics) that teams can rely on.",
      "I own backend features from design and implementation through deployment, observability, and production troubleshooting — root-causing hangs, reviewing code for correctness and maintainability, and building internal tooling that eliminates manual toil."
    ],
    actions: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tommitoan/", variant: "primary" },
      { label: "GitHub", href: "https://github.com/tommitoan", variant: "secondary" }
    ] satisfies ActionLink[],
    principles: [
      {
        title: "Backend Engineering",
        description:
          "Go services, gRPC, Temporal workflows, event-driven systems, and clean architecture form the core of my work. I care about correctness, observability, and maintainability at every layer."
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
        { name: "Go", icon: "/skills/go.svg" },
        { name: "TypeScript", icon: "/skills/typescript.svg" },
        { name: "JavaScript", icon: "/skills/javascript.svg" },
        { name: "SQL" }
      ]
    },
    {
      title: "Backend & API",
      accent: "cyan",
      items: [
        { name: "gRPC", icon: "/skills/grpc.svg" },
        { name: "Protobuf" },
        { name: "REST" },
        { name: "Temporal" },
        { name: "WebSocket" },
        { name: "Kafka", icon: "/skills/kafka.svg" },
        { name: "RabbitMQ", icon: "/skills/rabbitmq.svg" },
        { name: "JWT" },
        { name: "OAuth2" }
      ]
    },
    {
      title: "Databases",
      accent: "pink",
      items: [
        { name: "PostgreSQL", icon: "/skills/postgresql.svg" },
        { name: "Redis", icon: "/skills/redis.svg" },
        { name: "MongoDB", icon: "/skills/mongodb.svg" },
        { name: "ArangoDB", icon: "/skills/arangodb.svg" }
      ]
    },
    {
      title: "Cloud & Infra",
      accent: "blue",
      items: [
        { name: "AWS", icon: "/skills/aws.svg" },
        { name: "GCP", icon: "/skills/gcp.svg" },
        { name: "Kubernetes", icon: "/skills/kubernetes.svg" },
        { name: "Docker", icon: "/skills/docker.svg" }
      ]
    },
    {
      title: "CI/CD & Obs.",
      accent: "amber",
      items: [
        { name: "Jenkins", icon: "/skills/jenkins.svg" },
        { name: "Argo CD", icon: "/skills/argocd.svg" },
        { name: "GitHub Actions", icon: "/skills/github-actions.svg" },
        { name: "Helm", icon: "/skills/helm.svg" },
        { name: "Jaeger" },
        { name: "Prometheus", icon: "/skills/prometheus.svg" },
        { name: "Loki" },
        { name: "VictoriaMetrics" }
      ]
    },
    {
      title: "AI Tools",
      accent: "emerald",
      items: [
        { name: "Claude Code", icon: "/skills/claude.svg" },
        { name: "OpenCode" },
        { name: "GitHub Copilot", icon: "/skills/github-copilot.svg" },
        { name: "Anthropic API" }
      ]
    }
  ] satisfies SkillGroup[],

  experience: [
    {
      company: "Legal-Tech SaaS Startup",
      location: "US (Remote)",
      period: "Jan 2026 — Present",
      role: "Software Engineer (Independent Contractor) — Legal-document platform for personal injury firms",
      current: true,
      bullets: [
        "Own end-to-end features across 5+ Go/TypeScript services for a legal-document platform producing demand letters, medical chronologies, and exhibits for personal injury firms.",
        "Root-caused a multi-hour hang in a production Temporal workflow by reproducing it with a synthetic 17k-page workload; identified a missing activity heartbeat timeout, added failure detection, and converted memory-heavy pipeline stages to streaming I/O.",
        "Migrated provider API endpoints from TypeScript to Go, preserving integration contracts; wrote unit and integration tests and targeted E2E scripts to reproduce defects and verify feature behavior before rollout.",
        "Built cross-service cost and timing telemetry through six REST endpoints across two document-processing providers, using a non-fatal reporting path so observability failures cannot block the core workflow.",
        "Review backend pull requests for correctness and maintainability, checking function and API clarity, unit/integration test cases, Docker-based local reproducibility, and end-to-end behavior before merge."
      ]
    },
    {
      company: "Mercury Studio",
      location: "HCMC, Vietnam",
      period: "Jan 2025 — Dec 2025",
      role: "Software Engineer — Slotty (B2B gaming backend, 120+ Go microservices)",
      bullets: [
        "Migrated .NET/C# services to idiomatic Go across Edge, Integration, and Core layers; used concurrent Go processing for monthly report generation/export while delivering backend workflows including audit logging and hierarchical authorization.",
        "Added Jaeger tracing and Redis Cluster caching to hot read paths, reducing repeated downstream gRPC calls; maintained Jenkins, ArgoCD, and Helm delivery across development, staging, and production.",
        "Built MyTools, an internal Go/React dashboard that replaced manual PostgreSQL and Redis lookups, reducing a common support workflow from about five minutes to five seconds and gaining team-wide adoption."
      ]
    },
    {
      company: "GTG Software",
      location: "HCMC, Vietnam",
      period: "Jan 2022 — Dec 2024",
      role: "Software Engineer",
      subProjects: [
        {
          name: "GTG CRM",
          period: "Feb 2024 — Dec 2024",
          bullets: [
            "Designed and built the real-time messaging core of a CRM platform in Go using gRPC, WebSocket, MongoDB, and OAuth2/Keycloak; modeled MongoDB collections and queries to normalize conversation data across integrations including Facebook, Slack, Gmail, and Yahoo.",
            "Implemented concurrent message-history retrieval in Go and deployed and operated services on AWS EKS, using VictoriaMetrics, Loki, and Jaeger for production monitoring and troubleshooting.",
            "Contributed shared coding standards and architecture patterns for the microservice layer."
          ]
        },
        {
          name: "Tokeet",
          period: "Jun 2023 — Feb 2024",
          bullets: [
            "Rewrote a legacy Perl messaging service in Go for the Tokeet property-management platform, adding multi-channel conversation tracking and OAuth2 integrations behind a consistent service layer.",
            "Introduced Amazon SQS fan-out for parallel processing and wrote deployment docs enabling non-technical project managers to manage the app on AWS."
          ]
        },
        {
          name: "Internship",
          period: "Jan 2022 — Jun 2022",
          isInternship: true,
          bullets: [
            "Built Go/PostgreSQL microservices for business workflows — data modelling, CRUD, input validation, and endpoint integration — with Kafka-based idempotent processing to prevent duplicate consumption."
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
