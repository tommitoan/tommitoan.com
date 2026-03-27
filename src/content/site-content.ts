export type GatewayPanel = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  kind: "external" | "internal";
  cue: string;
  status: string;
  accent: "ice" | "amber" | "cyan";
  layout: "compact" | "feature" | "medium";
  detail: string;
  metrics: string[];
};

export type ProductCard = {
  name: string;
  summary: string;
  status: "Live" | "Preview" | "Planned" | "Private";
  href?: string;
  kind: "library" | "app" | "tool" | "platform";
  note: string;
  stats?: { label: string; value: string }[];
  image?: string;
  cta?: string;
};

type DiscoverChannel = {
  name: string;
  href: string;
  blurb: string;
};

type DiscoverServiceGroup = {
  title: string;
  description: string;
  items: string[];
};

type ProductLane = {
  title: string;
  description: string;
  items: string[];
};

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type HomeCta = {
  label: string;
  href: string;
  kind: "internal" | "external";
  style: "primary" | "secondary";
};

type HomeSignal = {
  label: string;
  value: string;
};

type StickerState = {
  image: string;
  label: string;
  line: string;
};

type WorkItem = {
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
  href?: string;
  kind: "case-study" | "product" | "platform";
  tags: string[];
};

type LabItem = {
  title: string;
  description: string;
  items: string[];
};

type ContactLink = {
  label: string;
  href: string;
  hint: string;
};

export const siteContent = {
  siteMeta: {
    title: "Tommi Toan",
    domain: "https://tommitoan.com",
    description:
      "Space gateway for Toan Ngo covering technology work, discovery routes, Feng Shui product experiments, and contact paths.",
    tagline: "Software engineer building backend systems, homelab platforms, and useful product worlds.",
  },
  navigation: [
    { label: "Home", href: "/#home" },
    { label: "Tech", href: "/tech" },
    { label: "Discover", href: "/discover" },
    { label: "Fengshui", href: "/fengshui" },
  ] satisfies NavItem[],
  home: {
    eyebrow: "Tommi Toan",
    heading: "Software engineer building practical systems for the web.",
    description:
      "I work across Go backend systems, self-hosted infrastructure, and small digital products that are useful enough to ship.",
    supportLine: "A simple front door to my work, current focus, and places to reach me.",
    proof: [
      "Go backend",
      "Self-hosted infrastructure",
      "Product-minded engineering",
    ],
    ctas: [
      { label: "See selected work", href: "/#work", kind: "internal", style: "primary" },
      { label: "Open CV", href: "https://toanngo.cv", kind: "external", style: "secondary" },
    ] satisfies HomeCta[],
    signals: [
      { label: "Current focus", value: "Backend + platform" },
      { label: "Stack", value: "Go, k3s, GitOps" },
      { label: "Public product", value: "Bazica" },
      { label: "Location", value: "Vietnam" },
    ] satisfies HomeSignal[],
    metrics: [
      { value: "4+", label: "Years building" },
      { value: "120+", label: "Service environment" },
      { value: "k3s", label: "Homelab core" },
    ],
    stickerStates: [
      {
        image: "/sticker/sit_1_think.png",
        label: "Quiet mode",
        line: "I like sitting with a problem until the real shape of it shows up.",
      },
      {
        image: "/sticker/sit_2_think.png",
        label: "System mode",
        line: "Then I start separating signal from noise, tradeoffs from aesthetics, and systems from wishes.",
      },
      {
        image: "/sticker/sit_3_idea.png",
        label: "Idea mode",
        line: "The best ideas are the ones that still look good after implementation details arrive.",
      },
    ] satisfies StickerState[],
    note: "If you want the recruiter version first, jump straight to the CV. If you want the broader picture, keep scrolling.",
  },
  work: {
    heading: "Selected work",
    intro:
      "A few things that best represent how I think: useful products, platform work, and backend engineering that holds up in real environments.",
    items: [
      {
        title: "Bazica",
        eyebrow: "Public product",
        description:
          "Open-source Go library and live demo for turning Solar Calendar dates into Ba-zi charts, built as both a real tool and a durable technical artifact.",
        outcome: "Live product, open-source code, and steady public proof.",
        href: "https://bazica-web.tommitoan.com/",
        kind: "product",
        tags: ["Go", "Open source", "Public demo"],
      },
      {
        title: "Slotty microservice environment",
        eyebrow: "Backend engineering",
        description:
          "Daily work across a large Go microservice platform, focusing on implementation quality, service boundaries, contracts, and safe delivery flow.",
        outcome: "Comfort operating in a large, multi-service production environment.",
        kind: "case-study",
        tags: ["Go", "gRPC", "Microservices"],
      },
      {
        title: "Personal homelab platform",
        eyebrow: "Platform work",
        description:
          "A Fedora-based k3s setup for testing deployment flow, observability, ingress, and self-hosted operations with real constraints instead of toy setups.",
        outcome: "A private proving ground for infrastructure decisions and experiments.",
        kind: "platform",
        tags: ["k3s", "Argo CD", "Grafana"],
      },
    ] satisfies WorkItem[],
  },
  lab: {
    heading: "What I run and explore",
    intro:
      "Beyond day-to-day engineering, I like the surrounding system: hosting, deployment, observability, internal tools, and experiments that might become public later.",
    items: [
      {
        title: "Homelab",
        description: "A self-hosted environment for deployment practice and platform thinking.",
        items: ["3-node k3s cluster", "Argo CD sync flow", "Prometheus, Grafana, Loki, Jaeger"],
      },
      {
        title: "Public-facing tools",
        description: "Projects that are already usable or close to becoming public-facing.",
        items: ["Bazica live demo", "mytools.tommitoan.space", "future writing platform"],
      },
      {
        title: "Current interests",
        description: "Areas I keep returning to because they compound well across products and teams.",
        items: ["Backend architecture", "GitOps delivery", "Self-hosted services"],
      },
    ] satisfies LabItem[],
  },
  about: {
    heading: "About",
    paragraphs: [
      "I am Toan Ngo, a software engineer focused on backend systems, infrastructure-minded product work, and clean delivery flow.",
      "I enjoy building things that are practical and durable: services that behave well, tooling that solves a real need, and systems that are easier to operate over time.",
    ],
    principles: ["Keep things clear", "Prefer useful over flashy", "Ship with care", "Stay curious about the full stack"],
  },
  contact: {
    heading: "Contact",
    intro: "The easiest way to reach me is by email or LinkedIn. You can also browse code and public work through the links below.",
    email: "toan.ngo.contact@gmail.com",
    location: "Vietnam",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/tommitoan",
        hint: "Code, experiments, and open-source work",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/tommitoan/",
        hint: "Professional profile and career context",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@727GamingStudio",
        hint: "Demos, experiments, and future technical storytelling",
      },
      {
        label: "Portfolio CV",
        href: "https://toanngo.cv",
        hint: "Recruiter-friendly resume and project proof",
      },
    ] satisfies ContactLink[],
  },
  gatewayPanels: [
    {
      title: "Portfolio",
      eyebrow: "Shuttle Bay",
      description: "Board the shuttle and jump to the professional dossier.",
      href: "https://toanngo.cv",
      kind: "external",
      cue: "Fast route to resume, experience, and project proof.",
      status: "External",
      accent: "ice",
      layout: "compact",
      detail: "A clean departure route for recruiters, hiring managers, and anyone who wants the sharp professional version first.",
      metrics: ["Dossier", "Resume", "Proof"],
    },
    {
      title: "Discover",
      eyebrow: "Star Gate",
      description: "Leave the surface and drift into the broader world behind the resume.",
      href: "/discover",
      kind: "internal",
      cue: "The main route into homelab, experiments, channels, and operating world.",
      status: "Internal",
      accent: "cyan",
      layout: "feature",
      detail: "The emotional center of the site. This is where the moon surface gives way to deeper systems, self-hosting, experiments, and signals.",
      metrics: ["World", "Signals", "Orbit"],
    },
    {
      title: "Products",
      eyebrow: "Excavation Site",
      description: "Dig beneath the moon and uncover products, tools, and hidden output.",
      href: "/products",
      kind: "internal",
      cue: "Artifacts, public tools, launches, and practical output.",
      status: "Internal",
      accent: "amber",
      layout: "medium",
      detail: "A treasure route. Unearth the parts of the ecosystem that are ready to be touched, used, or watched.",
      metrics: ["Relics", "Tools", "Launches"],
    },
  ] satisfies GatewayPanel[],
  discover: {
    heading: "The broader world behind the resume.",
    intro:
      "Discover is where the personal operating system shows up: the homelab, the services I run, the experiments I keep alive, and the channels where I share or test ideas.",
    now: {
      heading: "What this route is for",
      body:
        "I enjoy building backend systems, but I also like the surrounding layers: infrastructure, deployment flow, observability, self-hosted software, and small products that sharpen the whole stack.",
      highlights: [
        "Go backend and microservice work",
        "GitOps delivery on k3s",
        "Self-hosted apps with real operational constraints",
        "Product experiments that can become public tools",
      ],
    },
    homelab: {
      heading: "Fedora k3s GitOps homelab",
      body:
        "A personal Fedora server runs a 3-node k3s cluster with Argo CD, Helm, GitHub Actions, and a full observability layer. It is both a playground and a serious proving ground for deployment flow, service health, and self-hosted operations.",
      stack: [
        "k3s",
        "Argo CD",
        "Helm",
        "GitHub Actions",
        "Prometheus",
        "Grafana",
        "Jaeger",
        "Loki",
        "Alertmanager",
        "Cloudflared",
      ],
      flow: [
        "Commit code and push",
        "Build and publish artifacts",
        "Argo CD syncs desired state",
        "k3s rolls out and health is checked",
      ],
      image: "/homelab-diagram.png",
      imageAlt: "Homelab architecture diagram showing k3s, GitOps, and observability services.",
    },
    services: [
      {
        title: "Public-facing tools",
        description: "Things that can eventually be linked with confidence.",
        items: ["Bazica", "mytools.tommitoan.space", "future blog platform"],
      },
      {
        title: "Private personal surfaces",
        description: "Useful to me, but not part of the public front door.",
        items: ["memos.tommitoan.space", "files.tommitoan.space", "identity.tommitoan.space"],
      },
      {
        title: "Platform signals",
        description: "The infrastructure layer that proves the ecosystem is real.",
        items: ["Grafana and observability", "GitOps app deployment", "Cloudflare tunnel ingress"],
      },
    ] satisfies DiscoverServiceGroup[],
    experiments: [
      {
        title: "Product incubator",
        description: "Small utilities and product ideas that start private, then graduate into public tools when they are coherent enough.",
      },
      {
        title: "Operational playground",
        description: "A place to test deployment flow, service exposure, observability, and self-hosting decisions before they matter elsewhere.",
      },
      {
        title: "Content and teaching surface",
        description: "An eventual home for demos, walkthroughs, short-form content, and writing that connects code with infrastructure.",
      },
    ],
    channels: [
      {
        name: "GitHub",
        href: "https://github.com/tommitoan",
        blurb: "Code, experiments, and open-source output.",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/tommitoan/",
        blurb: "Professional signal and career-facing updates.",
      },
      {
        name: "Facebook",
        href: "https://www.facebook.com/tommitoan1995/",
        blurb: "Personal identity layer and broader presence.",
      },
      {
        name: "YouTube",
        href: "https://www.youtube.com/@727GamingStudio",
        blurb: "Video content, demos, and future technical storytelling.",
      },
    ] satisfies DiscoverChannel[],
  },
  products: {
    heading: "Public products and active experiments.",
    intro:
      "Products is the public-facing output layer: things people can try, use, follow, or wait for. Not every internal surface belongs here, only the ones that are coherent enough to represent the ecosystem well.",
    featured: {
      name: "Bazica",
      summary:
        "Open-source Go library and public demo for converting Solar Calendar dates into Ba-zi charts, built as both a useful product and a durable technical artifact.",
      status: "Live",
      href: "https://bazica-web.tommitoan.com/",
      kind: "library",
      note: "This is the strongest current public product signal: code, releases, community usage, and a live demo.",
      stats: [
        { label: "Stars", value: "23" },
        { label: "Forks", value: "13" },
        { label: "Releases", value: "36" },
      ],
      image: "/bazica-screen.png",
      cta: "Open live demo",
    } satisfies ProductCard,
    cards: [
      {
        name: "Personal Blog Platform",
        summary: "Planned home for technical writing, architecture notes, and publishable personal ideas.",
        status: "Planned",
        kind: "platform",
        note: "This will turn scattered posts and ideas into a structured public writing surface.",
      },
      {
        name: "Selected Public Tools",
        summary: "Carefully curated utilities from the broader ecosystem, shown only when they are ready.",
        status: "Preview",
        kind: "tool",
        note: "Only public-safe tools should appear here. Private admin surfaces remain outside the public hub.",
      },
      {
        name: "Work Tools Gateway",
        summary: "A future bridge to practical tools that are stable enough to be presented as product surfaces.",
        status: "Preview",
        kind: "app",
        note: "Useful internal tools may eventually graduate into public-facing product entries if access and presentation are appropriate.",
      },
    ] satisfies ProductCard[],
    lanes: [
      {
        title: "Live now",
        description: "Things you can click and evaluate today.",
        items: ["Bazica live demo", "Open-source repository", "Product proof through releases and community usage"],
      },
      {
        title: "Next to ship",
        description: "The most likely public surfaces to appear after the foundation settles.",
        items: ["Personal blog platform", "Selected utilities from the tool ecosystem", "Lightweight public experiments"],
      },
      {
        title: "Kept private on purpose",
        description: "Things that may exist operationally but should not be promoted here yet.",
        items: ["Memos and notes", "File management and identity surfaces", "Admin or infra-only interfaces"],
      },
    ] satisfies ProductLane[],
    guardrail:
      "A product page should increase trust, not curiosity at any cost. If a tool is unfinished, private, or contextless, it should stay out of the public hub until it earns the right to be here.",
  },
  footer: {
    note: "tommitoan.com is now the main gateway for Tech, Discover, and Fengshui routes. The external CV remains available when needed.",
  },
};
